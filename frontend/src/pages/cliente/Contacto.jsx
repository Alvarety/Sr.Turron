import { useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../admin/utils/api"; // 🔹 import correcto

export default function Contacto({ usuario }) {
  if (!usuario) usuario = JSON.parse(localStorage.getItem("usuario"));

  const [nombre] = useState(usuario ? usuario.nombre : "");
  const [email] = useState(usuario ? usuario.email : "");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!usuario) {
    return (
      <div className="container text-center my-5">
        <h2>Debes iniciar sesión para usar el formulario de contacto</h2>
        <Link to="/login" className="btn btn-primary mt-3">Iniciar Sesión</Link>
      </div>
    );
  }

  const enviarFormulario = async (e) => {
    e.preventDefault();

    try {
      const res = await authFetch("http://127.0.0.1:8000/api/contacto/enviar", {
        method: "POST",
        body: JSON.stringify({ nombre, email, asunto, mensaje }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      alert("✅ Mensaje enviado correctamente.");
      setAsunto("");
      setMensaje("");

    } catch (error) {
      console.error(error);
      alert("❌ No se pudo enviar el mensaje. Revisa tu sesión o conexión.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Formulario de Contacto</h2>

      <form className="card shadow p-4" onSubmit={enviarFormulario}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={nombre} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Asunto</label>
          <input
            className="form-control"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mensaje</label>
          <textarea
            className="form-control"
            rows="4"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100">Enviar 📩</button>
      </form>
    </div>
  );
}
