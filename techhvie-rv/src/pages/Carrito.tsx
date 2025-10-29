import React from "react";
import { Offcanvas } from "react-bootstrap";
import "../styles/carrito.css";
import { useCarrito } from "../context/CarritoContext";

const Carrito: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const { carrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad } =
    useCarrito();

  // Calcular total robusto: convertir precio a número si viene como string (p. ej. "$1.000")
  const total = carrito.reduce((acc, producto) => {
    const precioNum = typeof producto.precio === "number"
      ? producto.precio
      : parseFloat(String(producto.precio).replace(/[^0-9.-]+/g, "")) || 0;
    return acc + precioNum * (producto.cantidad || 1);
  }, 0);

  return (
    <Offcanvas
      show={visible}
      onHide={onClose}
      placement="end"
      backdrop
      keyboard
      className="tech-offcanvas carrito-panel"
    >
      <Offcanvas.Header closeButton className="cart-header">
        <Offcanvas.Title className="cart-title">🛒 Tu Carrito</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="cart-body">
        {carrito.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío 😢</p>
        ) : (
          <>
            {carrito.map((producto) => (
              <div
                key={producto.id}
                className="d-flex align-items-center mb-3 border-bottom pb-2 cart-item"
              >
                <img
                  src={producto.imagen}
                  alt={producto.titulo}
                  className="cart-img"
                />
                <div className="flex-grow-1">
                  <strong>{producto.titulo}</strong>
                  <p className="mb-1">
                    ${(() => {
                      const precioNum = typeof producto.precio === "number"
                        ? producto.precio
                        : parseFloat(String(producto.precio).replace(/[^0-9.-]+/g, "")) || 0;
                      return precioNum.toLocaleString("es-CL");
                    })()}
                  </p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() =>
                        actualizarCantidad(producto.id, producto.cantidad - 1)
                      }
                    >
                      -
                    </button>
                    <span>{producto.cantidad}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary ms-1"
                      onClick={() =>
                        actualizarCantidad(producto.id, producto.cantidad + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-danger ms-2 delete-btn"
                  onClick={() => eliminarDelCarrito(producto.id)}
                >
                  🗑
                </button>
              </div>
            ))}

            <div className="text-center mt-3">
              <h5 className="mb-3">
                Total: ${total.toLocaleString("es-CL")}
              </h5>
              <button className="btn btn-warning me-2" onClick={vaciarCarrito}>
                Vaciar Carrito
              </button>
              <button className="btn btn-success">Proceder al Pago</button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Carrito;
