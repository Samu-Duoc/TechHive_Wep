import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import "../styles/global.css";
import "../styles/auth.css";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8082";
const api = axios.create({ baseURL: BASE_URL });

// Endpoints relativos
const PRODUCTOS_API = "/productos";
const CATEGORIAS_API = "/categorias";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    stock: number;
    precio: number;
    estado: "Nuevo" | "Retroacondicionado";
    categoria: string;
    sku: string;
    disponibilidad?: string;
    imagenBase64?: string | null;
    }

    interface Categoria {
    id: number;
    nombre: string;
    }

    interface UsuarioLS {
    id: number;
    nombre: string;
    email: string;
    rol: "ADMIN" | "VENDEDOR" | "CLIENTE";
    }

    const Inventario: React.FC = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        stock: 0,
        precio: 0,
        estado: "Nuevo",
        categoria: "",
        sku: "",
    });
    const [precioDisplay, setPrecioDisplay] = useState<string>("0");
    const [stockDisplay, setStockDisplay] = useState<string>("0");

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [cargandoCategorias, setCargandoCategorias] = useState(false);

    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [archivos, setArchivos] = useState<Record<number, File | null>>({});
    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);

    const rawUser = localStorage.getItem("usuario");
    const usuario: UsuarioLS | null = rawUser ? JSON.parse(rawUser) : null;

    if (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "VENDEDOR")) {
        return (
        <div className="container">
            <h2>Acceso restringido</h2>
            <p>Solo Administradores y Vendedores pueden gestionar el inventario.</p>
        </div>
        );
    }

    const esAdmin = usuario.rol === "ADMIN";

    const cargarProductos = async () => {
        try {
        setCargando(true);
        const resp = await api.get<Producto[]>(PRODUCTOS_API);
        setProductos(resp.data || []);
        setError(null);
        } catch (err) {
        console.error(err);
        setError("Error al cargar productos. Verifica el microservicio.");
        } finally {
        setCargando(false);
        }
    };

    const cargarCategorias = async () => {
        try {
        setCargandoCategorias(true);
        const resp = await api.get(CATEGORIAS_API);
        // Acepta { id, nombre } o { categoria_id, nombre }
        const raw = resp.data || [];
        const normalized: Categoria[] = raw.map((c: any) => ({
            id: c.id ?? c.categoria_id ?? 0,
            nombre: c.nombre,
        }));
        setCategorias(normalized);
        if ((form.categoria === "" || form.categoria == null) && normalized.length > 0) {
            setForm((prev) => ({ ...prev, categoria: normalized[0].nombre }));
        }
        } catch (err) {
        console.error("Error cargando categorias:", err);
        } finally {
        setCargandoCategorias(false);
        }
    };

    useEffect(() => {
        void cargarProductos();
        void cargarCategorias();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "precio") {
        const raw = value;
        setPrecioDisplay(raw);
        const digits = raw.replace(/\./g, "").replace(/[^0-9]/g, "");
        setForm((prev) => ({ ...prev, precio: Number(digits) || 0 }));
        } else if (name === "stock") {
        const raw = value;
        const digits = raw.replace(/[^0-9]/g, "");
        setStockDisplay(digits);
        setForm((prev) => ({ ...prev, stock: Number(digits) || 0 }));
        } else {
        setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const formatNumberWithDots = (n: number) => {
        if (!Number.isFinite(n)) return "0";
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const limpiarForm = () => {
        setForm({
        nombre: "",
        descripcion: "",
        stock: 0,
        precio: 0,
        estado: "Nuevo",
        categoria: "",
        sku: "",
        });
        setEditandoId(null);
        setNuevaImagen(null);
        setPrecioDisplay("0");
        setStockDisplay("0");
    };

    const handleEditar = (producto: Producto) => {
        setEditandoId(producto.id);
        setForm({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        stock: producto.stock,
        precio: producto.precio,
        estado: producto.estado,
        categoria: producto.categoria,
        sku: producto.sku,
        });
        setNuevaImagen(null);
        setPrecioDisplay(formatNumberWithDots(producto.precio));
        setStockDisplay(String(producto.stock ?? 0));
    };

    const generateSku = (name: string) => {
        const base = (name || "prod")
        .toString()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "")
        .slice(0, 8);
        const rnd = Math.floor(Math.random() * 9000) + 1000;
        return `${base}-${rnd}`;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
        const makePayload = (baseForm: typeof form) => {
            const skuVal =
            baseForm.sku && String(baseForm.sku).trim() !== "" ? baseForm.sku : generateSku(baseForm.nombre);
            return {
            ...baseForm,
            sku: skuVal,
            // Enviar como string para mapear a BigDecimal con seguridad en backend
            precio: String(baseForm.precio),
            };
        };

        if (editandoId == null) {
            // CREAR
            const payload = makePayload(form);
            const resp = await api.post(PRODUCTOS_API, payload);
            const createdId = resp?.data?.id ?? resp?.data?.productoId ?? null;
            if (createdId && nuevaImagen) {
            try {
                await uploadImageById(createdId, nuevaImagen);
                setNuevaImagen(null);
            } catch (err) {
                console.error("Error subiendo imagen tras crear:", err);
            }
            }
        } else {
            // ACTUALIZAR
            const payload = makePayload(form);
            await api.put(`${PRODUCTOS_API}/${editandoId}`, payload);
            if (editandoId && nuevaImagen) {
            try {
                await uploadImageById(editandoId, nuevaImagen);
                setNuevaImagen(null);
            } catch (err) {
                console.error("Error subiendo imagen tras actualizar:", err);
            }
            }
        }

        await cargarProductos();
        limpiarForm();
        } catch (err: any) {
        console.error("Error saving product:", err);
        if (err?.response) {
            console.error("Response status:", err.response.status, "data:", err.response.data);
            const msg =
            err.response.data?.message ?? err.response.data?.error ?? JSON.stringify(err.response.data) ?? err.message;
            setError(`Error al guardar el producto: ${err.response.status} - ${msg}`);
        } else if (err?.request) {
            console.error("No response received, request:", err.request);
            setError("Error al guardar el producto: sin respuesta del servidor.");
        } else {
            setError(`Error al guardar el producto: ${err.message ?? String(err)}`);
        }
        }
    };

    const handleEliminar = async (id: number) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
        await api.delete(`${PRODUCTOS_API}/${id}`);
        await cargarProductos();
        } catch (err) {
        console.error(err);
        setError("Error al eliminar el producto.");
        }
    };

    const handleFileChange = (id: number, file: File | null) => {
        setArchivos((prev) => ({
        ...prev,
        [id]: file,
        }));
    };

    const handleSubirImagen = async (id: number) => {
        const archivo = archivos[id];
        if (!archivo) {
        alert("Selecciona un archivo primero.");
        return;
        }

        try {
        const formData = new FormData();
        formData.append("archivo", archivo);

        await api.post(`${PRODUCTOS_API}/${id}/imagen`, formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        });

        alert("Imagen subida correctamente");
        await cargarProductos();
        } catch (err) {
        console.error(err);
        alert("Error al subir imagen");
        }
    };

    const uploadImageById = async (id: number, file: File) => {
        const formData = new FormData();
        formData.append("archivo", file);
        await api.post(`${PRODUCTOS_API}/${id}/imagen`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        });
    };

    return (
        <div className="container">
        <h2>{esAdmin ? "Panel de Inventario" : "Panel de Inventario"}</h2>
        <p className="text-muted">Gestiona los productos de TechHive: crea, edita, elimina y sube imágenes.</p>

        <div className="card mb-4 p-3">
            <h4>{editandoId ? "Editar producto" : "Crear nuevo producto"}</h4>
            <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
                <label className="form-label fw-bold">Nombre</label>
                <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>

            <div className="col-md-8">
                <label className="form-label fw-bold">Descripción</label>
                <input
                className="form-control"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
                />
            </div>

            <div className="col-md-3">
                <label className="form-label fw-bold">Precio</label>
                <input
                type="text"
                inputMode="numeric"
                pattern="[0-9.]*"
                className="form-control"
                name="precio"
                value={precioDisplay}
                onChange={handleChange}
                onFocus={() => setPrecioDisplay((prev) => prev.replace(/\./g, ""))}
                onBlur={() => setPrecioDisplay(formatNumberWithDots(Number(form.precio) || 0))}
                required
                />
                <div className="form-text">Ingresa el precio sin decimales, ejemplo: 499.990</div>
            </div>

            <div className="col-md-3">
                <label className="form-label fw-bold">Stock</label>
                <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="form-control"
                name="stock"
                value={stockDisplay}
                onChange={handleChange}
                required
                />
            </div>

            <div className="col-md-3">
                <label className="form-label fw-bold">Estado</label>
                <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                <option value="Nuevo">Nuevo</option>
                <option value="Retroacondicionado">Retroacondicionado</option>
                </select>
            </div>

            <div className="col-md-3">
                <label className="form-label fw-bold">Categoría</label>
                {cargandoCategorias ? (
                <div>cargando categorías...</div>
                ) : (
                <select className="form-select" name="categoria" value={form.categoria} onChange={handleChange} required>
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                    <option key={c.id} value={c.nombre}>
                        {c.nombre}
                    </option>
                    ))}
                </select>
                )}
            </div>

            <div className="col-md-3">
                <label className="form-label fw-bold">SKU</label>
                <input className="form-control" name="sku" value={form.sku} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
                <label className="form-label fw-bold">Imagen del producto</label>
                <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setNuevaImagen(e.target.files?.[0] ?? null)}
                />
                {nuevaImagen && <div className="small text-muted mt-1">Seleccionado: {nuevaImagen.name}</div>}
            </div>

            <div className="col-12 d-flex gap-2 mt-3">
                <button type="submit" className="auth-btn">
                {editandoId ? "Actualizar" : "Crear"}
                </button>
                {editandoId && nuevaImagen && (
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={async () => {
                    if (!nuevaImagen || !editandoId) return alert("Selecciona una imagen y asegúrate de estar editando un producto.");
                    try {
                        await uploadImageById(editandoId, nuevaImagen);
                        setNuevaImagen(null);
                        await cargarProductos();
                        alert("Imagen subida correctamente");
                    } catch (err) {
                        console.error(err);
                        alert("Error al subir imagen");
                    }
                    }}
                >
                    Subir imagen
                </button>
                )}
                {editandoId && (
                <button type="button" className="btn btn-secondary" onClick={limpiarForm}>
                    Cancelar edición
                </button>
                )}
            </div>
            </form>
        </div>

        <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
            <h4>Listado de productos</h4>
            <button className="btn btn-outline-primary btn-sm" onClick={() => cargarProductos()}>
                Recargar
            </button>
            </div>

            {cargando ? (
            <p>Cargando productos...</p>
            ) : error ? (
            <p className="text-danger">{error}</p>
            ) : productos.length === 0 ? (
            <p>No hay productos registrados.</p>
            ) : (
            <div className="table-responsive">
                <table className="table table-sm align-middle">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>SKU</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.nombre}</td>
                        <td>{p.categoria}</td>
                        <td>${p.precio.toLocaleString("es-CL")}</td>
                        <td>{p.stock}</td>
                        <td>{p.estado}</td>
                        <td>{p.sku}</td>
                        <td>
                        {p.imagenBase64 ? (
                            <img
                            src={`data:image/jpeg;base64,${p.imagenBase64}`}
                            alt={p.nombre}
                            style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                            />
                        ) : (
                            <span className="text-muted">Sin imagen</span>
                        )}
                        </td>
                        <td>
                        <div className="d-flex flex-column gap-1">
                            <button className="btn btn-sm btn-primary" type="button" onClick={() => handleEditar(p)}>
                            Editar
                            </button>
                            {esAdmin && (
                            <button className="btn btn-sm btn-danger" type="button" onClick={() => handleEliminar(p.id)}>
                                Eliminar
                            </button>
                            )}
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            )}
        </div>
        </div>
    );
};

export default Inventario;