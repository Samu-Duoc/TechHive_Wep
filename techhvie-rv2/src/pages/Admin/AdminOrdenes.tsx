import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import pedidosService from "../../services/pedidosService";
import type { Pedido } from "../../services/pedidosService";

const AdminOrdenes: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    const refetch = async () => {
        setLoading(true);
        try {
        const data = await pedidosService.listarTodas();
        setOrders(data);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        const run = async () => {
        if (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "VENDEDOR")) {
            navigate("/");
            return;
        }
        await refetch();
        };
        void run();
        // Refetch when navigating back/forward to this page
    }, [usuario, location.key]);

    useEffect(() => {
        // Refetch when window regains focus (e.g., after editing a detail tab)
        const onFocus = () => { void refetch(); };
        window.addEventListener("focus", onFocus);
        return () => window.removeEventListener("focus", onFocus);
    }, []);

    return (
        <div className="container mt-5 pt-5" style={{ maxWidth: 1100 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="m-0">Órdenes (Admin/Vendedor)</h2>
            <button className="btn btn-outline-primary" onClick={() => void refetch()} disabled={loading}>
                {loading ? "Actualizando..." : "Actualizar"}
            </button>
        </div>

        {loading ? (
            <div className="alert alert-info">Cargando...</div>
        ) : (
            <div className="d-flex flex-column gap-2">
            {orders.map((o) => {
                const id = (o as any).id ?? (o as any).pedidoId;
                return (
                <div key={id ?? (o as any).id ?? (o as any).pedidoId} className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                    <div className="fw-bold">#{id ?? "(sin id)"}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                        Usuario: {o.usuarioId} · Estado: <b>{o.estado}</b> · Total: <b>${Number(o.total).toFixed(0)}</b>
                    </div>
                    </div>
                    <button className="btn btn-primary" disabled={!id} onClick={() => id && navigate(`/admin/ordenes/${id}`)}>
                    Ver / Editar
                    </button>
                </div>
                </div>
                );
            })}
            </div>
        )}
        </div>
    );
};

export default AdminOrdenes;
