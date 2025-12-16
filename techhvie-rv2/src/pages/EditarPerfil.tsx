// src/pages/EditarPerfil.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Usuario } from "../context/AuthContext";
import MenuPerfil from "./MenuPerfil";
import "../styles/MenuPerfil.css";

const API = "http://localhost:8081";

const EditarPerfil: React.FC = () => {
    const navigate = useNavigate();
    const { usuario, setUsuario, getAuthHeaders } = useAuth(); //Agregado getAuthHeaders

    const [form, setForm] = useState<Usuario>(() => usuario ?? ({} as Usuario));
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!usuario) {
            navigate("/login");
            return;
        }

        setForm({
            ...usuario,
            nombre: usuario.nombre ?? "",
            apellido: usuario.apellido ?? "",
            rut: usuario.rut ?? "",
            telefono: usuario.telefono ?? "",
            direccion: usuario.direccion ?? "",
        });
    }, [usuario, navigate]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const guardar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario?.id) {
            setMsg("No hay usuario logueado");
            return;
        }

        setLoading(true);
        setMsg("");

        const payload = {
            nombre: form.nombre && form.nombre.trim() ? form.nombre.trim() : null,
            apellido: form.apellido && form.apellido.trim() ? form.apellido.trim() : null,
            rut: form.rut && form.rut.trim() ? form.rut.trim() : null,
            telefono: form.telefono && form.telefono.trim() ? form.telefono.trim() : null,
            direccion: form.direccion && form.direccion.trim() ? form.direccion.trim() : null,
        };

        try {
            const headers = getAuthHeaders();
            
            //  LOGS DE DEBUG
            console.log("Token en localStorage:", localStorage.getItem("token"));
            console.log(" Headers enviados:", headers);
            console.log(" Usuario ID:", usuario.id);
            console.log("Payload:", payload);
            
            const url = `${API}/usuarios/${usuario.id}/perfil`;
            console.log(" URL:", url);

            const resp = await fetch(url, {
                method: "PUT",
                headers,
                body: JSON.stringify(payload),
            });

            console.log(" Response status:", resp.status);

            if (!resp.ok) {
                const txt = await resp.text();
                console.error(" ERROR:", txt);
                setMsg(txt || "No se pudo actualizar el perfil.");
                return;
            }

            const actualizado: Usuario = await resp.json();
            setUsuario(actualizado);
            setMsg("Perfil actualizado correctamente ✅");
            setTimeout(() => navigate("/cuenta/perfil"), 800);
        } catch (err) {
            console.error(err);
            setMsg("Error de conexión actualizando perfil.");
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return null;

    return (
        <div className="container mt-4">
            <div className="perfil-layout">
                <MenuPerfil role={usuario.rol ?? null} />

                <div className="perfil-card">
                    <h3>Editar perfil</h3>

                    {msg && <div className="alert alert-info">{msg}</div>}

                    <form onSubmit={guardar}>
                        <div className="mb-2">
                            <label className="form-label">Nombre</label>
                            <input
                                className="form-control"
                                name="nombre"
                                value={form.nombre ?? ""}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Apellido</label>
                            <input
                                className="form-control"
                                name="apellido"
                                value={form.apellido ?? ""}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">RUT</label>
                            <input
                                className="form-control"
                                name="rut"
                                value={form.rut ?? ""}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-2">
                            <label className="form-label">Teléfono</label>
                            <input
                                className="form-control"
                                name="telefono"
                                value={form.telefono ?? ""}
                                onChange={onChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Dirección</label>
                            <input
                                className="form-control"
                                name="direccion"
                                value={form.direccion ?? ""}
                                onChange={onChange}
                            />
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-success" disabled={loading}>
                                {loading ? "Guardando..." : "Guardar cambios"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/cuenta/perfil")}
                                disabled={loading}
                            >
                                Volver
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPerfil;