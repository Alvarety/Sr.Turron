<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Pago;
use App\Entity\Pedido;
use App\Entity\Usuario;
use App\Entity\Producto;
use App\Entity\PedidoDetalle;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Messenger\SendEmailMessage;

final class PedidoController extends AbstractController
{
    // =========================
    // ✅ Listar pedidos
    // =========================
    #[Route('/api/pedidos', name:'api_pedidos_listar', methods:['GET'])]
    public function listarPedidos(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $usuarioId = $request->query->get('usuario_id');
        $usuarioRepo = $em->getRepository(Usuario::class);
        $pedidoRepo = $em->getRepository(Pedido::class);

        // Si no viene usuario_id, devolver error
        if (!$usuarioId) {
            return $this->json(['error' => 'usuario_id no enviado'], 400);
        }

        $usuario = $usuarioRepo->find($usuarioId);
        if (!$usuario) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        // 🔹 Si es admin, ver todos los pedidos
        if ($usuario->getRol() === 'admin') {
            $pedidos = $pedidoRepo->findAll();
        } else {
            // 🔹 Si es cliente, solo sus pedidos
            $pedidos = $pedidoRepo->findBy(['usuario' => $usuario]);
        }

        $data = array_map(fn(Pedido $pedido) => [
            'id' => $pedido->getId(),
            'fecha' => $pedido->getFechapedido()->format('Y-m-d H:i:s'),
            'estado' => $pedido->getEstado(),
            'total' => $pedido->getTotal(),
            'direccion_envio' => $pedido->getDireccionEnvio(),
            'usuario' => [
                'id' => $pedido->getUsuario()->getId(),
                'nombre' => $pedido->getUsuario()->getNombre(),
                'email' => $pedido->getUsuario()->getEmail(),
            ],
        ], $pedidos);

        return $this->json($data);
    }

