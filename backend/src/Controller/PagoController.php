<?php

namespace App\Controller;

use App\Entity\Pago;
use App\Entity\Pedido;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class PagoController extends AbstractController
{
    #[Route('/api/pago', name: 'api_pago_crear', methods:['POST'])]
    public function crearPago(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['pedido_id'])) {
            return $this->json(['error' => 'Pedido no especificado'], 400);
        }

        $pedido = $em->getRepository(Pedido::class)->find($data['pedido_id']);
        if (!$pedido) {
            return $this->json(['error' => 'Pedido no encontrado'], 404);
        }

        $metodoPago = $data['metodo_pago'] ?? 'contra_reembolso';
        $monto = $data['monto'] ?? $pedido->getTotal();

        $pago = new Pago();
        $pago->setPedido($pedido)
             ->setMetodoPago($metodoPago)
             ->setMonto($monto)
             ->setFechaPago(new \DateTime())
             ->setEstadoPago('completado'); // simulado

        $em->persist($pago);
        $em->flush();

        return $this->json([
            'status' => 'success',
            'message' => "Pago registrado para el pedido #{$pedido->getId()}",
            'pago_id' => $pago->getId(),
            'pedido_id' => $pedido->getId(),
            'monto' => $monto,
            'metodo_pago' => $metodoPago
        ]);
    }

    #[Route('/api/pagos', name: 'api_pago_listar', methods:['GET'])]
    public function listarPagos(EntityManagerInterface $em, Request $request): JsonResponse
    {
        $pedidoId = $request->query->get('pedido_id');

        if ($pedidoId) {
            $pagos = $em->getRepository(Pago::class)->findBy(['pedido' => $pedidoId]);
        } else {
            $pagos = $em->getRepository(Pago::class)->findAll();
        }

        $data = array_map(fn(Pago $pago) => [
            'id' => $pago->getId(),
            'pedido_id' => $pago->getPedido()->getId(),
            'metodo_pago' => $pago->getMetodoPago(),
            'monto' => $pago->getMonto(),
            'fecha_pago' => $pago->getFechaPago()->format('Y-m-d H:i:s'),
            'estado_pago' => $pago->getEstadoPago(),
        ], $pagos);

        return $this->json($data);
    }
}
