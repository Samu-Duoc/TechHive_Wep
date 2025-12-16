import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import Notificacion from "../components/Notificacion";
import "../styles/productos.css";
import "../styles/global.css";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8082";

type Producto = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  imagenBase64?: string;
  categoria?: string;
  tags?: string[];
  precio: number;
  stock?: number;
  sku?: string;
};

const ProductoDetalle: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCarrito();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [notificacion, setNotificacion] = useState<string | null>(null);

  // usamos `id` directamente; no se requiere memo separado

  const getProductImage = (p: Producto | null) => {
    if (!p) return "/img/logo.jpg";
    const raw = (p as any).imagen ?? (p as any).imagenBase64;
    if (!raw) return "/img/logo.jpg";
    if (typeof raw === "string" && raw.startsWith("data:image")) return raw;
    if (typeof raw === "string" && (raw.startsWith("http") || raw.startsWith("/"))) return raw;
    if (typeof raw === "string" && raw.length > 100) return `data:image/jpeg;base64,${raw}`;
    return `/img/${raw}`;
  };

  useEffect(() => {
    if (!id) return;
    const fetchProducto = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`${BASE_URL}/productos/${id}`);
        if (!resp.ok) throw new Error(`API respondió ${resp.status}`);
        const data = await resp.json();
        setProducto(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    void fetchProducto();
  }, [id]);

  const handleAdd = () => {
    if (!producto) return;
    const qty = Math.max(1, cantidad);
    addItem(
      {
        productoId: producto.id,
        nombre: producto.titulo,
        precio: producto.precio,
        sku: producto.sku,
        imagenUrl: getProductImage(producto),
        stock: producto.stock,
      },
      qty
    );
    setNotificacion("Producto agregado al carrito");
  };

  const maxCantidad = producto?.stock ?? 99;
  const cantidadClamped = Math.min(cantidad, maxCantidad);

  return (
    <div className="container mt-5 pt-4">
      <button
        className="btn mb-3"
        style={{
          background: "var(--primary)",
          color: "#111013",
          fontWeight: 700,
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          padding: "10px 14px"
        }}
        onClick={() => navigate("/productos")}
      >
        ← Volver
      </button>

      {loading && <p className="text-center">Cargando producto...</p>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {producto && !loading && (
        <div className="row g-4 align-items-start">
          <div className="col-md-6 d-flex justify-content-center">
            <div
              className="productos-img-wrapper"
              style={{ maxWidth: 360, maxHeight: 360, padding: 12, background: "#f6f7fb", borderRadius: 16 }}
            >
              <img
                src={getProductImage(producto)}
                alt={producto.titulo}
                className="card-img-top productos-img"
                style={{ objectFit: "contain", maxHeight: 320 }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/img/logo.jpg";
                }}
              />
            </div>
          </div>

          <div className="col-md-6">
            <h2 className="mb-2">{producto.titulo}</h2>
            {producto.categoria && <p className="text-muted mb-1">Categoría: {producto.categoria}</p>}
            {producto.sku && <p className="text-muted mb-2">SKU: {producto.sku}</p>}

            <h3 className="fw-bold mb-3">${producto.precio.toLocaleString("es-CL")}</h3>

            {producto.stock != null && (
              <p className="text-muted">Stock disponible: {producto.stock}</p>
            )}

            <p className="mb-3" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
              {producto.descripcion}
            </p>

            {producto.tags && producto.tags.length > 0 && (
              <div className="mb-3" style={{ color: "#6b7280" }}>
                Tags: {producto.tags.join(", ")}
              </div>
            )}

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="input-group" style={{ maxWidth: 200 }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCantidad((v) => Math.max(1, v - 1))}
                >
                  -
                </button>
                <input
                  className="form-control text-center"
                  value={cantidadClamped}
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCantidad((v) => Math.min(maxCantidad, v + 1))}
                  disabled={producto.stock != null && cantidadClamped >= producto.stock}
                >
                  +
                </button>
              </div>

              <button className="btn btn-dark" onClick={handleAdd} disabled={producto.stock === 0}>
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {notificacion && (
        <Notificacion mensaje={notificacion} onClose={() => setNotificacion(null)} />
      )}
    </div>
  );
};

export default ProductoDetalle;
