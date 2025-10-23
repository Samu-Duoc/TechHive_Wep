import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

{/*Propiedad y función para recibir de un logín exitoso*/}
interface LoginProps {
    onLoginSuccess: () => void;
}

{/*Componente Princpal Login, el cual recibe el onLoginSuccess*/}
const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados para manejar errores de validación
    const [errors, setErrors] = useState<{email?: string; password?: string; login?: string}>({});
    const navigate = useNavigate(); // Trae la función de React Router que permite redireccionar a otra ruta sin recargar la página.

    // Función interna para verificar(
    const validate  = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
        newErrors.email = "El correo es obligatorio";
    }else if(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        newErrors.email = "formato o correo inválido";
    }

    if (!password) {//Comprueba si la variable email está vacía (""), Cadena vacía "",null,undefined
        newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 4) {//Si la contraseña no está vacía, pero su longitud es menor a 4 caracteres, entra en este bloque.
        newErrors.password = "La contraseña debe tener al menos 4 caracteres";
    }

    setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) =>  {
        e.preventDefault();

        if (!validate()) return; // Para si hay errores

          // validación de credenciales de prueba
    if (email === "demo@gmail.com" && password === "1234") {
        localStorage.setItem("isLoggedIn", "true");//Guarda en el localStorage del navegador que el usuario está logueado.
        setErrors({});// limpia

        //Llama a la función que viene de App.tsx para actualizar el estado global isLoggedIn y mostrar “Cerrar sesión” en la navbar.
        if (onLoginSuccess) onLoginSuccess();
      navigate("/"); // redirige al Home
    } else {
        setErrors({ login: "Correo o contraseña incorrectos" }); // Si las credenciales no coinciden, asigna un error general de login.
        }
    }; // Find del componente principal Login
    

    // Renderizado
    return(
        <div className="main-content d-flex justify-content-center align-items-center" style={{minHeight: "80vh"}}> {/*Contenedor principal centrado vertical y horizontalmente*/}
            <div className="login-container p-4 bg-light rounded shadow" style={{ width: "100%", maxWidth: "400px" }}> {/* Contenedor del formulario de login*/}
                <h2 className="mb-4 text-center">Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="login-form"> {/*handleSubmit al enviar el formulario*/}

                    <div className="mb-3"> {/*Contenedor del email*/}
                        <label htmlFor="email" className="form-label  fw-bold"> Email</label> {/*Etiqueta del email*/}
                        <input
                            type="email"
                            id="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado email al cambiar el input
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                {/*Contenedor de la contraseña*/}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className={'form-control ${errors.password ? "is-invalid" : ""}'} // Si hay error, agrega clase is-invalid
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado password al cambiar el input
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>
                {errors.login && <p className="text-danger text-center">{errors.login}</p>}

                <button type="submit" className="btn btn-primary w-100 mt-2">Ingresar</button>
            </form>
        </div>
    </div>
    );
};

export default Login;


