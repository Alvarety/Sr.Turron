import { Routes, Route } from "react-router-dom";
import LayoutPrincipal from "../src/components/LayoutPrincipal";
import LayoutMinimal from "../src/components/LayoutMinimal";
import Home from "../src/pages/Home";
import Productos from "../src/pages/Productos";
import Carrito from "../src/pages/Carrito";
import Login from "../src/pages/Login";
import Registro from "../src/pages/Registro";
import Usuarios from "../src/pages/admin/Usuarios";
import ProductosAdmin from "../src/pages/admin/Productos";
import Pedidos from "../src/pages/admin/Pedidos";
import Detalles from "../src/pages/Detalles";
import Perfil from "../src/pages/Perfil";
import Novedades from "../src/pages/cliente/Novedades";
import Ofertas from "../src/pages/cliente/Ofertas";
import Contacto from "../src/pages/cliente/Contacto";
import RutaProtegidaRol from "../src/components/RutaProtegidaRol";
import ResetPassword from "../src/pages/ResetPassword";
import EmpleadoPedidos from "../src/pages/empleado/EmpleadoPedidos";
import EmpleadoEstado from "../src/pages/empleado/EmpleadoEstado";
import PedidoPago from "../src/pages/PedidoPago";

export default function RouterPrincipal({ usuario, setUsuario, carrito, setCarrito }) {
  return (
    <Routes>
      {/* Login y Registro: Layout minimalista */}
      <Route 
        path="/login" 
        element={
          <LayoutMinimal>
            <Login setUsuario={setUsuario} />
          </LayoutMinimal>
        } 
      />
      <Route 
        path="/registro" 
        element={
          <LayoutMinimal>
            <Registro setUsuario={setUsuario} />
          </LayoutMinimal>
        } 
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/perfil"
        element={
          usuario ? (
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}>
              <Perfil usuario={usuario} setUsuario={setUsuario} />
            </LayoutPrincipal>
          ) : (
            <LayoutMinimal>
              <Login setUsuario={setUsuario} />
            </LayoutMinimal>
          )
        }
      />

      {/* Rutas públicas: Layout principal */}
      <Route 
        path="/" 
        element={
          <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}>
            <Home usuario={usuario} />
          </LayoutPrincipal>
        }
        />
      <Route 
        path="/productos" 
        element={
          <LayoutPrincipal usuario={usuario}>
            <Productos usuario={usuario} carrito={carrito} setCarrito={setCarrito} />
          </LayoutPrincipal>
        } 
        />
        {/* 👇 Nueva ruta de detalles del producto */}
      <Route 
        path="/productos/:id" 
        element={
          <LayoutPrincipal usuario={usuario}>
            <Detalles usuario={usuario} carrito={carrito} setCarrito={setCarrito} />
          </LayoutPrincipal>
        } 
        />
      <Route 
        path="/carrito" 
        element={
          usuario ? (
            <LayoutPrincipal usuario={usuario}>
              <Carrito usuario={usuario} carrito={carrito} setCarrito={setCarrito} />
            </LayoutPrincipal>
          ) : (
            <LayoutMinimal>
              <Login setUsuario={setUsuario} />
            </LayoutMinimal>
          )
        }
      />
      <Route 
        path="/pedido-pago/:id" 
        element={
          usuario ? (
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}>
              <PedidoPago usuario={usuario} />
            </LayoutPrincipal>
          ) : (
            <LayoutMinimal>
              <Login setUsuario={setUsuario} />
            </LayoutMinimal>
          )
        }
      />
      <Route path="/novedades" element={
        <LayoutPrincipal usuario={usuario}>
          <Novedades />
        </LayoutPrincipal>
        } 
      />
      <Route path="/ofertas" element={
        <LayoutPrincipal usuario={usuario}>
          <Ofertas />
        </LayoutPrincipal>
        } 
      />
      <Route path="/contacto" element={
        <LayoutPrincipal usuario={usuario}>
          <Contacto />
        </LayoutPrincipal>
        } 
      />

      {/* Rutas admin: también usan LayoutPrincipal */}
      <Route 
        path="/admin/usuarios" 
        element={
          <RutaProtegidaRol usuario={usuario} rolesPermitidos={["admin","empleado"]}>
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}> 
              <Usuarios usuario={usuario}/> 
            </LayoutPrincipal>
          </RutaProtegidaRol>
        } 
      />
      <Route 
        path="/admin/productos" 
        element={
          <RutaProtegidaRol usuario={usuario} rolesPermitidos={["admin","empleado"]}>
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}> 
              <ProductosAdmin usuario={usuario}/> 
            </LayoutPrincipal>
          </RutaProtegidaRol>
        } 
      />
      <Route 
        path="/admin/pedidos" 
        element={
          <RutaProtegidaRol usuario={usuario} rolesPermitidos={["admin","empleado"]}>
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}> 
              <Pedidos usuario={usuario}/> 
            </LayoutPrincipal>
          </RutaProtegidaRol>
        } 
      />
      {/* Rutas de empleado */}
      <Route 
        path="/empleado/pedidos" 
        element={
          <RutaProtegidaRol usuario={usuario} rolesPermitidos={["empleado", "admin"]}>
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}>
              <EmpleadoPedidos usuario={usuario} />
            </LayoutPrincipal>
          </RutaProtegidaRol>
        }
      />

      <Route 
        path="/empleado/estado" 
        element={
          <RutaProtegidaRol usuario={usuario} rolesPermitidos={["empleado", "admin"]}>
            <LayoutPrincipal usuario={usuario} setUsuario={setUsuario}>
              <EmpleadoEstado usuario={usuario} />
            </LayoutPrincipal>
          </RutaProtegidaRol>
        }
      />
    </Routes>
  );
}
