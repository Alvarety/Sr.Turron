// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useDarkMode from "../hooks/useDarkMode";

const Navbar = ({ usuario, setUsuario }) => {
  const navigate = useNavigate();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const handleLogout = () => {
    setUsuario(null);
    navigate("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg ${
        isDarkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container d-flex flex-column flex-lg-row justify-content-center align-items-center">
        {usuario && <span className="navbar-brand">Bienvenido, {usuario.nickname}</span>}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul
            className={`navbar-nav ${
              usuario ? "ms-auto" : "mx-auto"
            } d-flex flex-column flex-lg-row align-items-center`}
          >
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-link" to="/productos">Productos</Link>
            </li>
            {usuario && (
              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/carrito">Carrito</Link>
              </li>
            )}
            {usuario ? (
              <li className="nav-item dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent"
                  data-bs-toggle="dropdown"
                >
                  {usuario.fotoPerfil ? (
                    <img
                      src={usuario.fotoPerfil}
                      alt="avatar"
                      className="rounded-circle object-fit-cover"
                      style={{ width: "40px", height: "40px" }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px", fontWeight: "bold", fontSize: "18px" }}
                    >
                      {usuario.nickname.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                <ul className="dropdown-menu dropdown-menu-end mt-2">
                  <li>
                    <Link className="dropdown-item" to="/perfil">
                      Mi Perfil
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/login">
                  Iniciar Sesión
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* 🌗 Botón modo oscuro */}
        <button
          className="btn btn-outline-secondary ms-3 mt-3 mt-lg-0"
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "🌞 Claro" : "🌙 Oscuro"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
