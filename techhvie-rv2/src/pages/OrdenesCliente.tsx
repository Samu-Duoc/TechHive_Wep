import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pedidosService from "../services/pedidosService";
import { useAuth } from "../context/AuthContext";
import MenuPerfil from "./MenuPerfil";
import "../styles/MenuPerfil.css";

type Orden = {
	id?: number;
	pedidoId?: number;
	estado?: string;
	fechaCreacion?: string;
	total?: number;
	};

	const OrdenesCliente: React.FC = () => {
	const { usuario } = useAuth();
	const navigate = useNavigate();
	const [ordenes, setOrdenes] = useState<Orden[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const run = async () => {
		if (!usuario?.id) return;
		try {
			setLoading(true);
			const data = await pedidosService.listarPorUsuario(usuario.id);
			setOrdenes(Array.isArray(data) ? data : []);
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
		};
		run();
	}, [usuario?.id]);

	if (!usuario?.id) {
		return (
		<div className="container mt-4">
			<div className="perfil-layout">
			<MenuPerfil role={null} />
			<div className="perfil-card">Debes iniciar sesión.</div>
			</div>
		</div>
		);
	}

	return (
		<div className="container mt-4">
		<div className="perfil-layout">
			<MenuPerfil role={usuario.rol ?? null} />

			<div className="perfil-card">
			<h2 className="mb-3">Mis Órdenes</h2>

			{loading ? (
				<div className="alert alert-info">Cargando órdenes...</div>
			) : ordenes.length === 0 ? (
				<p>No tienes órdenes todavía.</p>
			) : (
				<div className="d-flex flex-column gap-2">
				{ordenes.map((o, idx) => {
					const id = o.id ?? o.pedidoId;
					return (
					<div key={id ?? `orden-${idx}`} className="card">
						<div className="card-body d-flex justify-content-between align-items-center">
						<div>
							<div className="fw-bold">Orden #{id ?? "(sin id)"}</div>
							<div className="text-muted" style={{ fontSize: 13 }}>
							Estado: {o.estado ?? "—"}
							</div>
						</div>
						<div className="d-flex align-items-center gap-2">
							<div className="fw-bold">${Number(o.total ?? 0).toLocaleString("es-CL")}</div>
							<button
							className="btn btn-primary"
							disabled={!id}
							onClick={() => id && navigate(`/mis-ordenes/${id}`)}
							>
							Ver detalle
							</button>
						</div>
						</div>
					</div>
					);
				})}
				</div>
			)}
			</div>
		</div>
		</div>
	);
};

export default OrdenesCliente;
