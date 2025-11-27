import React, { useEffect, useRef, useState } from "react";
import "../styles/notificacion.css";

interface NotificacionProps {
    mensaje: string;
    onClose: () => void;
    actionLabel?: string;
    onAction?: () => void;
    duration?: number; // ms
}

const Notificacion: React.FC<NotificacionProps> = ({ mensaje, onClose, actionLabel, onAction, duration = 5000 }) => {
    const [hover, setHover] = useState(false);
    const remaining = useRef(duration);
    const start = useRef<number | null>(null);

    useEffect(() => {
        let timeout: any;
        if (!hover) {
            start.current = Date.now();
            timeout = setTimeout(onClose, remaining.current);
        }

        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [hover, onClose]);

    const handleMouseEnter = () => {
        setHover(true);
        if (start.current) {
            const elapsed = Date.now() - start.current;
            remaining.current = Math.max(0, remaining.current - elapsed);
        }
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    return (
        <div className="notificacion fade-in-up" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className="notificacion-content">
                <div className="notificacion-icon">🛍️</div>
                <div className="notificacion-body">
                    <div className="notificacion-message">{mensaje}</div>
                    <div className="notificacion-actions">
                        {actionLabel && onAction && (
                            <button
                                className="notificacion-action btn btn-sm"
                                onClick={() => {
                                    try {
                                        onAction();
                                    } finally {
                                        onClose();
                                    }
                                }}
                            >
                                {actionLabel}
                            </button>
                        )}
                    </div>
                </div>
                <button className="notificacion-close" aria-label="Cerrar" onClick={onClose}>×</button>
            </div>
        </div>
    );
};

export default Notificacion;
