import React, { type FormEvent, useState, type ChangeEvent } from "react";
import "../styles/auth.css";

// Componente de Registro conectado al microservicio ms_auth_usuarios
const RegisterIn: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    cPassword: "",
    telefono: "",
    direccion: "",
    termCond: false,
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    password: "",
    cPassword: "",
    telefono: "",
    direccion: "",
    termCond: "",
    backend: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Solo números para teléfono
    if (name === "telefono") {
      const cleaned = value.replace(/\D+/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleaned }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validar = (): boolean => {
    let todoOk = true;
    const newErrors = { ...errors, backend: "" };

    // Nombre
    if (formData.nombre.trim().length < 3 || formData.nombre.trim().length > 50) {
      newErrors.nombre = "Nombre debe contener entre 3 y 50 caracteres";
      todoOk = false;
    } else newErrors.nombre = "";

    // Apellido
    if (formData.apellido.trim().length < 3 || formData.apellido.trim().length > 50) {
      newErrors.apellido = "Apellido debe contener entre 3 y 50 caracteres";
      todoOk = false;
    } else newErrors.apellido = "";

    // RUT (validación simple, solo que no esté vacío)
    if (!formData.rut.trim()) {
      newErrors.rut = "El RUT es obligatorio";
      todoOk = false;
    } else newErrors.rut = "";

    // Email
    if (
      formData.email.trim() === "" ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Correo debe tener un formato válido (usuario@dominio.com)";
      todoOk = false;
    } else if (formData.email.length > 100) {
      newErrors.email = "Correo NO debe ser mayor a 100 caracteres";
      todoOk = false;
    } else newErrors.email = "";

    // Password (mínimo 8 para calzar con el backend)
    if (formData.password.length > 8) {
      newErrors.password = "La contraseña debe tener 8 caracteres y un caracter especial como + , -, *, /";
      todoOk = false;
    } else newErrors.password = "";

    // Confirmar contraseña
    if (formData.cPassword !== formData.password) {
      newErrors.cPassword = "La contraseña ingresada no coincide";
      todoOk = false;
    } else newErrors.cPassword = "";

    // Teléfono (9 dígitos)
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio";
      todoOk = false;
    } else if (
      formData.telefono.length < 9 ) {
      newErrors.telefono = "El teléfono debe tener 9 caracteres";
      todoOk = false;
    } else newErrors.telefono = "";

    // Dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria";
      todoOk = false;
    } else newErrors.direccion = "";

    // Términos
    if (!formData.termCond) {
      newErrors.termCond = "Debes aceptar los términos y condiciones";
      todoOk = false;
    } else newErrors.termCond = "";

    setErrors(newErrors);
    return todoOk;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validar()) return;

    try {
      const response = await fetch("http://localhost:8081/auth/registro", {
        // 🔧 cambia puerto si tu ms_auth_usuarios usa otro
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          rut: formData.rut,
          email: formData.email,
          password: formData.password,
          telefono: formData.telefono,
          direccion: formData.direccion,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        setErrors((prev) => ({
          ...prev,
          backend:
            text ||
            "Error al registrar usuario. Verifica los datos e intenta nuevamente.",
        }));
        return;
      }

      alert("¡Se ha registrado correctamente!");

      // Reset formulario
      setFormData({
        nombre: "",
        apellido: "",
        rut: "",
        email: "",
        password: "",
        cPassword: "",
        telefono: "",
        direccion: "",
        termCond: false,
      });
      setErrors({
        nombre: "",
        apellido: "",
        rut: "",
        email: "",
        password: "",
        cPassword: "",
        telefono: "",
        direccion: "",
        termCond: "",
        backend: "",
      });

      // Enviar al login
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        backend: "Error de conexión con el servidor de usuarios.",
      }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-illustration auth-illustration--registro" aria-hidden>
        <img
          className="login-img"
          src="/img/login.png"
          alt="Regístrate"
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            img.style.display = 'none';
            const parent = img.parentElement;
            if (parent) parent.classList.add('no-img');
          }}
        />
      </div>
      <div className="auth-card">
        <h2>Crear cuenta</h2>

        {errors.backend && (
          <p className="mensajeError text-center">{errors.backend}</p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-input">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <div className="mensajeError">{errors.nombre}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              placeholder="Apellido"
            />
            {errors.apellido && (
              <div className="mensajeError">{errors.apellido}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="rut">RUT</label>
            <input
              id="rut"
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
              placeholder="Ej: 12345678K"
            />
            {errors.rut && <div className="mensajeError">{errors.rut}</div>}
          </div>

          <div className="form-input">
            <label htmlFor="email">Correo</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Correo"
            />
            {errors.email && (
              <div className="mensajeError">{errors.email}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="Teléfono"
              inputMode="numeric"
            />
            {errors.telefono && (
              <div className="mensajeError">{errors.telefono}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              placeholder="Dirección"
            />
            {errors.direccion && (
              <div className="mensajeError">{errors.direccion}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Contraseña"
            />
            {errors.password && (
              <div className="mensajeError">{errors.password}</div>
            )}
          </div>

          <div className="form-input">
            <label htmlFor="cPassword">Confirmar contraseña</label>
            <input
              id="cPassword"
              type="password"
              name="cPassword"
              value={formData.cPassword}
              onChange={handleInputChange}
              placeholder="Confirmar contraseña"
            />
            {errors.cPassword && (
              <div className="mensajeError">{errors.cPassword}</div>
            )}
          </div>

          <div className="form-input termCond">
            <input
              id="termCond"
              type="checkbox"
              name="termCond"
              checked={formData.termCond}
              onChange={handleInputChange}
            />
            <label htmlFor="termCond">
              Acepto los términos y condiciones
            </label>
            {errors.termCond && (
              <div className="mensajeError">{errors.termCond}</div>
            )}
          </div>

          <div className="form-actions d-flex">
            <button type="submit" className="auth-btn">
              Registrarse
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => window.history.back()}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterIn;
