import { useState } from "react";
import { authFetch } from "../admin/utils/authFetch";

export default function EmpleadoEstado() {
  const [pedidoId, setPedidoId] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [mensaje, setMensaje] = useState(null);

  const actualizarEstado = async (e) => {
    e.preventDefault();
    setMensaje(null);

    try {
      const response = await authFetch(`http://127.0.0.1:8000/api/pedidos/${pedidoId}`, {
        method: "PUT",
        body: JSON.stringify({ estado }),
      });

      // 📌 Validación segura sin romper el front
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = { error: "Respuesta inválida del servidor" };
      }

      if (response.ok) {
        setMensaje({
          tipo: "success",
          texto: "Estado actualizado correctamente",
        });
      } else {
        setMensaje({
          tipo: "danger",
          texto: data.error || "No se pudo actualizar el estado",
        });
      }
    } catch (err) {
      console.error("Error actualizando estado:", err);
      setMensaje({
        tipo: "danger",
        texto: "Error interno del servidor",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Actualizar estado de pedido</h2>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo}`} role="alert">
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={actualizarEstado} className="mt-3">
        <div className="mb-3">
          <label className="form-label">ID del pedido</label>
          <input
            type="number"
            className="form-control"
            value={pedidoId}
            onChange={(e) => setPedidoId(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nuevo estado</label>
          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="pendiente">Pendiente</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">
          Actualizar
        </button>
      </form>
    </div>
  );
}
