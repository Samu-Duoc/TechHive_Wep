import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { ShoppingCart } from "lucide-react";
import "../styles/global.css";
import "../styles/carrito.css";
import '../styles/productos.css';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useCarrito } from "../context/CarritoContext";


const NavBar: React.FC = () => {
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

      {/* === CARRITO LATERAL: Offcanvas local que usa useCarrito (no modifica Carrito.tsx) === */}
      <Offcanvas show={showCart} onHide={() => setShowCart(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Carrito</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <NavCartContent onClose={() => setShowCart(false)} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

const NavCartContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { carrito, vaciarCarrito, actualizarCantidad } = useCarrito();
  const total = carrito.reduce((s, p) => s + (Number(p.precio) || 0) * (p.cantidad || 0), 0);

  const getCartImage = (item: any) => {
    if (item == null) return '/img/logo.jpg';
    if (typeof item.imagen === 'string' && item.imagen) {
      if (item.imagen.startsWith('http') || item.imagen.startsWith('/') || item.imagen.startsWith('data:')) return item.imagen;
      // otherwise, treat as relative path
      return item.imagen;
    }
    if (item.imagenBase64) return `data:image/*;base64,${item.imagenBase64}`;
    return '/img/logo.jpg';
  };

  return (
    <div>
      {carrito.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío.</p>
      ) : (
        <ListGroup variant="flush">
            {carrito.map((item) => (
            <ListGroup.Item key={item.id} className="cart-item d-flex align-items-center">
              <img src={getCartImage(item)} alt={item.titulo} className="cart-img me-3" onError={(e)=>{(e.target as HTMLImageElement).src='/img/logo.jpg'}} />
              <div style={{ flex: 1 }}>
                <div className="fw-bold">{item.titulo}</div>
                <div className="small text-muted">${item.precio.toLocaleString('es-CL')} x {item.cantidad}</div>
              </div>
              <div className="d-flex flex-column align-items-end">
                <div className="mb-1">${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
                <div>
                  <Button size="sm" variant="outline-secondary" onClick={() => actualizarCantidad(item.id, Math.max(1, item.cantidad - 1))}>-</Button>
                  <span style={{ margin: '0 8px' }}>{item.cantidad}</span>
                  <Button size="sm" variant="outline-secondary" onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <strong>Total:</strong>
        <strong>${total.toLocaleString('es-CL')}</strong>
      </div>

      <div className="mt-3 d-flex gap-2">
        <Button variant="secondary" onClick={() => { vaciarCarrito(); onClose(); }}>Vaciar</Button>
        <Button variant="primary" onClick={() => { /* futuro: checkout */ onClose(); }}>Ir a pagar</Button>
      </div>
    </div>
  );
};

export default NavBar;
