import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Offcanvas,
  NavDropdown,
  Button,
} from "react-bootstrap";
import { ShoppingCart } from "lucide-react";
import "../styles/global.css";
import "../styles/carrito.css";
import Carrito from "../pages/Carrito";
import '../styles/productos.css';


const NavBarTechHive: React.FC = () => {
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

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

          {/* Botón toggle para móvil */}
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand" />

          {/* Offcanvas lateral */}
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand"
            placement="end"
            className="tech-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand" className="offcanvas-title">
                Menú
              </Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
              {/* Links */}
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

                {/* Dropdown de cuenta dinámico */}
                <NavDropdown
                  title="Cuenta"
                  id="offcanvasNavbarDropdown-expand"
                  className="text-center"
                >
                  {!localStorage.getItem("isLoggedIn") ? (
                    <>
                      <NavDropdown.Item as={Link} to="/login">
                        Iniciar sesión
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/signin">
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
              </Nav>

              {/* Botón carrito */}
              <div className = "w-100 d-flex justify-content-center mt-3">
              <Button
                variant="link"
                id="cart-btn"
                onClick={() => setShowCart(true)}
                className="cart-link d-flex align-items-center gap-2"
              >
                <ShoppingCart size={20} />
                <span>Carrito</span>
              </Button>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      {/* === CARRITO LATERAL === */}
      <Carrito visible={showCart} onClose={() => setShowCart(false)} />
    </>
  );
};

export default NavBarTechHive;
