// src/pages/CambiarPassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MenuPerfil from "./MenuPerfil";
import "../styles/MenuPerfil.css";

const API = "http://localhost:8081";

const CambiarPassword: React.FC = () => {
    const navigate = useNavigate();
    const { usuario, token } = useAuth();

    const [pwdActual, setPwdActual] = useState("");
    const [pwdNueva, setPwdNueva] = useState("");
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState(false);

    if (!usuario) {
        return (
        <div className="container mt-4">
            <p>Debes iniciar sesión.</p>
        </div>
        );
    }

    const cambiarPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuario.id) return;

        setLoading(true);
        setMsg("");

        const payload = {
        passwordActual: pwdActual,
        nuevaPassword: pwdNueva,
        };

        try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        const resp = await fetch(`${API}/usuarios/${usuario.id}/password`, {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
        });

        if (!resp.ok) {
            const txt = await resp.text();
            setMsg(txt || "No se pudo cambiar la contraseña.");
            return;
        }

        setPwdActual("");
        setPwdNueva("");
        setMsg("Contraseña actualizada correctamente ✅");
        setTimeout(() => navigate("/cuenta/perfil"), 800);
        } catch {
        setMsg("Error de conexión cambiando contraseña.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
        <div className="perfil-layout">
            <MenuPerfil role={usuario.rol ?? null} />

            <div className="perfil-card">
            <h3>Cambiar contraseña</h3>

            {msg && <p className="alert alert-info">{msg}</p>}

            <form onSubmit={cambiarPassword}>
                <div className="mb-3">
                <label className="form-label">Contraseña actual</label>
                <input
                    className="form-control"
                    type="password"
                    value={pwdActual}
                    onChange={(e) => setPwdActual(e.target.value)}
                    required
                />
                </div>

                <div className="mb-3">
                <label className="form-label">Nueva contraseña</label>
                <input
                    className="form-control"
                    type="password"
                    value={pwdNueva}
                    onChange={(e) => setPwdNueva(e.target.value)}
                    required
                />
                </div>

                <div className="d-flex gap-2">
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/cuenta/perfil")}
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

export default CambiarPassword;
