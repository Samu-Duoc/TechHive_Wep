import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import pedidosService, { type PedidoDetalleDTO } from "../services/pedidosService";
import "../styles/order.css";

const PRODUCTOS_BASE_URL =
    (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8082";

    type ImgMap = Record<number, string>;

    function buildImageSrc(p: any): string {
    // 1) si viene url directa
    if (p?.imagenUrl && typeof p.imagenUrl === "string") return p.imagenUrl;

    // 2) si viene "imagen" como url/data/base64
    if (p?.imagen && typeof p.imagen === "string") {
        const s = p.imagen.trim();
        if (s.startsWith("http") || s.startsWith("/") || s.startsWith("data:")) return s;
        // si es base64 pelado
        return `data:image/*;base64,${s}`;
    }

    // 3) si viene imagenBase64
    if (p?.imagenBase64 && typeof p.imagenBase64 === "string") {
        return `data:image/*;base64,${p.imagenBase64}`;
    }

    return "/img/logo.jpg";
    }

    async function fetchProductoById(id: number) {
    const resp = await fetch(`${PRODUCTOS_BASE_URL}/productos/${id}`);
    if (!resp.ok) throw new Error(`Productos ${resp.status}`);
    return resp.json();
    }

    const Ticket: React.FC = () => {
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState<PedidoDetalleDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // ✅ Mapa productoId -> src
    const [imgByProductoId, setImgByProductoId] = useState<ImgMap>({});

    const receipt = useMemo(() => {
        try {
        const raw = localStorage.getItem("th_last_receipt");
        return raw ? JSON.parse(raw) : null;
        } catch {
        return null;
        }
    }, []);

    if (!receipt) {
        return (
        <div className="container mt-5 pt-5">
            <div className="alert alert-warning">No hay comprobante para mostrar</div>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
            Ir al home
            </button>
        </div>
        );
    }

    useEffect(() => {
        const run = async () => {
        setLoading(true);
        try {
            const d = await pedidosService.detalle(receipt.pedidoId);
            setDetalle(d);
        } catch {
            setDetalle(null);
        } finally {
            setLoading(false);
        }
        };
        void run();
    }, [receipt?.pedidoId]);

    const items = useMemo(() => {
        const d: any = detalle;
        if (!d) return [] as Array<any>;
        if (Array.isArray(d?.items)) return d.items as Array<any>;
        if (Array.isArray(d?.detalles)) return d.detalles as Array<any>;
        return [] as Array<any>;
    }, [detalle]);

    //Cargar imágenes reales desde MS productos usando productoId
    useEffect(() => {
        const loadImages = async () => {
        if (!items || items.length === 0) return;

        const ids = Array.from(
            new Set(
            items
                .map((it: any) => Number(it.productoId))
                .filter((x: number) => Number.isFinite(x))
            )
        );

        // no vuelvas a pedir las que ya tienes
        const toFetch = ids.filter((id) => !imgByProductoId[id]);
        if (toFetch.length === 0) return;

        try {
            const results = await Promise.allSettled(toFetch.map((id) => fetchProductoById(id)));

            const next: ImgMap = {};
            results.forEach((r, idx) => {
            const id = toFetch[idx];
            if (r.status === "fulfilled") {
                next[id] = buildImageSrc(r.value);
            } else {
                next[id] = "/img/logo.jpg";
            }
            });

            setImgByProductoId((prev) => ({ ...prev, ...next }));
        } catch {
            // si algo falla, no rompas la pantalla
        }
        };

        void loadImages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    return (
        <div className="th-ticket">
        <div className="container mt-5 pt-5" style={{ maxWidth: 800 }}>
            <div className="card">
            <h2>¡Gracias por tu compra!</h2>
            <p>
                Tu orden es <strong>#{receipt.pedidoId}</strong>. Te enviaremos
                actualizaciones por correo.
            </p>

            <div className="text-muted" style={{ marginBottom: 8 }}>
                Método de pago: <strong>{detalle?.metodoPago ?? receipt.metodoPago}</strong>
            </div>

            {/* Envío */}
            <div className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="fw-bold">Detalles de envío</div>
                </div>
                <div className="text-muted">Dirección registrada al pagar</div>
            </div>

            {/* Entrega */}
            <div className="border-bottom pb-3 mb-3">
                <div className="d-flex justify-content-between align-items-center">
                <div>
                    <div className="fw-bold">Detalles de entrega</div>
                    <div className="text-muted">Envío estándar 3-7 días hábiles</div>
                </div>
                <div className="fw-bold">GRATIS</div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-3">
                <div className="fw-bold mb-2">Items de tu orden</div>
                {loading && <div className="text-muted">Cargando items…</div>}

                {!loading && (
                <div className="d-flex flex-column gap-3">
                    {items.map((it: any, idx: number) => {
                    const pid = Number(it.productoId);
                    const imgSrc = Number.isFinite(pid) ? imgByProductoId[pid] : "/img/logo.jpg";

                    return (
                        <div
                        key={it.detalleId ?? `${it.productoId}-${idx}`}
                        className="d-flex align-items-center gap-3"
                        >
                        <div
                            style={{
                            width: 96,
                            height: 96,
                            borderRadius: 12,
                            overflow: "hidden",
                            background: "#f3f3f3",
                            }}
                        >
                            <img
                            src={imgSrc || "/img/logo.jpg"}
                            alt={it.nombreProducto}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            onError={(e) => ((e.target as HTMLImageElement).src = "/img/logo.jpg")}
                            />
                        </div>

                        <div className="flex-fill">
                            <div className="fw-semibold">{it.nombreProducto}</div>
                            <div className="text-muted">Cantidad: {it.cantidad}</div>
                        </div>

                        <div className="text-end">
                            <div>${Number(it.precioUnitario).toFixed(0)}</div>
                            <div className="text-muted" style={{ fontSize: 13 }}>
                            Subtotal
                            </div>
                            <div className="fw-bold">${Number(it.subtotal).toFixed(0)}</div>
                        </div>
                        </div>
                    );
                    })}

                    {/* Totales */}
                    <div className="border-bottom mt-2" />
                    <div className="d-flex justify-content-between mt-2">
                    <div className="text-muted">Subtotal</div>
                    <div className="fw-semibold">
                        $
                        {items
                        .reduce(
                            (acc: number, x: any) =>
                            acc + Number(x.subtotal || x.cantidad * x.precioUnitario),
                            0
                        )
                        .toFixed(0)}
                    </div>
                    </div>
                    <div className="d-flex justify-content-between">
                    <div className="text-muted">Envío</div>
                    <div className="fw-semibold">GRATIS</div>
                    </div>
                    <div className="d-flex justify-content-between">
                    <div className="fw-bold">TOTAL</div>
                    <div className="fw-bold">${Number((detalle as any)?.total ?? receipt.total).toFixed(0)}</div>
                    </div>
                </div>
                )}
            </div>

            {/* Pie */}
            <div className="d-flex gap-2 justify-content-center mt-2">
                <button className="btn btn-primary" onClick={() => navigate("/")}>
                Regresar a la tienda
                </button>
                <button className="btn btn-secondary" onClick={() => navigate("/mis-ordenes")}>
                Ver mis órdenes
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Ticket;
