import React, { useEffect, useMemo, useState } from "react";
// Ajusta estas rutas a tus archivos reales:
import { useCarrito } from "../context/CarritoContext";
import { useReveal } from "../hooks/useReveal";
import Notificacion from "../components/Notificacion";
import Dropdown from "react-bootstrap/Dropdown";
import "../styles/global.css";
import "../styles/productos.css";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8082";

interface Producto {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    categoria: string;
    tags: string[];
    precio: number;
    demoUrl?: string;
    codeUrl?: string;

    // Opcionales para conectar con MS o variantes
    stock?: number;
    sku?: string;
    }


    const Productos: React.FC = () => {
    useReveal();
    const { agregarAlCarrito } = useCarrito();

    const [notificacion, setNotificacion] = useState<string | null>(null);

    // Productos desde API
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Categorías (lista filtrable)
    const [categories, setCategories] = useState<string[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState<string>("all");
    const [terminoBusqueda, setTerminoBusqueda] = useState<string>("");

    // Vista previa
    const [productoSeleccionado, setProductoSeleccionado] =
        useState<Producto | null>(null);
    const [cantidadVista, setCantidadVista] = useState<number>(1);

    // Preparar lista de categorías para UI (incluye 'all')
    const categorias = useMemo(() => ["all", ...categories], [categories]);

    const productosFiltrados = useMemo(() => {
        return productos.filter((p) => {
        const coincideCategoria =
            categoriaActiva === "all" || p.categoria === categoriaActiva;

        const termino = terminoBusqueda.trim().toLowerCase();
        const coincideBusqueda =
            termino === "" ||
            p.titulo.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino) ||
            (p.tags || []).some((tag) => tag.toLowerCase().includes(termino));

        return coincideCategoria && coincideBusqueda;
        });
    }, [productos, categoriaActiva, terminoBusqueda]);

    // Fetch productos y categorias desde la API
    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Productos
            const resp = await fetch(`${BASE_URL}/productos`);
            if (!resp.ok) throw new Error(`Productos API responded ${resp.status}`);
            const data = await resp.json();
            setProductos(Array.isArray(data) ? data : []);

            // Categorías: preferir endpoint /categorias
            try {
            const catResp = await fetch(`${BASE_URL}/categorias`);
            if (catResp.ok) {
                const rawCats = await catResp.json();
                const normalized = (rawCats || [])
                .map((c: any) => c.nombre ?? c.name ?? null)
                .filter(Boolean) as string[];
                const uniques = Array.from(new Set(normalized));
                setCategories(uniques);
            } else {
                // Fallback: derive from productos
                const derived = Array.from(new Set((Array.isArray(data) ? data : []).map((p: any) => p.categoria).filter(Boolean)));
                setCategories(derived);
            }
            } catch (catErr) {
            const derived = Array.from(new Set((Array.isArray(data) ? data : []).map((p: any) => p.categoria).filter(Boolean)));
            setCategories(derived);
            }
        } catch (err: any) {
            console.error("Error de products/categories:", err);
            setError(String(err?.message ?? err));
        } finally {
            setLoading(false);
        }
        };

        void fetchData();
    }, []);

    useEffect(() => {
        if (!productoSeleccionado) setCantidadVista(1);
    }, [productoSeleccionado]);

    const getProductImage = (p: Producto) => {
        const anyP = p as any;
        if (anyP.imagen && typeof anyP.imagen === "string") {
        if (anyP.imagen.startsWith("http") || anyP.imagen.startsWith("/") || anyP.imagen.startsWith("data:")) return anyP.imagen;
        }
        if (anyP.imagenBase64) return `data:image/*;base64,${anyP.imagenBase64}`;
        return "/img/logo.jpg";
    };

    return (
        <div className="productos-page container mt-5 pt-5">
        <h2 className="mb-4 text-center">Tienda TechHive</h2>

        {/* Filtros */}
        <div className="row mb-4 align-items-center">
            <div className="col-md-3 mb-2 mb-md-0">
            <Dropdown className="category-dropdown">
                <Dropdown.Toggle id="categoria-dropdown" className="w-100 text-start" as="button">
                {categoriaActiva === "all" ? "Categorías: Todos" : `Categoría: ${categoriaActiva}`}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item key="all" active={categoriaActiva === "all"} onClick={() => setCategoriaActiva("all")}>Todos</Dropdown.Item>
                {categorias
                    .filter((c) => c !== "all")
                    .map((cat) => (
                    <Dropdown.Item key={cat} active={categoriaActiva === cat} onClick={() => setCategoriaActiva(cat)}>
                        {cat}
                    </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className="col-md-9">
            <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, descripción o tag..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            </div>
        </div>

        {loading && <p className="text-center">Cargando productos...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Grid de productos */}
        <div className="row g-4">
            {productosFiltrados.length === 0 ? (
            <p className="text-center">No se encontraron productos.</p>
            ) : (
            productosFiltrados.map((producto) => (
                <div key={producto.id} className="col-md-4 col-lg-3 d-flex">
                <div className="card flex-fill shadow-sm productos-card">
                    <div className="productos-img-wrapper">
                    <img
                        src={getProductImage(producto)}
                        className="card-img-top productos-img"
                        alt={producto.titulo}
                        onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/img/logo.jpg"; // fallback
                        }}
                    />
                    </div>
                    <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.titulo}</h5>
                    <p className="card-text text-muted mb-1">
                        {producto.categoria}
                    </p>
                    <p className="card-text productos-descripcion">
                        {producto.descripcion}
                    </p>
                    <p className="card-text small text-muted">
                        {producto.tags && producto.tags.length > 0 && (
                        <>Tags: {producto.tags.join(", ")}</>
                        )}
                    </p>

                    <div className="mt-auto">
                        <p className="card-text">
                        <strong>
                            Precio: ${producto.precio.toLocaleString("es-CL")}
                        </strong>
                        </p>

                        <button
                        className="btn w-100"
                        style={{
                            background:
                            "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                            color: "black",
                            fontWeight: 600,
                            border: "none",
                            borderRadius: "10px",
                            boxShadow: "0 4px 12px rgba(231, 182, 43, 0.3)",
                        }}
                        onClick={() => {
                            setProductoSeleccionado(producto);
                            setCantidadVista(1);
                        }}
                        >
                        👁️ Ver vista previa
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            ))
            )}
        </div>

        {/* VISTA PREVIA (modal/card flotante) */}
        {productoSeleccionado && (
            <div
            className="preview-backdrop"
            onClick={() => setProductoSeleccionado(null)}
            >
            <div
                className="preview-card"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    aria-label="Cerrar vista previa"
                    className="preview-close-btn"
                    onClick={() => setProductoSeleccionado(null)}
                >
                    ×
                </button>
                <div className="row">
                <div className="col-md-5 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                    <img
                    src={getProductImage(productoSeleccionado)}
                    alt={productoSeleccionado.titulo}
                    style={{
                        maxWidth: "100%",
                        maxHeight: "260px",
                        objectFit: "contain",
                    }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/img/logo.jpg";
                    }}
                    />
                </div>

                <div className="col-md-7">
                    <h3>{productoSeleccionado.titulo}</h3>
                    <p className="text-muted mb-1">
                    Categoría: {productoSeleccionado.categoria}
                    </p>

                    {productoSeleccionado.tags && (
                    <p className="small">
                        Tags: {productoSeleccionado.tags.join(", ")}
                    </p>
                    )}

                    <p className="mt-3">{productoSeleccionado.descripcion}</p>

                    <h4 className="mt-3">
                    ${productoSeleccionado.precio.toLocaleString("es-CL")}
                    </h4>

                    {productoSeleccionado.stock !== undefined && (
                    <p className="mt-2">
                        Stock disponible:{" "}
                        <strong>{productoSeleccionado.stock}</strong>
                    </p>
                    )}

                    {/* FUTURO: variantes por color según SKU */}
                    {/* 
                    {productoSeleccionado.sku && (
                    <ColorVariants sku={productoSeleccionado.sku} />
                    )}
                    */}

                    <div className="d-flex align-items-center mt-3">
                    <label className="me-2">Cantidad:</label>
                    <div className="input-group" style={{ maxWidth: "150px" }}>
                        <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                            setCantidadVista((prev) => (prev > 1 ? prev - 1 : 1))
                        }
                        >
                        -
                        </button>
                        <input
                        type="number"
                        className="form-control text-center"
                        value={cantidadVista}
                        readOnly
                        />
                        <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                            setCantidadVista((prev) => (prev < 10 ? prev + 1 : 10))
                        }
                        >
                        +
                        </button>
                    </div>
                    </div>

                    <button
                    className="btn w-100 mt-3"
                    style={{
                        background:
                        "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        color: "black",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(231, 182, 43, 0.3)",
                    }}
                    onClick={() => {
                        agregarAlCarrito({
                        ...productoSeleccionado,
                        cantidad: cantidadVista,
                        } as any);
                        setNotificacion("AGREGADO AL CARRITO");
                        setProductoSeleccionado(null);
                    }}
                    >
                    🛒 Añadir al carrito
                    </button>

                    <button
                    className="btn btn-link mt-2"
                    onClick={() => setProductoSeleccionado(null)}
                    >
                    Cerrar
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Notificación */}
        {notificacion && (
            <Notificacion
            mensaje={notificacion}
            onClose={() => setNotificacion(null)}
            />
        )}
        </div>
    );
};

export default Productos;
