import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/productos")
      .then((res) => {
        setProductos(res.data);

        // Extraemos categorías únicas
        const cats = [...new Set(res.data.map((p) => p.categoria).filter(Boolean))];
        setCategorias(cats);
      })
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  // === FILTRADO DINÁMICO ===
  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "" || p.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="productos-container">

      <h1 className="productos-titulo">Catálogo de Productos</h1>

      {/* === BUSCADOR Y SELECTOR === */}
      <div className="filtros-container" style={{ maxWidth: "600px", margin: "0 auto 20px" }}>
        <input
          type="text"
          placeholder="Buscar turrones..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="form-control mb-2"
        />

        <select
          value={categoriaSeleccionada}
          onChange={(e) => setCategoriaSeleccionada(e.target.value)}
          className="form-select"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* === LISTADO FILTRADO === */}
      <div className="productos-grid">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((p) => (
            <div key={p.id} className="producto-card card-turron">
              <Link to={`/productos/${p.id}`}>
                <img
                  src={p.imagenUrl}
                  alt={p.nombre}
                  className="producto-imagen"
                />
              </Link>
              <div className="producto-info">
                <h3>{p.nombre}</h3>
                <p className="producto-descripcion">{p.descripcion}</p>
                <p className="producto-categoria">
                  <strong>Categoría:</strong> {p.categoria ?? "Sin categoría"}
                </p>
                <p className="producto-precio">{p.precio} €</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mt-4">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
