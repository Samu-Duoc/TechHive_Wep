import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const AUTH_URL = "http://localhost:8081/auth";

// misma regla del backend (8+, mayus, minus, numero, especial)
const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]).{8,}$/;

const RecoverPassword: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pregunta, setPregunta] = useState("¿Cuál es el nombre de tu primera mascota?");
    const [respuestaSeguridad, setRespuestaSeguridad] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [msg, setMsg] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const buscarPregunta = async () => {
        setMsg("");
        if (!email) {
            setMsg("Ingresa tu correo primero.");
            return;
        }

        try {
            const resp = await fetch(`${AUTH_URL}/pregunta-seguridad?email=${encodeURIComponent(email)}`);
            if (resp.ok) {
                const data = await resp.json();
                if (data?.pregunta) setPregunta(data.pregunta);
            }
        } catch {}
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        if (!email) return setMsg("Correo obligatorio.");
        if (!respuestaSeguridad.trim()) return setMsg("Respuesta de seguridad obligatoria.");
        if (!passwordRegex.test(nuevaPassword)) return setMsg("La nueva contraseña no cumple el formato.");

        setLoading(true);

        try {
            const resp = await fetch(`${AUTH_URL}/recuperar-clave-segura`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    respuesta: respuestaSeguridad,
                    nuevaPassword,
                }),
            });

            if (!resp.ok) {
                let t = "";
                try {
                    const j = await resp.json();
                    t = j?.message || j?.error || JSON.stringify(j);
                } catch {
                    t = await resp.text();
                }
                setMsg(t || "No se pudo recuperar la contraseña.");
                return;
            }

            setMsg("Contraseña cambiada exitosamente");
            setTimeout(() => navigate("/login"), 800);
        } catch {
            setMsg("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Recuperar contraseña</h2>

                {msg && <p className="alert alert-info">{msg}</p>}

                <form className="auth-form" onSubmit={submit}>
                    <div className="form-input">
                        <label>Correo</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                    </div>

                    <button type="button" className="btn btn-outline-secondary w-100" onClick={buscarPregunta}>
                        Ver pregunta
                    </button>

                    <div className="mt-3">
                        <strong>Pregunta:</strong>
                        <div>{pregunta}</div>
                    </div>

                    <div className="form-input mt-3">
                        <label>Respuesta de seguridad</label>
                        <input value={respuestaSeguridad} onChange={(e) => setRespuestaSeguridad(e.target.value)} />
                    </div>

                    <div className="form-input">
                        <label>Nueva contraseña</label>
                        <div style={{ position: "relative" }}>
                            <input
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                style={{ paddingRight: "40px" }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                        <line x1="1" y1="1" x2="23" y2="23"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-warning w-100" disabled={loading}>
                        {loading ? "Cambiando..." : "Cambiar contraseña"}
                    </button>

                    <div className="mt-3">
                        <Link to="/login">Volver al login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecoverPassword;