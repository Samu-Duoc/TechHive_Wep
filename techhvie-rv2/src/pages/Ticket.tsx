import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import pedidosService, { type PedidoDetalleDTO } from "../services/pedidosService";
import "../styles/order.css";

const Ticket: React.FC = () => {
    const navigate = useNavigate();
    const [detalle, setDetalle] = useState<PedidoDetalleDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
            <button className="btn btn-primary" onClick={() => navigate("/")}>Ir al home</button>
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

    return (
        <div className="th-ticket">
        <div className="container mt-5 pt-5" style={{ maxWidth: 800 }}>
        <div className="card">
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu orden es <strong>#{receipt.pedidoId}</strong>. Te enviaremos actualizaciones por correo.</p>

            {/* Sección Envío */}
            <div className="border-bottom pb-3 mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="fw-bold">Detalles de envío</div>
            </div>
            <div className="text-muted">📍 Dirección registrada al pagar</div>
            </div>

            {/* Sección Entrega */}
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
            {!loading && detalle && (
                <div className="d-flex flex-column gap-3">
                {detalle.items.map((it) => (
                    <div key={`${it.productoId}-${it.nombreProducto}`} className="d-flex align-items-center gap-3">
                    <div style={{ width: 96, height: 96, borderRadius: 12, overflow: "hidden", background: "#f3f3f3" }}>
                        <img
                        src="/img/logo.jpg"
                        alt={it.nombreProducto}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="flex-fill">
                        <div className="fw-semibold">{it.nombreProducto}</div>
                        <div className="text-muted">Cantidad: {it.cantidad}</div>
                    </div>
                    <div className="text-end">
                        <div>${Number(it.precioUnitario).toFixed(0)}</div>
                        <div className="text-muted" style={{ fontSize: 13 }}>Subtotal</div>
                        <div className="fw-bold">${Number(it.subtotal).toFixed(0)}</div>
                    </div>
                    </div>
                ))}

                {/* Totales */}
                <div className="border-bottom mt-2" />
                <div className="d-flex justify-content-between mt-2">
                    <div className="text-muted">Subtotal</div>
                    <div className="fw-semibold">
                    ${detalle.items.reduce((acc, x) => acc + Number(x.subtotal || x.cantidad * x.precioUnitario), 0).toFixed(0)}
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="text-muted">Envío</div>
                    <div className="fw-semibold">GRATIS</div>
                </div>
                <div className="d-flex justify-content-between">
                    <div className="fw-bold">TOTAL</div>
                    <div className="fw-bold">${Number(detalle.total ?? receipt.total).toFixed(0)}</div>
                </div>
                </div>
            )}
            </div>

            {/* Pie */}
            <div className="d-flex gap-2 justify-content-center mt-2">
            <button className="btn btn-primary" onClick={() => navigate("/")}>Regresar a la tienda</button>
            <button className="btn btn-secondary" onClick={() => navigate("/mis-ordenes")}>Ver mis órdenes</button>
            </div>
        </div>
        </div>
        </div>
    );
};

export default Ticket;
