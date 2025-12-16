import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import pedidosService from "../../services/pedidosService";
import type { Pedido } from "../../services/pedidosService";

const AdminOrdenes: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const run = async () => {
        if (!usuario || (usuario.rol !== "ADMIN" && usuario.rol !== "VENDEDOR")) {
            navigate("/");
            return;
        }
        setLoading(true);
        try {
            const data = await pedidosService.listarTodas(); // existe :contentReference[oaicite:19]{index=19}
            setOrders(data);
        } finally {
            setLoading(false);
        }
        };
        void run();
    }, [usuario]);

    return (
        <div className="container mt-5 pt-5" style={{ maxWidth: 1100 }}>
        <h2 className="mb-3">Órdenes (Admin/Vendedor)</h2>

        {loading ? (
            <div className="alert alert-info">Cargando...</div>
        ) : (
            <div className="d-flex flex-column gap-2">
            {orders.map((o) => (
                <div key={o.id} className="card">
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                    <div className="fw-bold">#{o.id}</div>
                    <div className="text-muted" style={{ fontSize: 13 }}>
                        Usuario: {o.usuarioId} · Estado: <b>{o.estado}</b> · Total: <b>${Number(o.total).toFixed(0)}</b>
                    </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => navigate(`/admin/ordenes/${o.id}`)}>
                    Ver / Editar
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default AdminOrdenes;
