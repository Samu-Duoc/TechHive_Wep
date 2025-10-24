import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import "./App.css";
// Páginas
import Inicio from "./pages/inicio";
import Contacto from "./pages/contacto";
import Nosotros from "./pages/nosotros";
import Productos from "./pages/productos";
import Login from "./pages/Login";  // Esta es la ruta correcta, coincide con el nombre del archivo
import Registro from "./pages/registro";
import Pago from "./pages/pago";



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // para navegación interna

  // Dropdown 'Cuenta' controlado por React (no depende de bootstrap.js)
  const [isCuentaOpen, setIsCuentaOpen] = useState(false);
  const cuentaRef = useRef<HTMLDivElement | null>(null);

  const toggleCuenta = () => setIsCuentaOpen(v => !v);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!cuentaRef.current) return;
      const target = e.target as Node;
      if (!cuentaRef.current.contains(target)) {
        setIsCuentaOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Verificar sesión guardada
  useEffect(() => {
    const storedLogin = localStorage.getItem("isLoggedIn");
    if (storedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  

  return (
    <div className="app-container" data-logged={isLoggedIn}>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top w-100 shadow">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">

          <img src="/img/NavBarLogo.png" alt="TechHive Logo" /></Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">

            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/productos"> Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/nosotros">Nosotros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contacto">Contacto</Link>
              </li>
              <li className="nav-item">
                <div className="d-flex">
                  <div
                    className={`dropdown ${isCuentaOpen ? "show" : ""}`}
                    ref={cuentaRef}
                  >
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      aria-expanded={isCuentaOpen}
                      onClick={(e) => { e.stopPropagation(); toggleCuenta(); }}
                    >
                      Cuenta
                    </button>
                    <ul className={`dropdown-menu ${isCuentaOpen ? "show" : ""}`}>
                      <li>
                        <Link className="dropdown-item" to="/login" onClick={() => setIsCuentaOpen(false)}>
                          Iniciar Sesión
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/registro" onClick={() => setIsCuentaOpen(false)}>
                          Registrarse
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/pago" element={<Pago />} />
          <Route path="/login" element={
            <Login onLoginSuccess={() => {
              localStorage.setItem("isLoggeIn","true");
              setIsLoggedIn(true);
              navigate("/")
            }} />
          }/>
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </div>

      {/* FOOTER */}
      <footer className="footer text-center py-3 bg-primary text-white">
        © 2025 TechHive - Todos los derechos reservados
      </footer>
    </div>
  );
}

export default App;