<?php

namespace App\Entity;

use App\Repository\PagoRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PagoRepository::class)]
class Pago
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'pagos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Pedido $pedido = null;

    #[ORM\Column(length: 50)]
    private ?string $metodoPago = null;

    #[ORM\Column(type:"decimal", precision:10, scale:2)]
    private ?float $monto = null;

    #[ORM\Column]
    private ?\DateTime $fechaPago = null;

    #[ORM\Column(length: 20)]
    private ?string $estadoPago = 'pendiente';

    public const METODOS = ['tarjeta','transferencia','contra_reembolso'];
    public const ESTADOS = ['pendiente','completado','fallido'];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPedido(): ?Pedido
    {
        return $this->pedido;
    }

    public function setPedido(?Pedido $pedido): static
    {
        $this->pedido = $pedido;

        return $this;
    }

    public function getMetodoPago(): ?string
    {
        return $this->metodoPago;
    }

    public function setMetodoPago(string $metodoPago): self {
        if (!in_array($metodoPago, self::METODOS)) {
            throw new \InvalidArgumentException("Método de pago inválido");
        }
        $this->metodoPago = $metodoPago;
        return $this;
    }

    public function getMonto(): ?float
    {
        return $this->monto;
    }

    public function setMonto(float $monto): static
    {
        $this->monto = $monto;

        return $this;
    }

    public function getFechaPago(): ?\DateTime
    {
        return $this->fechaPago;
    }

    public function setFechaPago(\DateTime $fechaPago): static
    {
        $this->fechaPago = $fechaPago;

        return $this;
    }

    public function getEstadoPago(): ?string
    {
        return $this->estadoPago;
    }

    public function setEstadoPago(string $estadoPago): self {
        if (!in_array($estadoPago, self::ESTADOS)) {
            throw new \InvalidArgumentException("Estado de pago inválido");
        }
        $this->estadoPago = $estadoPago;
        return $this;
    }
}
