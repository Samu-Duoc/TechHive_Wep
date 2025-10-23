import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Definición de las props del componente Register
interface RegisterProps {
  onRegisterSuccess?: () => void;
}

// Componentess de registro de usuario
const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [nameUser, setNameUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validacionEdad, setValidacionEdad] = useState(false);

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState<{
    nameUser?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    edad?: string;
    register?: string;
  }>({});

  // Navegación entre rutas
  const navigate = useNavigate();

  // Función de validación del formulario
  const validate = (): boolean => {
    const newErrors: {
      nameUser?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      edad?: string;
    } = {};

    // Validaciones de todos los campos del registro
    if (!nameUser) {
      newErrors.nameUser = "El nombre de usuario es obligatorio";
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (!validacionEdad) {
      newErrors.edad = "Debes ser mayor de edad para registrarte";
    }

    // Actualizar el estado de errores
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    //Manejo del envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (email === "demo@gmail.com" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      setErrors({});
      if (onRegisterSuccess) onRegisterSuccess();
      navigate("/");
    } else {
      setErrors({ register: "Correo o contraseña incorrectos" });
    }
  };

  //Renderizado del formulario de registro
  return (
    <div className="main-content d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="register-container p-4 bg-light rounded shadow" style={{ width: "100%", maxWidth: "400px" }}> // contenedor del formulario
        <h2 className="text-center mb-4 text-primary">Registro de Usuario</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="mb-3">
            <label htmlFor="nameUser" className="form-label fw-bold">Nombre de Usuario</label>
            <input
              type="text"
              id="nameUser"
              className={`form-control ${errors.nameUser ? "is-invalid" : ""}`}
              value={nameUser}
              onChange={(e) => setNameUser(e.target.value)}
            />
            // error display
            {errors.nameUser && <div className="invalid-feedback">{errors.nameUser}</div>}
          </div>

          //Bloque para el email
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          //Bloque para la contraseña
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              id="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          //Bloque de confirma la contraseña
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-bold">Confirmar Contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>

          // Bloqur de validación de edad +18
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              id="validacionEdad"
              className={`form-check-input ${errors.edad ? "is-invalid" : ""}`}
              checked={validacionEdad}
              onChange={(e) => setValidacionEdad(e.target.checked)}
            />
            <label htmlFor="validacionEdad" className="form-check-label">Soy mayor de edad</label>
            {errors.edad && <div className="invalid-feedback d-block">{errors.edad}</div>}
          </div>

          {errors.register && <p className="text-danger text-center">{errors.register}</p>}

          <button type="submit" className="btn btn-primary w-100 mt-2">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Register;




