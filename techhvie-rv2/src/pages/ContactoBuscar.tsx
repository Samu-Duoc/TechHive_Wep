import React, { useState } from "react";
import axios from "axios";

const ContactoBuscar: React.FC = () => {
    const [id, setId] = useState("");
    const [contacto, setContacto] = useState<any>(null);
    const [error, setError] = useState("");

    const buscarContacto = async () => {
        setError("");
        setContacto(null);

        if (!id.trim()) {
        setError("Ingresa un ID válido.");
        return;
        }

        try {
        const resp = await axios.get(`http://localhost:8085/contacto/${id}`);
        setContacto(resp.data);
        } catch (e) {
        setError("No se encontró el contacto.");
        }
    };

    return (
        <div className="container my-5">

        {/* Tarjeta principal */}
        <div className="p-4 rounded shadow-sm" style={{ background: "#f8f9fa", color: "#000" }}>
            <h2 className="fw-bold mb-4 text-primary" style={{ fontSize: "32px" }}>
            Buscar Contacto
            </h2>

            {/* Input + botón */}
            <div className="d-flex align-items-center mb-3" style={{ gap: "12px" }}>
            <input
                type="number"
                className="form-control form-control-lg"
                style={{ maxWidth: "250px" }}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Ingrese ID"
            />

            <button className="btn btn-primary btn-lg" onClick={buscarContacto}>
                Buscar
            </button>
            </div>

            {/* Error */}
            {error && <p className="text-danger fw-bold mt-2">{error}</p>}

            {/* Tarjeta del resultado */}
            {contacto && (
            <div className="mt-4 p-4 rounded shadow-sm border" style={{ background: "#ffffff", color: "#000" }}>
                <h4 className="fw-bold mb-3 text-secondary">Resultado:</h4>

                <p style={{ fontSize: "18px" }}><strong>ID:</strong> {contacto.id}</p>
                <p style={{ fontSize: "18px" }}><strong>Nombre:</strong> {contacto.nombre}</p>
                <p style={{ fontSize: "18px" }}><strong>Email:</strong> {contacto.email}</p>
                <p style={{ fontSize: "18px" }}><strong>Mensaje:</strong> {contacto.mensaje}</p>
            </div>
            )}
        </div>
        </div>
    );
};

export default ContactoBuscar;