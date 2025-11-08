<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

class ContactoController extends AbstractController
{
    #[Route('/api/contacto/enviar', name: 'api_contacto', methods: ['POST'])]
    public function contacto(Request $request, MailerInterface $mailer): JsonResponse
    {
        // 1️⃣ Comprobar usuario logueado
        $usuario = $this->getUser();
        if (!$usuario) {
            return new JsonResponse([
                "error" => "Debes iniciar sesión para enviar un mensaje."
            ], 401);
        }

        // 2️⃣ Obtener los datos JSON que envía React
        $data = json_decode($request->getContent(), true);

        $nombre = $data["nombre"] ?? null;
        $email = $data["email"] ?? null;
        $asunto = $data["asunto"] ?? null;
        $mensaje = $data["mensaje"] ?? null;

        // 3️⃣ Validar datos
        if (!$nombre || !$email || !$asunto || !$mensaje) {
            return new JsonResponse([
                "error" => "Todos los campos son obligatorios."
            ], 400);
        }

        // 4️⃣ Crear y enviar el correo
        $emailMessage = (new Email())
            ->from('candonromeroalvaro2@gmail.com') // DEBE ser tu correo
            ->replyTo($email) // correo del usuario para poder responderle
            ->to('candonromeroalvaro2@gmail.com') // destino
            ->subject("📩 Nuevo mensaje de contacto: $asunto")
            ->text("Nombre: $nombre\nEmail: $email\n\nMensaje:\n$mensaje");

        try {
            $mailer->send($emailMessage);

            return new JsonResponse([
                "message" => "✅ Mensaje enviado correctamente."
            ], 200);

        } catch (\Exception $e) {
            return new JsonResponse([
                "error" => "❌ Error al enviar el correo: " . $e->getMessage()
            ], 500);
        }
    }
}
