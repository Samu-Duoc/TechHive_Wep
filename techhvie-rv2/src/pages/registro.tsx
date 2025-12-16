import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AUTH_URL = "http://localhost:8081/auth";

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]).{8,}$/;

type FormData = {
  nombre: string;
  apellido: string;
  rut: string;
  email: string;
  password: string;
  cPassword: string;
  telefono: string;
  direccion: string;
  preguntaSeguridad: string;
  respuestaSeguridad: string;
  termCond: boolean;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    cPassword: "",
    telefono: "",
    direccion: "",
    preguntaSeguridad: "¿Cuál es el nombre de tu primera mascota?",
    respuestaSeguridad: "",
    termCond: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};

    if (!formData.nombre.trim()) e.nombre = "Nombre obligatorio";
    if (!formData.apellido.trim()) e.apellido = "Apellido obligatorio";
    if (!formData.rut.trim()) e.rut = "RUT obligatorio";
    if (!formData.email.trim()) e.email = "Correo obligatorio";
    if (!formData.telefono.trim()) e.telefono = "Teléfono obligatorio";
    if (!formData.direccion.trim()) e.direccion = "Dirección obligatoria";

    if (!formData.password) e.password = "Contraseña obligatoria";
    else if (!passwordRegex.test(formData.password)) {
      e.password =
        "Debe tener 8+ caracteres, mayúscula, minúscula, número y un caracter especial (ej: ! @ # $ % ...)";
    }

    // Si quieres obligar seguridad (recomendado para tu recuperar-clave-segura):
    if (!formData.respuestaSeguridad.trim()) e.respuestaSeguridad = "Respuesta de seguridad obligatoria";

    if (!formData.termCond) e.termCond = "Debes aceptar los términos";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    const payload = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      rut: formData.rut.trim(),
      email: formData.email.trim(),
      password: formData.password,
      telefono: formData.telefono.trim(),
      direccion: formData.direccion.trim(),
      preguntaSeguridad: formData.preguntaSeguridad?.trim(),
      respuestaSeguridad: formData.respuestaSeguridad?.trim(),
    };

    try {
      const response = await fetch(`${AUTH_URL}/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorText = "Error al registrar usuario.";
        try {
          const errJson = await response.json();
          errorText = errJson.message || errJson.error || JSON.stringify(errJson);
        } catch {
          errorText = await response.text();
        }
        setErrors((prev) => ({ ...prev, backend: errorText }));
        return;
      }

      // Usuario registrado exitosamente
      const usuarioRegistrado = await response.json();
      console.log("Usuario registrado", usuarioRegistrado);

      // Iniciar sesión automáticamente
      login(usuarioRegistrado);

      // Redirigir al inicio
      navigate("/");
    } catch (error) {
      setErrors((prev) => ({ ...prev, backend: "Error de conexión con el servidor de usuarios." }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Crear cuenta</h2>

        {errors.backend && <p className="mensajeError text-center">{errors.backend}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label>Nombre</label>
            <input name="nombre" value={formData.nombre} onChange={handleInputChange} />
            {errors.nombre && <div className="mensajeError">{errors.nombre}</div>}
          </div>

          <div className="form-input">
            <label>Apellido</label>
            <input name="apellido" value={formData.apellido} onChange={handleInputChange} />
            {errors.apellido && <div className="mensajeError">{errors.apellido}</div>}
          </div>

          <div className="form-input">
            <label>RUT</label>
            <input name="rut" value={formData.rut} onChange={handleInputChange} placeholder="Ej: 12345678K" />
            {errors.rut && <div className="mensajeError">{errors.rut}</div>}
          </div>

          <div className="form-input">
            <label>Correo</label>
            <input name="email" type="email" value={formData.email} onChange={handleInputChange} />
            {errors.email && <div className="mensajeError">{errors.email}</div>}
          </div>

          <div className="form-input">
            <label>Teléfono</label>
            <input name="telefono" value={formData.telefono} onChange={handleInputChange} />
            {errors.telefono && <div className="mensajeError">{errors.telefono}</div>}
          </div>

          <div className="form-input">
            <label>Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleInputChange} />
            {errors.direccion && <div className="mensajeError">{errors.direccion}</div>}
          </div>

          <div className="form-input">
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
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
            {errors.password && <div className="mensajeError">{errors.password}</div>}
          </div>

          <hr />

          <div className="form-input">
            <label>Pregunta de seguridad</label>
            <input name="preguntaSeguridad" value={formData.preguntaSeguridad} onChange={handleInputChange} />
          </div>

          <div className="form-input">
            <label>Respuesta de seguridad</label>
            <input name="respuestaSeguridad" value={formData.respuestaSeguridad} onChange={handleInputChange} />
            {errors.respuestaSeguridad && <div className="mensajeError">{errors.respuestaSeguridad}</div>}
          </div>

          <div className="form-input termCond">
            <input
              type="checkbox"
              name="termCond"
              checked={formData.termCond}
              onChange={handleInputChange}
              id="termCond"
            />
            <label htmlFor="termCond" style={{ cursor: "pointer" }}>
              Acepto términos y condiciones
            </label>
          </div>
          {errors.termCond && <div className="mensajeError text-center">{errors.termCond}</div>}

          <button className="btn btn-warning w-100 mt-3" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
