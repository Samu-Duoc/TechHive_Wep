import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/productos.css';
import { useCarrito } from '../context/CarritoContext';

type Orden = {
    id: string;
    items: Array<{
    id: number;
    titulo: string;
    cantidad: number;
    precio: number | string;
    }>;
    total: number;
};

const Comprobante: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
        const { vaciarCarrito } = useCarrito();

  // Intentar leer el pedido desde location.state primero, si no, desde localStorage
    const orderFromState = (location.state as any)?.order as Orden | undefined;
    const orderFromStorage = (() => {
    try {
        const raw = localStorage.getItem('ultimoComprobante');
        return raw ? (JSON.parse(raw) as Orden) : undefined;
    } catch {
        return undefined;
    }
    })();

    const order = orderFromState || orderFromStorage;

    if (!order) {
    return (
    <div className="container py-6">
        <h2>Comprobante</h2>
        <p>No se encontró un pedido reciente.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
    );
    }

    return (
    <div className="container py-6">
        <h2 className="mb-3">Comprobante de compra</h2>
        <p>Orden <strong>#{order.id}</strong></p>

        <div className="card p-3 mb-3">
        {order.items.map((it) => (
            <div key={it.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
            <div>
                <strong>{it.titulo}</strong>
                <div className="text-muted">Cantidad: {it.cantidad}</div>
                </div>
            <div>
                ${typeof it.precio === 'number' ? it.precio.toLocaleString('es-CL') : String(it.precio)}
            </div>
        </div>
        ))}
        <div className="d-flex justify-content-between align-items-center pt-3">
            <strong>Total:</strong>
            <h4>${order.total.toLocaleString('es-CL')}</h4>
        </div>
        </div>

        <div className="mb-4">
        <p>Gracias por tu compra. Te hemos enviado un correo (simulado) con los detalles. Puedes descargar o imprimir este comprobante.</p>
        </div>

        <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={() => navigate('/')}>Seguir comprando</button>
                    <button className="btn btn-primary" onClick={() => window.print()}>Imprimir comprobante</button>
                            <button
                                className="btn btn-success"
                                onClick={async () => {
                                    // Finalizar compra: vaciar carrito, borrar comprobante y volver al inicio
                                    try {
                                        await vaciarCarrito();
                                    } catch (e) {
                                        console.warn('No se pudo vaciar carrito vía contexto', e);
                                    }
                                    try {
                                        localStorage.removeItem('ultimoComprobante');
                                    } catch {}
                                    // mostrar mensaje y redirigir
                                    try {
                                        alert('Compra finalizada. ¡Gracias por tu compra!');
                                    } catch {}
                                    navigate('/');
                                }}
                            >
                                Finalizar compra
                            </button>
        </div>
    </div>
    );
};

export default Comprobante;
