import { Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar"; // Navbar actual
import ProtectedRoute from "./components/ProtectedRoute";

import Inicio from "./pages/inicio";
import Contacto from "./pages/contacto";
import Productos from "./pages/productos";
import Login from "./pages/Login";
import Registro from "./pages/registro";
import Pago from "./pages/pago";
import Comprobante from "./pages/comprobante";
import Inventario from "./pages/Inventario";

import Perfil from "./pages/Perfil";
import Ordenes from "./pages/Ordenes";
import OrdenesVendedor from "./pages/Vendedor/OrdenesVendedor";
import AdminDashboard from "./pages/Admin/AdminDashboard"; 
import Mensajes from "./pages/Mensajes";

import "./App.css";

function App() {
  const handleLoginSuccess = () => {
    console.log("Login exitoso");
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content flex-grow-1 pt-5">

        <Routes>
          {/* PÚBLICO */}
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/contacto" element={<Contacto />} />

          <Route
            path="/login"
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />

          <Route path="/registro" element={<Registro />} />
          <Route path="/comprobante" element={<Comprobante />} />
          <Route path="/pago" element={<Pago />} />

          {/* INVENTARIO (Admin + Vendedor) */}
          <Route
            path="/inventario"
            element={
              <ProtectedRoute allowedRoles={["ADMIN", "VENDEDOR"]}>
                <Inventario />
              </ProtectedRoute>
            }
          />

          {/* ============================
              1) CLIENTE, VENDEDOR, ADMIN
             ============================ */}
          <Route
            path="/cuenta/perfil"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE", "VENDEDOR", "ADMIN"]}>
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cuenta/mis-ordenes"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE", "VENDEDOR", "ADMIN"]}>
                <Ordenes />
              </ProtectedRoute>
            }
          />

          {/* ============================
              2) VENDEDOR + ADMIN
             ============================ */}
          <Route
            path="/vendedor/ordenes"
            element={
              <ProtectedRoute allowedRoles={["VENDEDOR", "ADMIN"]}>
                <OrdenesVendedor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendedor/mensajes"
            element={
              <ProtectedRoute allowedRoles={["VENDEDOR", "ADMIN"]}>
                <Mensajes />
              </ProtectedRoute>
            }
          />

          {/* ============================
              3) SOLO ADMIN
             ============================ */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/mensajes"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Mensajes />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

      {/* FOOTER */}
      <footer className="footer text-center py-3 bg-primary text-white mt-auto">
        © {new Date().getFullYear()} TechHive - Todos los derechos reservados
      </footer>

    </div>
  );
}

export default App;
