import React, { useState } from "react";
import axios from "axios";

// Definimos la estructura de un contacto
interface Contacto {
    id: number;
    nombre: string;
    email: string;
    mensaje: string;
    }

    const ContactoLista: React.FC = () => {
    // Estado para guardar los contactos obtenidos del backend
    const [contactos, setContactos] = useState<Contacto[]>([]);
    
    // Estado para manejar si la carga está en proceso
    const [cargando, setCargando] = useState(false);
    
    // Estado para manejar posibles errores al obtener los datos
    const [error, setError] = useState("");

    // Función que se ejecuta al presionar el botón "Listar Contactos"
    const cargarContactos = async () => {
        setCargando(true); // activamos el spinner / texto de carga
        setError("");      // limpiamos errores previos

        try {
        // Hacemos la petición GET al backend para obtener los contactos
        const response = await axios.get("http://localhost:8085/contacto/listar");
        setContactos(response.data); // guardamos los contactos en el estado
        } catch (err) {
        // En caso de error, actualizamos el estado para mostrar el mensaje
        setError("No se pudo obtener la lista de contactos.");
        } finally {
        // Siempre se ejecuta al final para indicar que ya terminó la carga
        setCargando(false);
        }
    };

    return (
        <div className="main-content p-4">
        {/* Título de la sección */}
        <h1 className="text-white fw-bold display-5 mb-4">Mensajes Recibidos</h1>

        {/* Botón que ejecuta la carga de contactos */}
        <button 
            className="btn btn-primary mb-3" 
            onClick={cargarContactos}
            disabled={cargando} // deshabilitado mientras carga
        >
            {cargando ? "Cargando..." : "Listar Contactos"}
        </button>

        {/* Mostramos mensaje de error si existe */}
        {error && <p className="text-danger">{error}</p>}

        {/* Si hay contactos, mostramos la tabla */}
        {contactos.length > 0 ? (
            <div className="table-responsive shadow-sm rounded">
            <table className="table table-striped table-hover text-center align-middle mb-0">
                <thead className="table-primary text-white">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Mensaje</th>
                </tr>
                </thead>
                <tbody>
                {/* Iteramos sobre cada contacto y mostramos sus datos en la fila */}
                {contactos.map((c) => (
                    <tr key={c.id} className="table-light">
                    <td>{c.id}</td>
                    <td>{c.nombre}</td>
                    <td>{c.email}</td>
                    <td>{c.mensaje}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        ) : !cargando ? (
            // Si no hay contactos y no se está cargando, mostramos mensaje vacío
            <p className="text-white mt-3">No hay mensajes registrados.</p>
        ) : null}
        </div>
    );
};

export default ContactoLista;