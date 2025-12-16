import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../styles/carrito.css";

const TrashIcon: React.FC = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const Carrito: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, increase, decrease, remove } = useCarrito();

  const discount = useMemo(() => 0, []);
  const tax = useMemo(() => 0, []);
  const shipping = useMemo(() => 0, []);
  const grandTotal = useMemo(
    () => Math.max(0, total - discount + tax + shipping),
    [total, discount, tax, shipping]
  );

  const proceed = () => {
    if (items.length === 0) return;
    navigate("/pago");
  };

  return (
    <div className="cart-page">
      <div className="cart-head">
        <h1>Carrito</h1>

        <div className="cart-steps">
          <div className="step">
            <b>1.</b> Carrito
          </div>
          <div className="line" />
          <div className="step">
            <b>2.</b> Datos
          </div>
          <div className="line" />
          <div className="step">
            <b>3.</b> Pago
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cart-card cart-left" style={{ marginTop: 16, padding: 18 }}>
          <h3 style={{ margin: 0, fontWeight: 800 }}>Tu carrito está vacío</h3>
          <p style={{ marginTop: 8, color: "#6b7280" }}>
            Agrega productos para poder pagar.
          </p>
          <button
            className="primary-btn"
            style={{ maxWidth: 260 }}
            onClick={() => navigate("/")}
          >
            Ir a la tienda
          </button>
        </div>
      ) : (
        <div className="cart-grid">
          {/* LEFT */}
          <div className="cart-card cart-left">
            {items.map((p) => (
              <div className="cart-item" key={p.productoId}>
                <img
                  className="item-img"
                  src={p.imagenUrl || "/img/logo.jpg"}
                  alt={p.nombre}
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/img/logo.jpg")
                  }
                />

                <div className="item-main">
                  <div className="item-sub">
                    {p.sku ? `SKU ${p.sku}` : `ID ${p.productoId}`}
                    {p.stock != null && (
                      <span className="item-stock">Stock: {p.stock}</span>
                    )}
                  </div>

                  {/*PRECIO + BOTONES A LA DERECHA */}
                  <div className="price-row">
                    <div className="item-price">
                      ${Number(p.precio).toLocaleString("es-CL")}
                    </div>

                    <div className="qty qty-inline">
                      <button type="button" onClick={() => decrease(p.productoId)}>
                        –
                      </button>

                      <span>{p.cantidad}</span>

                      <button
                        type="button"
                        onClick={() => {
                          if (p.stock != null && p.cantidad >= p.stock) return;
                          increase(p.productoId);
                        }}
                        disabled={p.stock != null && p.cantidad >= p.stock}
                        title={
                          p.stock != null && p.cantidad >= p.stock
                            ? "Stock máximo alcanzado"
                            : "Aumentar"
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/*SOLO UN BASURERO (arriba derecha) */}
                <div className="item-actions">
                  <button
                    className="icon-btn danger"
                    title="Eliminar"
                    onClick={() => remove(p.productoId)}
                    type="button"
                    aria-label={`Eliminar ${p.nombre}`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="cart-card cart-right">
            <div className="summary-title">Resumen de la orden</div>

            <div className="summary-row">
              <span>Subtotal</span>
              <b>${Number(total).toLocaleString("es-CL")}</b>
            </div>
            <div className="summary-row">
              <span>Descuento</span>
              <b>${Number(discount).toLocaleString("es-CL")}</b>
            </div>
            <div className="summary-row">
              <span>Impuestos</span>
              <b>${Number(tax).toLocaleString("es-CL")}</b>
            </div>
            <div className="summary-row">
              <span>Envío</span>
              <b>{shipping === 0 ? "Gratis" : `$${Number(shipping).toLocaleString("es-CL")}`}</b>
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span className="summary-total">Total</span>
              <b className="summary-total">${Number(grandTotal).toLocaleString("es-CL")}</b>
            </div>

            <button className="primary-btn" onClick={proceed} disabled={items.length === 0}>
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
