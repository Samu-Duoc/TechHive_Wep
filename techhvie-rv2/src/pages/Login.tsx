// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AUTH_URL = "http://localhost:8081/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const resp = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        let msg = "Credenciales inválidas";
        try {
          const err = await resp.json();
          msg = err?.message || err?.error || JSON.stringify(err);
        } catch {
          msg = await resp.text();
        }
        setError(msg);
        return;
      }

      const data = await resp.json();
      console.log(" Respuesta del backend login:", data);
      console.log("¿Tiene token?", "token" in data ? "Sí" : "No");

      //Con tu AuthContext nuevo: login(data) (soporta {token, usuario} o Usuario)
      login(data);

      navigate("/");
    } catch (err) {
      setError("No se pudo conectar con el servidor de auth.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Ilustración lateral */}
      <div className="auth-illustration">
        <img src="/img/login.png" alt="Bienvenido a TechHive" />
      </div>

      <div className="auth-card">
        <h2>Iniciar sesión</h2>

        {error && <p className="mensajeError text-center">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label>Correo</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>

          <div className="form-input">
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                style={{ paddingRight: "40px" }}
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
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <div className="d-flex justify-content-between mt-3">
            <Link to="/registro">Crear cuenta</Link>
            <Link to="/recover-password">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
