import React, { useEffect } from "react";
import "../styles/notificacion.css";

interface NotificacionProps {
    mensaje: string;
    onClose: () => void;
}

const Notificacion: React.FC<NotificacionProps> = ({ mensaje, onClose }) => {
    useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
    }, [onClose]);

    return (
    <div className="notificacion fade-in-up">
        <span>🛍️ {mensaje}</span>
    </div>
    );
};

export default Notificacion;
