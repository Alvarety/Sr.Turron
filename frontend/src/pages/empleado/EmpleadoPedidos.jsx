import { useEffect, useState } from "react";
import { authFetch } from "../admin/utils/authFetch";

export default function EmpleadoPedidos({ usuario }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarPedidos() {
      try {
        if (!usuario) {
          setError("Usuario no autenticado");
          setCargando(false);
          return;
        }

        const url = `http://127.0.0.1:8000/api/pedidos?usuario_id=${usuario.id}`;
        const response = await authFetch(url);

        if (!response.ok) {
          const texto = await response.text();
          console.error("Respuesta incorrecta:", texto);
          throw new Error(`Error ${response.status}`);
        }

        const data = await response.json();
        setPedidos(data);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
        setError("No se pudieron cargar los pedidos.");
      } finally {
        setCargando(false);
      }
    }

    cargarPedidos();
  }, [usuario]);

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2>Pedidos Asignados</h2>

      {pedidos.length === 0 ? (
        <p>No tienes pedidos asignados.</p>
      ) : (
        <ul className="list-group mt-3">
          {pedidos.map((p) => (
            <li className="list-group-item" key={p.id}>
              <strong>Pedido #{p.id}</strong>  
              <br />
              Estado: {p.estado}
              <br />
              Fecha: {p.fecha}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
