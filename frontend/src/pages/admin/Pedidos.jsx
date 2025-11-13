import React, { useState, useEffect } from "react";
import { authFetch } from "./utils/api";

export default function PedidosAdmin({ usuario }) {
  const [pedidos, setPedidos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");

  const API_URL = `http://127.0.0.1:8000/api/pedidos?usuario_id=${usuario?.id}`;

  // 🔹 Cargar pedidos desde la API usando authFetch
  useEffect(() => {
    authFetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPedidos(data))
      .catch((err) => console.error("Error cargando pedidos:", err));
  }, [API_URL]);

  const handleEstadoChange = (e) => setNuevoEstado(e.target.value);

  const handleEditarEstado = (pedido) => {
    setEditId(pedido.id);
    setNuevoEstado(pedido.estado);
  };

  const handleActualizarEstado = (e) => {
    e.preventDefault();

    authFetch(`http://127.0.0.1:8000/api/pedidos/${editId}`, {
      method: "PUT",
      body: JSON.stringify({ estado: nuevoEstado }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        setPedidos(
          pedidos.map((p) =>
            p.id === editId ? { ...p, estado: nuevoEstado } : p
          )
        );
        setEditId(null);
        setNuevoEstado("");
      })
      .catch((err) => console.error("Error actualizando estado:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este pedido?")) return;

    authFetch(`http://127.0.0.1:8000/api/pedidos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(() => setPedidos(pedidos.filter((p) => p.id !== id)))
      .catch((err) => console.error("Error eliminando pedido:", err));
  };

  return (
    <div>
      <h2>Gestión de Pedidos</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No hay pedidos
              </td>
            </tr>
          ) : (
            pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.total ?? 0} €</td>
                <td>{p.estado}</td>
                <td>{p.fecha}</td>
                <td>
                  {editId === p.id ? (
                    <form
                      onSubmit={handleActualizarEstado}
                      className="d-flex gap-2"
                    >
                      <select
                        value={nuevoEstado}
                        onChange={handleEstadoChange}
                        className="form-select form-select-sm"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                      </select>
                      <button type="submit" className="btn btn-sm btn-success">
                        Guardar
                      </button>
                    </form>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditarEstado(p)}
                      >
                        Editar Estado
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
