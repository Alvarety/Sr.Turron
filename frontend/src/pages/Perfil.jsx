import React, { useState, useEffect } from "react";
import { authFetch } from "../pages/admin/utils/api";

export default function Perfil({ usuario, setUsuario }) {
  const [form, setForm] = useState({
    foto: "",
    nickname: "",
    nombre: "",
    apellido1: "",
    apellido2: "",
    email: "",
    telefono: "",
    direccion: "",
    current_password: "",
    new_password: "",
    repeat_password: "",
  });

  const API_URL = "http://127.0.0.1:8000/api/usuarios";

  // ✅ Cargar datos iniciales del usuario
  useEffect(() => {
    if (usuario) {
      setForm((prev) => ({
        ...prev,
        foto: usuario.foto || "",
        nickname: usuario.nickname || "",
        nombre: usuario.nombre || "",
        apellido1: usuario.apellido1 || "",
        apellido2: usuario.apellido2 || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        direccion: usuario.direccion || "",
      }));
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validación de cambio de contraseña
    if (form.new_password || form.repeat_password || form.current_password) {
      if (!form.current_password) {
        return alert("Debes indicar tu contraseña actual.");
      }
      if (form.new_password !== form.repeat_password) {
        return alert("❌ Las contraseñas no coinciden.");
      }
    }

    try {
      const payload = {
        fotoPerfil: form.foto || usuario.fotoPerfil,
        nickname: form.nickname,
        nombre: form.nombre,
        apellido1: form.apellido1,
        apellido2: form.apellido2,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
      };

      // 🔹 Enviar "password" en lugar de "new_password"
      if (form.new_password) {
        payload.password = form.new_password;
      }

      const res = await authFetch(`${API_URL}/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const updatedData = await res.json();
      const updatedUser = { ...usuario, ...updatedData };
      setUsuario(updatedUser);
      localStorage.setItem("usuario", JSON.stringify(updatedUser));

      alert("✅ Perfil actualizado correctamente");

      // Limpiar solo campos de contraseña
      setForm((f) => ({
        ...f,
        current_password: "",
        new_password: "",
        repeat_password: "",
      }));
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      alert("❌ Error al actualizar tu perfil.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Mi Perfil</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <input type="text" name="foto" placeholder="Foto (URL)" value={form.foto} onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="nickname" placeholder="Nickname" value={form.nickname} onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="apellido1" placeholder="Primer Apellido" value={form.apellido1} onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="apellido2" placeholder="Segundo Apellido" value={form.apellido2} onChange={handleChange} className="form-control mb-2" />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-control mb-2" required />
        <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="form-control mb-2" />

        <hr />
        <h5>Cambiar contraseña (opcional)</h5>
        <input type="password" name="current_password" placeholder="Contraseña actual" value={form.current_password} onChange={handleChange} className="form-control mb-2" />
        <input type="password" name="new_password" placeholder="Nueva contraseña" value={form.new_password} onChange={handleChange} className="form-control mb-2" />
        <input type="password" name="repeat_password" placeholder="Repetir nueva contraseña" value={form.repeat_password} onChange={handleChange} className="form-control mb-2" />

        <button type="submit" className="btn btn-primary mt-2">Guardar cambios</button>
      </form>
    </div>
  );
}
