import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../pages/admin/utils/api";

export default function PedidoPago() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [metodoPago, setMetodoPago] = useState("contra_reembolso");
  const [pagado, setPagado] = useState(false);

  useEffect(() => {
    async function cargarPedido() {
      const res = await authFetch(`http://127.0.0.1:8000/api/pedidos/${id}`);
      const data = await res.json();
      
      setPedido(data);
    }
    cargarPedido();
  }, [id]);

  const registrarPago = async () => {
    try {
      const res = await authFetch("http://127.0.0.1:8000/api/pago", {
        method: "POST",
        body: JSON.stringify({
          pedido_id: pedido.id,
          metodo_pago: metodoPago,
          monto: pedido.total
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);
      alert("✅ Pago registrado correctamente");
      setPagado(true);
    } catch (err) {
      console.error("Error registrando pago:", err);
      alert("❌ Ocurrió un error al registrar el pago");
    }
  };

  if (!pedido) return <p>Cargando pedido...</p>;

  return (
    <div className="container mt-4">
      <h2>Pago del pedido #{pedido.id}</h2>
      <p>Total: {pedido.total} €</p>

      {pagado ? (
        <p style={{ color: "green" }}>✅ Pago completado</p>
      ) : (
        <>
          <label>
            Método de pago:
            <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
              <option value="contra_reembolso">Contra reembolso</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </label>

          <button className="btn btn-primary mt-2" onClick={registrarPago}>
            Registrar pago
          </button>
        </>
      )}
    </div>
  );
}
