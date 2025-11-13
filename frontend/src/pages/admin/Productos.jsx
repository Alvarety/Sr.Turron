import React, { useState, useEffect } from "react";

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: 1, // ID de Turrones Clásicos por defecto
    imagenUrl: "",
    activo: true,
  });
  const [editId, setEditId] = useState(null);

  const API_URL = "http://127.0.0.1:8000/api/productos";

  // 🔹 Cargar productos
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    // Enviar categoria_id como número
    const payload = {
      ...form,
      categoria_id: parseInt(form.categoria),
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        const producto = data.producto || data; // por seguridad
        if (editId) {
          setProductos(productos.map((p) => (p.id === editId ? producto : p)));
        } else {
          setProductos([...productos, producto]);
        }
        setForm({
          nombre: "",
          descripcion: "",
          precio: "",
          stock: "",
          categoria: 1,
          imagenUrl: "",
          activo: true,
        });
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (producto) => {
    // Convertir nombre de categoría a ID
    let categoriaId = 1; // Turrones Clásicos por defecto
    if (producto.categoria === "Turrones de Chocolate") categoriaId = 2;
    else if (producto.categoria === "Turrones Gourmet") categoriaId = 3;

    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      categoria: categoriaId,
      imagenUrl: producto.imagenUrl,
      activo: producto.activo,
    });
    setEditId(producto.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setProductos(productos.filter((p) => p.id !== id)))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <h2>Gestión de Productos</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          className="form-control mb-2"
          step="0.01"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="form-control mb-2"
          required
        />

        {/* 🔹 Select de Categoría con IDs */}
        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="form-select mb-2"
          required
        >
          <option value={1}>Turrones Clásicos</option>
          <option value={2}>Turrones de Chocolate</option>
          <option value={3}>Turrones Gourmet</option>
        </select>

        <input
          type="text"
          name="imagenUrl"
          placeholder="URL Imagen"
          value={form.imagenUrl}
          onChange={handleChange}
          className="form-control mb-2"
        />
        <div className="form-check mb-2">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="form-check-input"
          />
          <label className="form-check-label">Activo</label>
        </div>

        <button className="btn btn-primary" type="submit">
          {editId ? "Actualizar Producto" : "Agregar Producto"}
        </button>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoria</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.descripcion}</td>
              <td>{p.precio} €</td>
              <td>{p.stock}</td>
              <td>{p.categoria}</td>
              <td>{p.activo ? "Sí" : "No"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.id)}
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
