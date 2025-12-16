import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { ShoppingCart } from "lucide-react";
import "../styles/global.css";
import "../styles/carrito.css";
import '../styles/productos.css';
// Removed lateral cart offcanvas to use full cart page
import { useAuth } from "../context/AuthContext";


const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      {/* === NAVBAR PRINCIPAL === */}
      <Navbar
        expand="lg"
        className="tech-navbar"
        data-bs-theme="light"
      >
        <Container fluid className="nav-container">

          {/* Marca y logo */}
          <Navbar.Brand as={Link} to="/" className="brand">
            <img
              src="/img/NavBarLogo.png"
              alt="TechHive logo"
              className="logo-img"
            />
          </Navbar.Brand>

          {/* Botón toggle para móvil y collapse clásico */}
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {/* Links (incluye botón carrito como Nav.Link para que quede inline y centrado) */}
            <Nav className="justify-content-center flex-grow-1 navlinks">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>

              {/* Inventario moved to profile menu; do not show in main navbar */}

              {/* Dropdown de cuenta dinámico */}
              <NavDropdown
                title="Cuenta"
                id="navbarScrollingDropdown"
                className="text-center"
              >
                {!isLoggedIn ? (
                  <>
                    <NavDropdown.Item as={Link} to="/login">
                      Iniciar sesión
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/registro">
                      Crear cuenta
                    </NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item as={Link} to="/cuenta/perfil">Ver cuenta</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        // useAuth logout + navigate
                        try { logout(); } catch {};
                        navigate('/');
                      }}
                    >
                      Cerrar sesión
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>

              {/* Botón carrito como Nav.Link para mantener alineación */}
              <Nav.Link as={Link} to="/carrito" className="cart-link d-flex align-items-center gap-2">
                <ShoppingCart size={20} />
                <span>Carrito</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Carrito lateral removido: se usa la página /carrito */}
    </>
  );
};
export default NavBar;
