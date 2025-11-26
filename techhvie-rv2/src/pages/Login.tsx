import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/auth.css";

interface LoginProps {
  onLoginSuccess?: () => void;
}

// Puerto de tu ms_auth_usuarios
const AUTH_BASE_URL = "http://localhost:8081/auth";

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    login?: string;
  }>({});
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 4) {
      newErrors.password = "La contraseña debe tener al menos 4 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const resp = await fetch(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!resp.ok) {
        // 400, 401, etc.
        const msg =
          resp.status === 401 || resp.status === 400
            ? "Correo o contraseña incorrectos"
            : "Error al iniciar sesión. Intenta nuevamente.";
        setErrors({ login: msg });
        return;
      }

      const usuario = await resp.json();

      //Guardar datos en localStorage para usar en Navbar, perfil
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("usuario", JSON.stringify(usuario)); // UsuarioDTO completo
      if (usuario.rol) {
        localStorage.setItem("rol", usuario.rol); // CLIENTE / ADMIN / VENDEDOR
      }

      setErrors({});

      if (onLoginSuccess) onLoginSuccess();

      navigate("/"); // o a /perfil si prefieres
    } catch (error) {
      console.error("Error en login:", error);
      setErrors({
        login: "Error de conexión con el servidor. Verifica que el ms_auth_usuarios esté levantado.",
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration" aria-hidden>
        <img src="/img/login.png" alt="Bienvenido a TechHive" />
      </div>
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {errors.login && (
            <p className="text-danger text-center">{errors.login}</p>
          )}

          <button type="submit" className="auth-btn">
            Ingresar
          </button>

          <div>
            <Link to="/registro" className="auth-outline-btn">
              Crear cuenta
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
