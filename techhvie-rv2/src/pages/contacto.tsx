import React, { useState, type FormEvent } from 'react';
import axios from 'axios';
import '../styles/contacto.css';

const Contacto: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [estadoEnvio, setEstadoEnvio] = useState('');
    const [responseColor, setResponseColor] = useState('');

    const [errores, setErrores] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    // VALIDACIÓN
    const validarFormulario = () => {
        const nuevosErrores = { nombre: "", email: "", mensaje: "" };
        let valido = true;

        if (!nombre.trim() || nombre.trim().length < 3) {
            nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
            valido = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            nuevosErrores.email = "El email es obligatorio.";
            valido = false;
        } else if (!emailRegex.test(email)) {
            nuevosErrores.email = "Formato de email no válido.";
            valido = false;
        }

        if (!mensaje.trim()) {
            nuevosErrores.mensaje = "El mensaje no puede estar vacío."; 
            valido = false;
        } else if (mensaje.trim().length < 5) {
            nuevosErrores.mensaje = "El mensaje debe tener al menos 5 caracteres.";
            valido = false;
        }

        setErrores(nuevosErrores);
        return valido;
    };

    // ENVÍO FORMULARIO
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validarFormulario()) {
            setEstadoEnvio("Corrige los errores antes de enviar.");
            setResponseColor("var(--accent-3)");
            return;
        }

        try {
            const resp = await axios.post("http://localhost:8085/contacto/guardar", {
                nombre,
                email,
                mensaje
            });

            if (resp.status === 200 || resp.status === 201) {
                setEstadoEnvio(`¡Gracias por tu mensaje, ${nombre}!`);
                setResponseColor("var(--accent-1)");

                // limpiar
                setNombre('');
                setEmail('');
                setMensaje('');
                setErrores({ nombre: "", email: "", mensaje: "" });
            }
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            setEstadoEnvio("Error al enviar el mensaje. Inténtalo nuevamente.");
            setResponseColor("var(--accent-3)");
        }
    };

    return (
        <section id="contact" className="contact-section">
            <div className="container">
                <h2>Contacto</h2>
                <p>Escríbenos tus dudas o sugerencias y te responderemos a la brevedad.</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        value={nombre}
                        placeholder="Ingresa tu nombre"
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    {errores.nombre && <div className="mensajeError">{errores.nombre}</div>}

                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="ejemplo@correo.com"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errores.email && <div className="mensajeError">{errores.email}</div>}

                    <label htmlFor="mensaje">Mensaje:</label>
                    <textarea
                        id="mensaje"
                        rows={5}
                        value={mensaje}
                        placeholder="Escribe aquí tu mensaje"
                        onChange={(e) => setMensaje(e.target.value)}
                    />
                    {errores.mensaje && <div className="mensajeError">{errores.mensaje}</div>}

                    <button type="submit" className="btn">Enviar</button>
                </form>

                {estadoEnvio && (
                    <p className="form-response" style={{ color: responseColor }}>
                        {estadoEnvio}
                    </p>
                )}
            </div>
        </section>
    );
};

export default Contacto;
