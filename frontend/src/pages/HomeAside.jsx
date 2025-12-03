import React from "react";
import { Link } from "react-router-dom";

export default function HomeAside({ usuario }) {
    const rol = usuario?.rol || "cliente";

  return (
    <>
      <h3 className="mb-3">Información Adicional</h3>

      {rol === "cliente" && (
        <>
          <ul className="list-group mb-3">
            <li className="list-group-item">
              <Link to="/ofertas">Ofertas Especiales</Link>
            </li>
            <li className="list-group-item">
              <Link to="/novedades">Novedades</Link>
            </li>
            <li className="list-group-item">
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>

          <div className="accordion" id="infoAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              Sobre Nosotros
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body">
              En Señor Turrón llevamos más de 50 años elaborando dulces con tradición y cariño.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              Inspiraciones
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse">
            <div className="accordion-body">
              Inspirados por las recetas artesanales de Jijona, traemos a tu mesa el sabor auténtico de la Navidad.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
              Contacto
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse">
            <div className="accordion-body">
              📞 900 123 456 <br />
              ✉️ contacto@senorturron.es
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {rol === "admin" && (
        <>
          <ul className="list-group mb-3">
            <li className="list-group-item">
              <Link to="/ofertas">Ofertas Especiales</Link>
            </li>
            <li className="list-group-item">
              <Link to="/novedades">Novedades</Link>
            </li>
            <li className="list-group-item">
              <Link to="/contacto">Contacto</Link>
            </li>
            <li className="list-group-item">
              <Link to="/admin/usuarios">Gestión de Usuarios</Link>
            </li>
            <li className="list-group-item">
              <Link to="/admin/productos">Gestión de Productos</Link>
            </li>
            <li className="list-group-item">
              <Link to="/admin/pedidos">Gestión de Pedidos</Link>
            </li>
            <li className="list-group-item">
              <Link to="/empleado/pedidos">Ver Pedidos Asignados</Link>
            </li>
            <li className="list-group-item">
              <Link to="/empleado/estado">Actualizar Estado de Pedido</Link>
            </li>
          </ul>

          <div className="accordion" id="infoAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              Sobre Nosotros
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body">
              En Señor Turrón llevamos más de 50 años elaborando dulces con tradición y cariño.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              Inspiraciones
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse">
            <div className="accordion-body">
              Inspirados por las recetas artesanales de Jijona, traemos a tu mesa el sabor auténtico de la Navidad.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
              Contacto
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse">
            <div className="accordion-body">
              📞 900 123 456 <br />
              ✉️ contacto@senorturron.es
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {rol === "empleado" && (
        <>
          <ul className="list-group mb-3">
            <li className="list-group-item">
              <Link to="/ofertas">Ofertas Especiales</Link>
            </li>
            <li className="list-group-item">
              <Link to="/novedades">Novedades</Link>
            </li>
            <li className="list-group-item">
              <Link to="/contacto">Contacto</Link>
            </li>
            <li className="list-group-item">
              <Link to="/admin/productos">Gestión de Productos</Link>
            </li>
            <li className="list-group-item">
              <Link to="/empleado/pedidos">Ver Pedidos Asignados</Link>
            </li>
            <li className="list-group-item">
              <Link to="/empleado/estado">Actualizar Estado de Pedido</Link>
            </li>
          </ul>

          <div className="accordion" id="infoAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
              Sobre Nosotros
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body">
              En Señor Turrón llevamos más de 50 años elaborando dulces con tradición y cariño.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
              Inspiraciones
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse">
            <div className="accordion-body">
              Inspirados por las recetas artesanales de Jijona, traemos a tu mesa el sabor auténtico de la Navidad.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
              Contacto
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse">
            <div className="accordion-body">
              📞 900 123 456 <br />
              ✉️ contacto@senorturron.es
            </div>
          </div>
        </div>
      </div>
        </>
      )}
       
      
    </>
  );
}
