import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { ShoppingCart } from "lucide-react";
import "../styles/global.css";
import "../styles/carrito.css";
import Carrito from "../pages/Carrito";
import '../styles/productos.css';


const NavBarTechHive: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  // Parse usuario safely to decide which links to show
  let usuario: any = null;
  try {
    const raw = localStorage.getItem("usuario");
    usuario = raw ? JSON.parse(raw) : null;
  } catch (e) {
    usuario = null;
  }

  const esAdminOrVendedor = usuario && (usuario.rol === "ADMIN" || usuario.rol === "VENDEDOR");

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
              <Nav.Link as={Link} to="/productos">
                Productos
              </Nav.Link>
              <Nav.Link as={Link} to="/contacto">
                Contacto
              </Nav.Link>

              {esAdminOrVendedor && (
                <Nav.Link as={Link} to="/inventario">
                  Inventario
                </Nav.Link>
              )}

              {/* Dropdown de cuenta dinámico */}
              <NavDropdown
                title="Cuenta"
                id="navbarScrollingDropdown"
                className="text-center"
              >
                {!localStorage.getItem("isLoggedIn") ? (
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
                    <NavDropdown.Item as={Link} to="/perfil">
                      Ver perfil
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        navigate('/'); // redirige al inicio después de cerrar sesión
                      }}
                    >
                      Cerrar sesión
                    </NavDropdown.Item>
                  </>
                )}
              </NavDropdown>

              {/* Botón carrito como Nav.Link para mantener alineación */}
              <Nav.Link
                role="button"
                id="cart-btn"
                onClick={() => setShowCart(true)}
                className="cart-link d-flex align-items-center gap-2"
              >
                <ShoppingCart size={20} />
                <span>Carrito</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* === CARRITO LATERAL === */}
      <Carrito visible={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default NavBarTechHive;