    // =========================
    // Crear nuevo pedido
    // =========================
    #[Route('/api/pedidos', name:'api_pedidos_crear', methods:['POST'])]
    public function crearPedido(EntityManagerInterface $em, Request $request, MessageBusInterface $bus): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['usuario_id']) || !isset($data['productos'])) {
            return $this->json(['error' => 'Datos incompletos'], 400);
        }

        $usuario = $em->getRepository(Usuario::class)->find($data['usuario_id']);
        if (!$usuario) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $pedido = new Pedido();
        $pedido->setUsuario($usuario);
        $pedido->setEstado('pendiente');
        $pedido->setFechapedido(new \DateTime());

        $total = 0;
        $erroresStock = [];

        foreach ($data['productos'] as $prodData) {
            $producto = $em->getRepository(Producto::class)->find($prodData['id']);
            if (!$producto) continue;

            $cantidad = (int)($prodData['cantidad'] ?? 1);
            $precioUnitario = $producto->getPrecio();

            if ($producto->getStock() < $cantidad) {
                $erroresStock[] = [
                    'producto' => $producto->getNombre(),
                    'disponible' => $producto->getStock(),
                    'solicitado' => $cantidad
                ];
                continue;
            }

            $subtotal = $precioUnitario * $cantidad;
            $total += $subtotal;

            $detalle = new PedidoDetalle();
            $detalle->setPedido($pedido);
            $detalle->setProducto($producto);
            $detalle->setCantidad($cantidad);
            $detalle->setPrecioUnitario($precioUnitario);
            $detalle->setSubtotal($subtotal);

            $producto->setStock($producto->getStock() - $cantidad);

            $em->persist($detalle);
            $em->persist($producto);
        }

        if (!empty($erroresStock)) {
            return $this->json([
                'error' => 'Algunos productos no tienen stock suficiente',
                'detalles' => $erroresStock,
            ], 400);
        }

        $pedido->setTotal($total);
        $pedido->setDireccionEnvio($data['direccion_envio'] ?? '');
        $em->persist($pedido);
        $em->flush();

        // 🔹 Crear Pago asociado al pedido
        // $pago = new Pago();
        // $pago->setPedido($pedido)
        //     ->setMonto($total)
        //     ->setMetodoPago($data['metodo_pago'] ?? 'contra_reembolso')
        //     ->setFechaPago(new \DateTime())
        //     ->setEstadoPago('completado'); // simulado

        // $em->persist($pago);
        // $em->flush();

        // ========================
        // 🔹 Enviar correo con los detalles del pedido
        // ========================
        $contenidoProductos = '';
        foreach ($pedido->getPedidoDetalles() as $detalle) {
            $contenidoProductos .= sprintf(
                "- %s: %d x %.2f€ = %.2f€\n",
                $detalle->getProducto()->getNombre(),
                $detalle->getCantidad(),
                $detalle->getPrecioUnitario(),
                $detalle->getSubtotal()
            );
        }

        $email = (new Email())
            ->from('tienda@example.com')
            ->to($usuario->getEmail())
            ->subject('Tu pedido ha sido recibido')
            ->text(
                "Hola {$usuario->getNombre()},\n\n" .
                "Tu pedido #{$pedido->getId()} se ha completado correctamente.\n\n" .
                "Detalles del pedido:\n{$contenidoProductos}\n" .
                "Total: {$pedido->getTotal()}€\n\n" .
                "Gracias por comprar con nosotros."
            );

        $bus->dispatch(new SendEmailMessage($email));

        return $this->json([
            'message' => '✅ Pedido creado correctamente y correo enviado',
            'pedido_id' => $pedido->getId(),
            'total' => $total,
        ]);
    }

    // =========================
    // Modificar pedido
    // =========================
    #[Route('/api/pedidos/{id}', name:'api_pedidos_modificar', methods:['PUT'])]
    public function modificarPedido(EntityManagerInterface $em, Request $request, int $id): JsonResponse
    {
        $pedido = $em->getRepository(Pedido::class)->find($id);
        if (!$pedido) {
            return $this->json(['error'=>'Pedido no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['estado'])) $pedido->setEstado($data['estado']);
        if (isset($data['total'])) $pedido->setTotal($data['total']);
        if (isset($data['direccion_envio'])) $pedido->setDireccionEnvio($data['direccion_envio']);

        $em->flush();

        return $this->json([
            'message' => 'Pedido actualizado correctamente',
            'pedido_id' => $pedido->getId(),
        ]);
    }

    // =========================
    // Eliminar pedido
    // =========================
    #[Route('/api/pedidos/{id}', name:'api_pedidos_eliminar', methods:['DELETE'])]
    public function eliminarPedido(EntityManagerInterface $em, int $id): JsonResponse
    {
        $pedido = $em->getRepository(Pedido::class)->find($id);
        if (!$pedido) {
            return $this->json(['error'=>'Pedido no encontrado'], 404);
        }

        $em->remove($pedido);
        $em->flush();

        return $this->json([
            'message' => 'Pedido eliminado correctamente',
            'pedido_id' => $id,
        ]);
    }

    // =========================
    // ✅ Obtener un pedido por ID
    // =========================
    #[Route('/api/pedidos/{id}', name:'api_pedidos_ver', methods:['GET'])]
    public function verPedido(EntityManagerInterface $em, int $id): JsonResponse
    {
        $pedido = $em->getRepository(Pedido::class)->find($id);
        if (!$pedido) {
            return $this->json(['error'=>'Pedido no encontrado'], 404);
        }

        $data = [
            'id' => $pedido->getId(),
            'fecha' => $pedido->getFechapedido()->format('Y-m-d H:i:s'),
            'estado' => $pedido->getEstado(),
            'total' => $pedido->getTotal(),
            'direccion_envio' => $pedido->getDireccionEnvio(),
            'usuario' => [
                'id' => $pedido->getUsuario()->getId(),
                'nombre' => $pedido->getUsuario()->getNombre(),
                'email' => $pedido->getUsuario()->getEmail(),
            ],
            'detalles' => array_map(fn($d) => [
                'producto' => $d->getProducto()->getNombre(),
                'cantidad' => $d->getCantidad(),
                'precio_unitario' => $d->getPrecioUnitario(),
                'subtotal' => $d->getSubtotal()
            ], $pedido->getPedidoDetalles()->toArray())
        ];

        return $this->json($data);
    }
}
