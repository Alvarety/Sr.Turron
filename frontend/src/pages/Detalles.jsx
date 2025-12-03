import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../pages/admin/utils/api"; // solo para acciones que requieren login

export default function Detalles({ usuario, carrito, setCarrito }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [respuestaTexto, setRespuestaTexto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar producto y reseñas (público)
  const fetchProductoYResenas = async () => {
    try {
      // Producto
      const prodRes = await fetch(`http://127.0.0.1:8000/api/productos/${id}`);
      if (!prodRes.ok) throw new Error("Error cargando producto");
      const prodData = await prodRes.json();
      setProducto(prodData);

      // Reseñas
      const resRes = await fetch(`http://127.0.0.1:8000/api/productos/${id}/resenas`);
      if (!resRes.ok) throw new Error("Error cargando reseñas");
      const resData = await resRes.json();
      setResenas(resData);

    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el producto o las reseñas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductoYResenas();
  }, [id]);

  // 🔹 Agregar al carrito (requiere usuario)
  const agregarAlCarrito = () => {
    if (!usuario) return navigate("/login");
    if (!producto) return;

    const cantidad = parseInt(
      prompt(`¿Cuántas unidades de "${producto.nombre}" deseas añadir al carrito?`, "1"),
      10
    );
    if (isNaN(cantidad) || cantidad <= 0) {
      return alert("Introduce una cantidad válida.");
    }

    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
      setCarrito(carrito.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p));
    } else {
      setCarrito([...carrito, { ...producto, cantidad }]);
    }

    alert(`🛍️ Se han añadido ${cantidad} ${producto.nombre}${cantidad > 1 ? "s" : ""} al carrito.`);
  };

  // 🔹 Enviar reseña (requiere usuario)
  const enviarResena = async () => {
    if (!usuario) return navigate("/login");

    try {
      const res = await authFetch(`http://127.0.0.1:8000/api/resenas`, {
        method: "POST",
        body: JSON.stringify({
          usuario_id: usuario.id,
          producto_id: producto.id,
          comentario,
          puntuacion
        })
      });

      if (!res.ok) throw new Error("Error al enviar reseña");

      alert("✅ Reseña enviada correctamente");
      setComentario("");
      setPuntuacion(5);
      fetchProductoYResenas();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo enviar la reseña");
    }
  };

  // 🔹 Enviar comentario a una reseña (requiere usuario)
  const enviarComentario = async (resenaId) => {
    if (!usuario) return navigate("/login");

    const texto = respuestaTexto[resenaId];
    if (!texto || texto.trim() === "") return;

    try {
      const res = await authFetch(`http://127.0.0.1:8000/api/resenas/${resenaId}/comentarios`, {
        method: "POST",
        body: JSON.stringify({
          usuario_id: usuario.id,
          texto
        })
      });

      if (!res.ok) throw new Error("Error al enviar comentario");

      setRespuestaTexto({ ...respuestaTexto, [resenaId]: "" });
      fetchProductoYResenas();
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo enviar el comentario");
    }
  };

  if (loading) return <p className="text-center mt-5">Cargando...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="detalles-container container mt-5">
      <div className="card shadow-lg p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-5 text-center">
            <img src={producto.imagenUrl} alt={producto.nombre} className="img-fluid rounded" style={{ maxHeight: "400px", objectFit: "cover" }} />
          </div>
          <div className="col-md-7">
            <h2 className="mb-3">{producto.nombre}</h2>
            <p className="text-muted">{producto.descripcion}</p>
            <p><strong>Categoría:</strong> {producto.categoria}</p>
            <h4 className="text-success mb-4">{producto.precio} €</h4>
            <button onClick={agregarAlCarrito} className="btn btn-primary me-3">
              Agregar al carrito 🛍️
            </button>
            <Link to="/productos" className="btn btn-secondary">Volver al catálogo</Link>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <h3>Reseñas</h3>
        <hr />
        {resenas.length === 0 && <p>No hay reseñas todavía.</p>}

        {resenas.map((r) => (
          <div key={r.id} className="border rounded p-3 mb-3">
            <p><strong>{r.usuario}</strong> ⭐ {r.puntuacion}/5</p>
            <p>{r.comentario}</p>
            <small className="text-muted">{r.fecha}</small>

            {r.respuestas.length > 0 && (
              <div className="mt-3 ps-3 border-start">
                {r.respuestas.map((c, index) => (
                  <p key={index}><strong>{c.usuario}</strong>: {c.texto}<br /><small className="text-muted">{c.fecha}</small></p>
                ))}
              </div>
            )}

            {usuario && (
              <div className="mt-2">
                <textarea
                  className="form-control mb-2"
                  placeholder="Escribe una respuesta..."
                  value={respuestaTexto[r.id] || ""}
                  onChange={(e) => setRespuestaTexto({ ...respuestaTexto, [r.id]: e.target.value })}
                />
                <button className="btn btn-sm btn-outline-primary" onClick={() => enviarComentario(r.id)}>Responder 💬</button>
              </div>
            )}
          </div>
        ))}

        {usuario && (
          <>
            <h4 className="mt-4">Escribe tu reseña</h4>
            <select value={puntuacion} onChange={(e) => setPuntuacion(parseInt(e.target.value))} className="form-select w-auto mb-2">
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
            </select>
            <textarea
              className="form-control mb-2"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe tu opinión..."
            />
            <button className="btn btn-primary" onClick={enviarResena}>Publicar reseña</button>
          </>
        )}
      </div>
    </div>
  );
}
