import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pedidosService from "../services/pedidosService";
import MenuPerfil from "./MenuPerfil";
import { useAuth } from "../context/AuthContext";
import "../styles/MenuPerfil.css";

const OrdenDetalle: React.FC = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const run = async () => {
        if (!pedidoId) return; //evita /undefined
        try {
            setLoading(true);
            const resp = await pedidosService.detalle(pedidoId);
            setData(resp);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
        };
        run();
    }, [pedidoId]);

    const { usuario } = useAuth();
    if (!pedidoId) return <div style={{ padding: 24 }}>ID de orden inválido.</div>;
    if (loading) return <div style={{ padding: 24 }}>Cargando detalle...</div>;
    if (!data) return <div style={{ padding: 24 }}>No se encontró la orden.</div>;

    const items = Array.isArray(data.items) ? data.items : data.detalles ?? [];

    return (
        <div className="container mt-4">
            <div className="perfil-layout">
                <MenuPerfil role={usuario?.rol ?? null} />
                <div className="perfil-card">
        <button onClick={() => navigate("/mis-ordenes")} style={{ marginBottom: 12 }}>
            ← Volver
        </button>

        <h2>Detalle Orden #{pedidoId}</h2>
        <p><b>Estado:</b> {data.estado ?? "—"}</p>
        <p><b>Método de pago:</b> {data.metodoPago ?? "—"}</p>
        <p><b>Total:</b> ${Number(data.total ?? 0).toLocaleString("es-CL")}</p>

        <h3 style={{ marginTop: 18 }}>Productos</h3>
        <div style={{ display: "grid", gap: 10 }}>
            {items.map((it: any, idx: number) => (
            <div
                key={it.id ?? it.productoId ?? `it-${idx}`} // key único
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
            >
                <div style={{ fontWeight: 800 }}>{it.nombreProducto ?? it.nombre ?? "Producto"}</div>
                <div style={{ color: "#6b7280" }}>
                Cantidad: {it.cantidad} — Precio: ${Number(it.precioUnitario ?? it.precio ?? 0).toLocaleString("es-CL")}
                </div>
            </div>
            ))}
        </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenDetalle;
