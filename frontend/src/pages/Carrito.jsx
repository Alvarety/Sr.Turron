import React from "react";
import { authFetch } from "../pages/admin/utils/api";

export default function Carrito({ carrito, setCarrito, usuario }) {
  const total = carrito.reduce(
    (acc, p) => acc + Number(p.precio) * Number(p.cantidad),
    0
  );

  const eliminarProducto = (id) => {
    const productoExistente = carrito.find((p) => p.id === id);
    if (!productoExistente) return;

    if (productoExistente.cantidad > 1) {
      setCarrito(
        carrito.map((p) =>
          p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
      );
    } else {
      setCarrito(carrito.filter((p) => p.id !== id));
    }
  };

  const vaciarCarrito = () => {
    if (window.confirm("¿Seguro que deseas vaciar el carrito?")) {
      setCarrito([]);
      localStorage.removeItem("carrito");
    }
  };

  const hacerPedido = async () => {
    if (!usuario) {
      alert("⚠️ Debes iniciar sesión para hacer un pedido.");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    try {
      const pedido = {
        usuario_id: usuario.id,
        productos: carrito.map((p) => ({
          id: p.id,
          cantidad: p.cantidad,
        })),
      };

      const res = await authFetch("http://127.0.0.1:8000/api/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      alert("✅ Pedido realizado con éxito");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch (error) {
      console.error("Error creando el pedido:", error);
      alert("❌ Ocurrió un error al procesar tu pedido.");
    }
  };

  return (
    <div className="carrito-container">
      <h1 className="carrito-titulo">🛍️ Tu carrito</h1>

      {carrito.length === 0 ? (
        <p className="text-center text-muted">
          Tu carrito está vacío. Añade productos desde la tienda 🍬
        </p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio Unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((p) => (
                  <tr key={p.id}>
                    <td data-label="Producto">{p.nombre}</td>
                    <td data-label="Precio Unitario">
                      {Number(p.precio).toFixed(2)} €
                    </td>
                    <td data-label="Cantidad">{p.cantidad}</td>
                    <td data-label="Subtotal">
                      {(Number(p.precio) * p.cantidad).toFixed(2)} €
                    </td>
                    <td data-label="">
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarProducto(p.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="carrito-total">Total: {total.toFixed(2)} €</p>

          <div className="carrito-botones">
            <button className="btn-vaciar" onClick={vaciarCarrito}>
              Vaciar carrito
            </button>
            <button className="btn-pedido" onClick={hacerPedido}>
              Hacer pedido 🧾
            </button>
          </div>
        </>
      )}
    </div>
  );
}
