import { Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar"; // CompoNENte Navbar
import Inicio from "./pages/inicio";
import Contacto from "./pages/contacto";
import Productos from "./pages/productos";
import Login from "./pages/Login";
import Registro from "./pages/registro";
import Pago from "./pages/pago";
import Comprobante from "./pages/comprobante";

import "./App.css";


function App() {
  const handleLoginSuccess = () => {
    console.log("Login exitoso");
  };

  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {/* 🔝 NAVBAR (siempre fijo arriba) */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content flex-grow-1 pt-5">
        <Routes>
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
