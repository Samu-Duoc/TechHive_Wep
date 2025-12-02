import React, { useState } from "react";
import axios from "axios";

const ContactoBuscar: React.FC = () => {
    const [id, setId] = useState("");
    const [contacto, setContacto] = useState<any>(null);
    const [error, setError] = useState("");

    const buscarContacto = async () => {
        setError("");
        setContacto(null);

        if (!id.toString().trim()) {
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
        <div>
            <div className="contacto-buscar-inline">
                <input
                    type="number"
                    className="form-control"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Buscar ID"
                    aria-label="Buscar contacto por ID"
                />
                <button className="btn btn-outline-primary" onClick={buscarContacto}>Buscar</button>
            </div>

            {error && <div className="text-danger small mt-2">{error}</div>}

            {contacto && (
                <div className="mt-2 p-2 rounded shadow-sm border bg-white">
                    <div className="fw-bold small mb-1">Resultado</div>
                    <div className="small"><strong>ID:</strong> {contacto.id}</div>
                    <div className="small"><strong>Nombre:</strong> {contacto.nombre}</div>
                    <div className="small"><strong>Email:</strong> {contacto.email}</div>
                </div>
            )}
        </div>
    );
};

export default ContactoBuscar;