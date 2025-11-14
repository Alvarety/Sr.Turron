<?php

namespace App\Controller;

use App\Entity\Resena;
use App\Entity\Producto;
use App\Entity\Usuario;
use App\Entity\Comentario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Messenger\SendEmailMessage;
use Symfony\Component\Messenger\MessageBusInterface;

class ResenaController extends AbstractController
{
    // Obtener reseñas de un producto
    #[Route('/api/productos/{id}/resenas', methods: ['GET'])]
    public function getResenas(EntityManagerInterface $em, int $id): JsonResponse
    {
        $resenas = $em->getRepository(Resena::class)->findBy(['producto' => $id], ['fecha' => 'DESC']);
        $data = [];

        foreach ($resenas as $r) {
            $data[] = [
                'id' => $r->getId(),
                'usuario' => $r->getUsuario()->getNickname(),
                'comentario' => $r->getComentario(),
                'puntuacion' => $r->getPuntuacion(),
                'fecha' => $r->getFecha()->format('Y-m-d H:i'),
                'respuestas' => array_map(fn($c) => [
                    'usuario' => $c->getUsuario()->getNickname(),
                    'texto' => $c->getTexto(),
                    'fecha' => $c->getFecha()->format('Y-m-d H:i'),
                ], $r->getComentarios()->toArray())
            ];
        }

        return $this->json($data);
    }

    // Crear reseña nueva
    #[Route('/api/resenas', methods: ['POST'])]
    public function crearResena(
        Request $request,
        EntityManagerInterface $em,
        MessageBusInterface $bus // 👈 inyección del servicio
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $usuario = $em->getRepository(Usuario::class)->find($data['usuario_id']);
        $producto = $em->getRepository(Producto::class)->find($data['producto_id']);

        if (!$usuario || !$producto) {
            return $this->json(['error' => 'Usuario o Producto inválido'], 400);
        }

        // Evitar reseña duplicada
        $existe = $em->getRepository(Resena::class)->findOneBy([
            'usuario' => $usuario,
            'producto' => $producto
        ]);

        if ($existe) {
            return $this->json(['error' => 'Ya has reseñado este producto'], 409);
        }

        // Crear reseña
        $resena = new Resena();
        $resena->setUsuario($usuario);
        $resena->setProducto($producto);
        $resena->setComentario($data['comentario']);
        $resena->setPuntuacion($data['puntuacion']);

        $em->persist($resena);
        $em->flush();

        //
        // 🔔 **ENVÍO DE EMAIL AL ADMIN**
        //
        $email = (new Email())
            ->from('notificaciones@srturron.com')
            ->to('candonromeroalvaro2@gmail.com') // 👉 TU CORREO
            ->subject('Nueva reseña recibida en Sr. Turrón')
            ->text(
                "Nueva reseña publicada:\n\n" .
                "Usuario: {$usuario->getNickname()} ({$usuario->getEmail()})\n" .
                "Producto: {$producto->getNombre()}\n" .
                "Puntuación: {$data['puntuacion']} / 5\n\n" .
                "Comentario:\n{$data['comentario']}\n\n" .
                "Fecha: " . (new \DateTime())->format('Y-m-d H:i') . "\n"
            );

        // Enviar por Messenger
        $bus->dispatch(new SendEmailMessage($email));

        return $this->json(['message' => 'Reseña añadida correctamente']);
    }

    // Crear comentario en una reseña
    #[Route('/api/resenas/{id}/comentarios', methods: ['POST'])]
    public function comentarResena(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        MailerInterface $mailer
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $usuario = $em->getRepository(Usuario::class)->find($data['usuario_id']);
        $resena = $em->getRepository(Resena::class)->find($id);

        if (!$usuario || !$resena) {
            return $this->json(['error' => 'Usuario o Reseña inválidos'], 400);
        }

        $comentario = new Comentario();
        $comentario->setUsuario($usuario);
        $comentario->setResena($resena);
        $comentario->setTexto($data['texto']);

        $em->persist($comentario);
        $em->flush();

        // Obtener producto de la reseña
        $producto = $resena->getProducto();

        // Enviar email de notificación
        $email = (new Email())
            ->from('notificaciones@srturron.com')
            ->to('candonromeroalvaro2@gmail.com') // Tu correo
            ->subject('Nuevo comentario en una reseña de Sr. Turrón')
            ->text(
                "Se ha publicado un nuevo comentario en una reseña:\n\n" .
                "Usuario: {$usuario->getNickname()} ({$usuario->getEmail()})\n" .
                "Producto: {$producto->getNombre()}\n" .
                "Comentario:\n{$comentario->getTexto()}\n\n" .
                "Fecha: " . (new \DateTime())->format('Y-m-d H:i') . "\n"
            );

        $mailer->send($email);

        return $this->json(['message' => 'Comentario añadido y notificación enviada correctamente']);
    }
}
