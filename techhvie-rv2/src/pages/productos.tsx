import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import Notificacion from "../components/Notificacion";
import Dropdown from "react-bootstrap/Dropdown";
import "../styles/global.css";
import "../styles/productos.css";

const BASE_URL =
    (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8082";

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
    stock?: number;
    sku?: string;
}

const Productos: React.FC = () => {
    useReveal();

    // carrito LOCAL (no usado aquí; se gestiona en detalle)

    const [notificacion, setNotificacion] = useState<string | null>(null);

    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [categoriaActiva, setCategoriaActiva] = useState<string>("all");
    const [terminoBusqueda, setTerminoBusqueda] = useState<string>("");

    const navigate = useNavigate();

    const categorias = useMemo(
        () => ["all", ...categories],
        [categories]
    );

    const productosFiltrados = useMemo(() => {
        return productos.filter((p) => {
        const coincideCategoria =
            categoriaActiva === "all" || p.categoria === categoriaActiva;

        const termino = terminoBusqueda.trim().toLowerCase();
        const coincideBusqueda =
            termino === "" ||
            p.titulo.toLowerCase().includes(termino) ||
            p.descripcion.toLowerCase().includes(termino) ||
            (p.tags || []).some((tag) =>
            tag.toLowerCase().includes(termino)
            );

        return coincideCategoria && coincideBusqueda;
        });
    }, [productos, categoriaActiva, terminoBusqueda]);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const resp = await fetch(`${BASE_URL}/productos`);
            if (!resp.ok) throw new Error(`API responded ${resp.status}`);
            const data = await resp.json();
            setProductos(Array.isArray(data) ? data : []);

            try {
            const catResp = await fetch(`${BASE_URL}/categorias`);
            if (catResp.ok) {
                const rawCats = await catResp.json();
                const normalized = (rawCats || [])
                .map((c: any) => c.nombre ?? c.name ?? null)
                .filter(Boolean) as string[];
                setCategories(Array.from(new Set(normalized)));
            } else {
                const derived = Array.from(
                new Set(
                    (Array.isArray(data) ? data : [])
                    .map((p: any) => p.categoria)
                    .filter(Boolean)
                )
                );
                setCategories(derived);
            }
            } catch {
            const derived = Array.from(
                new Set(
                (Array.isArray(data) ? data : [])
                    .map((p: any) => p.categoria)
                    .filter(Boolean)
                )
            );
            setCategories(derived);
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? String(err));
        } finally {
            setLoading(false);
        }
        };

        void fetchData();
    }, []);

    const getProductImage = (p: Producto) => {
    const img: any = (p as any).imagen ?? (p as any).imagenBase64;

    if (!img) return "/img/logo.jpg";

    if (typeof img === "string" && img.startsWith("data:image")) {
        return img;
    }

    if (
        typeof img === "string" &&
        (img.startsWith("http") || img.startsWith("/"))
    ) {
        return img;
    }

    if (typeof img === "string" && img.length > 100) {
        return `data:image/jpeg;base64,${img}`;
        // si usas png puedes cambiar a image/png
    }

    };


    return (
        <div className="productos-page container mt-5 pt-2">
        <h2 className="mb-4 text-center productos-title">Productos</h2>

        {/* FILTROS */}
        <div className="row mb-4 align-items-center">
            <div className="col-md-3 mb-2 mb-md-0">
            <Dropdown className="category-dropdown">
                <Dropdown.Toggle
                id="categoria-dropdown"
                className="w-100 text-start"
                as="button"
                >
                {categoriaActiva === "all"
                    ? "Categorías: Todos"
                    : `Categoría: ${categoriaActiva}`}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                <Dropdown.Item
                    active={categoriaActiva === "all"}
                    onClick={() => setCategoriaActiva("all")}
                >
                    Todos
                </Dropdown.Item>

                {categorias
                    .filter((c) => c !== "all")
                    .map((cat) => (
                    <Dropdown.Item
                        key={cat}
                        active={categoriaActiva === cat}
                        onClick={() => setCategoriaActiva(cat)}
                    >
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
                placeholder="Buscar por nombre"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
            </div>
        </div>

        {loading && <p className="text-center">Cargando productos...</p>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* GRID */}
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
                        (e.target as HTMLImageElement).src = "/img/logo.jpg";
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

                    <div className="mt-auto">
                        <p className="card-text fw-bold">
                        ${producto.precio.toLocaleString("es-CL")}
                        </p>

                        <button
                        className="btn w-100"
                        style={{
                            background:
                            "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                            color: "black",
                            fontWeight: 600,
                            borderRadius: "10px",
                        }}
                        onClick={() => navigate(`/productos/${producto.id}`)}
                        >
                        👁️ Ver detalle
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            ))
            )}
        </div>
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
