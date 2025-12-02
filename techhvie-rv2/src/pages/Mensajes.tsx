import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/Mensajes.css";
import ContactoBuscar from "./ContactoBuscar";
import MenuPerfil from "./MenuPerfil";
import { useAuth } from "../context/AuthContext";

interface Mensaje {
    id: number;
    nombre: string;
    email: string;
    mensaje: string;
    fecha?: string; // ISO date
    estado?: "NUEVO" | "RESPONDIDO" | "ARCHIVADO";
    }

    const CARRITO_API = "http://localhost:8085/contacto"; // endpoint de ejemplo

    const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString();
    } catch {
        return iso;
    }
    };

    const Mensajes: React.FC = () => {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [filtro, setFiltro] = useState<"ALL" | "NUEVO" | "RESPONDIDO" | "ARCHIVADO">("ALL");
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { usuario } = useAuth();

    const cargarMensajes = async () => {
        setCargando(true);
        setError(null);
        try {
        const resp = await axios.get(`${CARRITO_API}/listar`);
        // normalizar estructura mínima
        const data: Mensaje[] = (resp.data || []).map((r: any) => ({
            id: r.id,
            nombre: r.nombre,
            email: r.email,
            mensaje: r.mensaje,
            fecha: r.fechaCreacion || r.fecha || r.createdAt || null,
            estado: r.estado || "NUEVO",
        }));
        setMensajes(data);
        } catch (e) {
        console.error(e);
        setError("No se pudieron cargar los mensajes.");
        } finally {
        setCargando(false);
        }
    };

    useEffect(() => {
        void cargarMensajes();
    }, []);

    const filtrados = useMemo(() => {
        if (filtro === "ALL") return mensajes;
        return mensajes.filter((m) => m.estado === filtro);
    }, [mensajes, filtro]);

    return (
        <div className="mensajes-page p-4">
        <div className="perfil-layout">
            <aside>
                <MenuPerfil role={usuario?.rol ?? null} />
            </aside>

            <main>
                <div className="card p-3">
                    <div className="mensajes-header mb-3">
                        <h2 className="mb-1">Mensajes</h2>
                        <small className="text-muted">Ver y gestionar mensajes de contacto</small>
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-3 mensajes-filtros">
                        <button className={`btn btn-sm ${filtro === "ALL" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFiltro("ALL")}>Todos</button>
                        <button className={`btn btn-sm ${filtro === "NUEVO" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setFiltro("NUEVO")}>Nuevos</button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div style={{ minWidth: 320 }}>
                            <h5 className="mb-1">Buscar por ID</h5>
                            <ContactoBuscar />
                        </div>
                        <div>
                            <button className="btn btn-sm btn-outline-primary" onClick={cargarMensajes} disabled={cargando}>{cargando ? 'Cargando...' : 'Actualizar'}</button>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    {filtrados.length === 0 && !cargando ? (
                        <div className="text-muted">No hay mensajes para mostrar.</div>
                    ) : (
                        <div className="mensajes-list">
                            {filtrados.map((m) => (
                                <div key={m.id} className="mensaje-card mb-3">
                                    <div className="mensaje-meta d-flex justify-content-between">
                                        <div className="d-flex gap-3 align-items-center">
                                            <div className={`badge estado-badge ${m.estado?.toLowerCase()}`}>{m.estado}</div>
                                            <div>
                                                <div className="fw-bold">{m.nombre}</div>
                                                <div className="text-muted small">{m.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-muted small">{formatDate(m.fecha)}</div>
                                    </div>

                                    <div className="mensaje-body mt-2">
                                        <p className="mb-2">{m.mensaje}</p>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-sm btn-outline-secondary me-2">Ver</button>
                                            <button className="btn btn-sm btn-outline-success me-2">Marcar respondido</button>
                                            <button className="btn btn-sm btn-outline-danger">Archivar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
        </div>
    );
};

export default Mensajes;
