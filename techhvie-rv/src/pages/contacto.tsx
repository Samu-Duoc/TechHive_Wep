import React, { useState, type FormEvent } from 'react';
import '../styles/contacto.css';

// Compoenete para realizar  una conuslta o enviar un mensaje
const Contacto: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [responseColor, setResponseColor] = useState('');

    // COMPO DE ERRORES 
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Manejar el envío del formulario
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const n = name.trim();
        const em = email.trim();
        const msg = message.trim();

        const newErrors = { name: '', email: '', message: '' };
        let valid = true;

        if (n.length < 3 || n.length > 50) {
            newErrors.name = 'El nombre debe tener entre 3 y 50 caracteres';
            valid = false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
            newErrors.email = 'Ingresa un correo válido (usuario@dominio.com)';
            valid = false;
        }

        if (msg.length < 5) {
            newErrors.message = 'El mensaje debe tener al menos 5 caracteres';
            valid = false;
        }

        setErrors(newErrors);

        // Componente de respuesta
        if (valid) {
            setResponse(`¡Gracias por tu mensaje, ${n}! Lo hemos recibido correctamente.`);
            setResponseColor('var(--accent-1)');
            setName('');
            setEmail('');
            setMessage('');
            setErrors({ name: '', email: '', message: '' });
        } else {
            setResponse('');
            setResponseColor('var(--accent-3)');
        }
    };

    // Retorno de el componente
    return (
        <section id="contact" className="contact-section">
            <div className="container">
            <h2>Contacto</h2>
            <p>Escríbenos tus dudas o sugerencias y te responderemos a la brevedad.</p>
            <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ingresa tu nombre"
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                    {errors.name && <div className="mensajeError">{errors.name}</div>}

                    <label htmlFor="email">Correo electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    {errors.email && <div className="mensajeError">{errors.email}</div>}

                    <label htmlFor="message">Opinión o consulta:</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Escribe aquí tu mensaje"
                        value={message}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    />
                    {errors.message && <div className="mensajeError">{errors.message}</div>}

                    <button type="submit" className="btn">Enviar</button>
                </form>
                <p id="form-response" className="form-response" style={{ color: responseColor }}>
                    {response}
                </p>
          </div>
        </section>
    );
}

export default Contacto;
