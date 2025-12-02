import React, { useState } from "react";
import axios from "axios";

type Props = {
    onSearch?: (id: string) => void;
};

const ContactoBuscar: React.FC<Props> = ({ onSearch }) => {
    const [id, setId] = useState("");
    const [error, setError] = useState("");

    const buscar = () => {
        setError("");
        if (!id.toString().trim()) {
            // empty -> clear search
            onSearch?.("");
            setError("Ingresa un ID válido.");
            return;
        }
        onSearch?.(id.toString().trim());
    };

    return (
        <div>
            <div className="contacto-buscar-inline">
                <input
                    type="text"
                    className="form-control"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') buscar(); }}
                    placeholder="Buscar ID"
                    aria-label="Buscar contacto por ID"
                />
                <button className="btn btn-outline-primary" onClick={buscar}>Buscar</button>
            </div>

            {error && <div className="text-danger small mt-2">{error}</div>}
        </div>
    );
};

export default ContactoBuscar;