import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8084";

const Pago: React.FC = () => {
    const { usuario } = useAuth();
    const { carrito, vaciarCarrito, carritoId } = useCarrito();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!usuario) {
            const goLogin = window.confirm("Para pagar necesitas iniciar sesión. ¿Ir a iniciar sesión?");
            if (goLogin) navigate('/login');
            else navigate('/');
        }
    }, [usuario]);
    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Procesar Pago</h1>
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (!usuario) {
                                    alert('Necesitas iniciar sesión para completar el pago.');
                                    return;
                                }

                                if (!carrito || carrito.length === 0) {
                                    alert('Tu carrito está vacío');
                                    return;
                                }

                                setLoading(true);

                                // Construir orden a enviar
                                const items = carrito.map((p) => {
                                    const productoId = p.sku ? String(p.sku) : String(p.id);
                                    const cantidad = p.cantidad;
                                    const subtotal = (p.precio * p.cantidad).toString(); // string for BigDecimal
                                    return { productoId, cantidad, subtotal, precio: p.precio, titulo: p.titulo };
                                });

                                const total = carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);

                                // Enviar tanto 'items' como 'detalles' para cubrir distintos contratos de backend
                                const orderPayload = {
                                    usuarioId: usuario.id,
                                    carritoId: carritoId,
                                    items,
                                    detalles: items,
                                    total,
                                };

                                console.debug('Order payload enviado:', orderPayload);

                                try {
                                    // Intentar crear orden en backend (si existe servicio de órdenes)
                                    const resp = await fetch(`${BASE_URL}/ordenes`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(orderPayload),
                                    });

                                    if (resp.ok) {
                                        const created = await resp.json();
                                        console.debug('Orden creada en backend:', created);
                                        // Guardar comprobante y vaciar carrito
                                        try { localStorage.setItem('ultimoComprobante', JSON.stringify(created)); } catch {}
                                        try { await vaciarCarrito(); } catch {}
                                        // Redirigir con state
                                        window.location.href = '/comprobante';
                                        return;
                                    } else {
                                        let respBody = null;
                                        try { respBody = await resp.json(); } catch { respBody = await resp.text(); }
                                        console.warn('Creación de orden falló en backend, status=', resp.status, 'body=', respBody);
                                    }
                                } catch (err) {
                                    console.error('Error creando orden en backend:', err);
                                }

                                // Fallback local: crear comprobante local y vaciar carrito
                                const fallbackOrder = {
                                    id: `LOCAL-${Date.now()}`,
                                    items,
                                    total,
                                };
                                try { localStorage.setItem('ultimoComprobante', JSON.stringify(fallbackOrder)); } catch {}
                                try { await vaciarCarrito(); } catch {}
                                window.location.href = '/comprobante';
                            }}>
                                <div className="mb-3">
                                    <label htmlFor="cardNumber" className="form-label">Número de Tarjeta</label>
                                    <input type="text" className="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="expiry" className="form-label">Fecha de Vencimiento</label>
                                        <input type="text" className="form-control" id="expiry" placeholder="MM/YY" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="cvv" className="form-label">CVV</label>
                                        <input type="text" className="form-control" id="cvv" placeholder="123" required />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Procesando...' : 'Pagar'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pago;
