import React, { useState, useEffect } from "react";
import { authFetch } from "./utils/api";

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    apellido1: "",
    apellido2: "",
    nickname: "",
    email: "",
    telefono: "",
    direccion: "",
    rol: "cliente",
    password: "",
    fotoPerfil: "",
  });
  const [editId, setEditId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/usuarios";

  // 🔹 Cargar usuarios al iniciar
  useEffect(() => {
    authFetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada:", data);
          return;
        }
        setUsuarios(data);
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  // 🔹 Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Crear o actualizar usuario
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    const payload = {
      nombre: form.nombre,
      apellido1: form.apellido1,
      apellido2: form.apellido2,
      nickname: form.nickname,
      email: form.email,
      telefono: form.telefono,
      direccion: form.direccion,
      rol: form.rol,
      fotoPerfil: form.fotoPerfil || null,
    };

    if (editId) {
      if (form.password) payload.password = form.password;
    } else {
      payload.contrasena = form.password;
    }

    authFetch(url, {
      method,
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }

        if (editId) {
          setUsuarios(
            usuarios.map((u) =>
              u.id === editId ? { ...u, ...payload, id: editId } : u
            )
          );
        } else {
          const nuevoUsuario = data.usuario || { id: data.id, ...payload };
          setUsuarios([...usuarios, nuevoUsuario]);
        }

        // 🔄 Resetear formulario
        setForm({
          nombre: "",
          apellido1: "",
          apellido2: "",
          nickname: "",
          email: "",
          telefono: "",
          direccion: "",
          rol: "cliente",
          password: "",
          fotoPerfil: "",
        });
        setEditId(null);
      })
      .catch((err) => console.error("Error al guardar usuario:", err));
  };

  // 🔹 Cargar datos para edición
  const handleEdit = (usuario) => {
    setForm({
      nombre: usuario.nombre,
      apellido1: usuario.apellido1 || "",
      apellido2: usuario.apellido2 || "",
      nickname: usuario.nickname || "",
      email: usuario.email,
      telefono: usuario.telefono || "",
      direccion: usuario.direccion || "",
      rol: usuario.rol,
      password: "",
      fotoPerfil: usuario.fotoPerfil || "",
    });
    setEditId(usuario.id);
  };

  // 🔹 Eliminar usuario
  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;

    authFetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setUsuarios(usuarios.filter((u) => u.id !== id)))
      .catch((err) => console.error("Error al eliminar usuario:", err));
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              placeholder="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              placeholder="Apellido 1"
              name="apellido1"
              value={form.apellido1}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-2">
            <input
              type="text"
              placeholder="Apellido 2 (opcional)"
              name="apellido2"
              value={form.apellido2}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        <input
          type="text"
          placeholder="Nickname"
          name="nickname"
          value={form.nickname}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <input
          type="text"
          placeholder="Teléfono"
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          type="text"
          placeholder="Dirección"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <input
          type="text"
          placeholder="URL de foto de perfil"
          name="fotoPerfil"
          value={form.fotoPerfil}
          onChange={handleChange}
          className="form-control mb-2"
        />

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="form-select mb-2"
        >
          <option value="cliente">Cliente</option>
          <option value="admin">Admin</option>
          <option value="empleado">Empleado</option>
        </select>

        <input
          type="password"
          placeholder={editId ? "Dejar vacío para no cambiar" : "Contraseña"}
          name="password"
          value={form.password}
          onChange={handleChange}
          className="form-control mb-2"
          required={!editId}
        />

        <button className="btn btn-primary" type="submit">
          {editId ? "Actualizar Usuario" : "Agregar Usuario"}
        </button>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nickname</th>
            <th>Nombre completo</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>
                {u.fotoPerfil ? (
                  <img
                    src={u.fotoPerfil}
                    alt="perfil"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  "—"
                )}
              </td>
              <td>{u.nickname || "—"}</td>
              <td>
                {u.nombre} {u.apellido1} {u.apellido2 || ""}
              </td>
              <td>{u.email}</td>
              <td>{u.telefono || "-"}</td>
              <td>{u.rol}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
