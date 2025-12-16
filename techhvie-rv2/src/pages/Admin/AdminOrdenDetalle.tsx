import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import pedidosService from "../../services/pedidosService";
import type { EstadoPedido, PedidoDetalleDTO } from "../../services/pedidosService";

const ESTADOS: EstadoPedido[] = [
    "CONFIRMADO",
    "PREPARANDO",
    "EN_TRANSITO",
    "ENTREGADO",
    "CANCELADO",
    ];

    const AdminOrdenDetalle: React.FC = () => {
    const { pedidoId = "" } = useParams();
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const [data, setData] = useState<PedidoDetalleDTO | null>(null);
    const [estado, setEstado] = useState<EstadoPedido>("CONFIRMADO");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const invalidId = useMemo(() => {
        if (!pedidoId) return true;
        return pedidoId === "undefined" || pedidoId === "null";
    }, [pedidoId]);

    useEffect(() => {
        const run = async () => {
        if (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "VENDEDOR")) {
            navigate("/");
            return;
        }
        if (invalidId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const d = await pedidosService.detalle(pedidoId); // existe :contentReference[oaicite:20]{index=20}
            setData(d);
            // ojo: si en backend viene un estado fuera del union, forzamos a string válido
            setEstado((ESTADOS.includes(d.estado as EstadoPedido) ? (d.estado as EstadoPedido) : "CONFIRMADO"));
        } finally {
            setLoading(false);
        }
        };
        void run();
    }, [pedidoId, usuario, invalidId]);

    const onConfirm = async () => {
        if (!pedidoId) return;
        try {
        setSaving(true);
        await pedidosService.actualizarEstado(pedidoId, estado); // PATCH existe :contentReference[oaicite:21]{index=21}
        console.log("Estado de pedido actualizado", { pedidoId, estado });
        navigate("/admin/ordenes");
        } finally {
        setSaving(false);
        }
    };

    if (invalidId) {
        return (
        <div className="container mt-5 pt-5">
            <div className="alert alert-warning">ID de orden inválido.</div>
            <button className="btn btn-outline-primary" onClick={() => navigate("/admin/ordenes")}>
            Volver
            </button>
        </div>
        );
    }

    if (loading) {
        return (
        <div className="container mt-5 pt-5">
            <div className="alert alert-info">Cargando...</div>
        </div>
        );
    }

    if (!data) {
        return (
        <div className="container mt-5 pt-5">
            <div className="alert alert-warning">No se encontró la orden.</div>
            <button className="btn btn-outline-primary" onClick={() => navigate("/admin/ordenes")}>
            Volver
            </button>
        </div>
        );
    }

    return (
        <div className="container mt-5 pt-5" style={{ maxWidth: 1100 }}>
        <button className="btn btn-link mb-2" onClick={() => navigate("/admin/ordenes")}>
            ← Volver
        </button>

        <div className="card mb-3">
            <div className="card-body d-flex justify-content-between flex-wrap gap-2">
            <div>
                <h4 className="mb-1">Orden #{(data as any).pedidoId ?? (data as any).id ?? pedidoId}</h4>
                <div className="text-muted">
                Usuario: {data.usuarioId} · Fecha: {data.fecha}
                </div>
            </div>
            <div className="text-end">
                <div>Método: <b>{data.metodoPago}</b></div>
                <div>Total: <b>${Number(data.total).toFixed(0)}</b></div>
                <div>Estado actual: <b>{data.estado}</b></div>
            </div>
            </div>
        </div>

        <div className="card mb-3">
            <div className="card-body">
            <h5 className="mb-3">Acciones</h5>

            <div className="row g-2 align-items-end">
                <div className="col-md-6">
                <label className="form-label">Cambiar estado</label>
                <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoPedido)}
                >
                    {ESTADOS.map((e) => (
                    <option key={e} value={e}>
                        {e}
                    </option>
                    ))}
                </select>
                </div>

                <div className="col-md-6 d-flex gap-2">
                <button className="btn btn-outline-secondary w-100" onClick={() => navigate("/admin/ordenes")}>
                    Cancelar
                </button>
                <button className="btn btn-primary w-100" disabled={saving} onClick={onConfirm}>
                    {saving ? "Guardando..." : "Confirmar"}
                </button>
                </div>
            </div>
            </div>
        </div>

        <div className="card">
            <div className="card-body">
            <h5 className="mb-3">Items</h5>
            <div className="table-responsive">
                <table className="table table-sm">
                <thead>
                    <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {(() => {
                    const items = Array.isArray((data as any).items)
                        ? (data as any).items
                        : Array.isArray((data as any).detalles)
                        ? (data as any).detalles
                        : [];
                    if (!items.length) {
                        return (
                        <tr>
                            <td colSpan={4} className="text-center text-muted">Sin items</td>
                        </tr>
                        );
                    }
                    return items.map((it: any, idx: number) => {
                        const nombre = it.nombreProducto ?? it.nombre ?? "Producto";
                        const cantidad = Number(it.cantidad ?? 1);
                        const precio = Number(it.precioUnitario ?? it.precio ?? 0);
                        const subtotal = Number(it.subtotal ?? precio * cantidad);
                        const key = `${it.productoId ?? it.id ?? idx}-${nombre}`;
                        return (
                        <tr key={key}>
                            <td>{nombre}</td>
                            <td className="text-center">{cantidad}</td>
                            <td className="text-end">${precio.toFixed(0)}</td>
                            <td className="text-end">${subtotal.toFixed(0)}</td>
                        </tr>
                        );
                    });
                    })()}
                </tbody>
                </table>
            </div>
            </div>
        </div>

        </div>
    );
};

export default AdminOrdenDetalle;
