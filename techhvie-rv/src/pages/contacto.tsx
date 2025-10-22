import React, { useState } from "react";

// Declara un componente funcional llamado Contacto, significa React Functional Component, y le dice a TypeScript que Home es un componente de React.
const Contacto: React.FC = () => {
const [nombre, setNombre] = useState("");
const [email, setEmail] = useState("");
const [mensaje, setMensaje] = useState("");

// Función que maneja el envío del formulario, evita que la página se recargue y procesa los datos ingresados
const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Gracias ${nombre}, tu mensaje ha sido enviado!`);
    setNombre("");
    setEmail("");
    setMensaje("");
};

return (
    <div className="main-content">
        <h1 className="text-white fw-bold display-5 mb-3">Contacto 📬</h1>
            <p className="lead text-white mb-4"> Completa el formulario y nos pondremos en contacto contigo.</p>
        <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "500px" }}>

        <div className="mb-3">
            <label htmlFor="nombre" className="form-label text-white"> Nombre</label>

        <input
            type="text"
            id="nombre"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)} // evento que captura la informacion
            required
        />
        </div>
        <div className="mb-3">
        <label htmlFor="email" className="form-label text-white"> Email </label>

        <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
        />

        </div>
        <div className="mb-3">
            <label htmlFor="mensaje" className="form-label text-white"> Mensaje </label>

            <textarea
            id="mensaje"
            className="form-control"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
            rows={4}
            ></textarea>

        </div>
        <button type="submit" className="btn btn-light w-100"> Enviar </button>
        </form>
    </div>
    );
};

export default Contacto;