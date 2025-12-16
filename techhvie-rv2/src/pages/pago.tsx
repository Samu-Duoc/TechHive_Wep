import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import pedidosService from "../services/pedidosService";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "../styles/checkout.css";

const Pago: React.FC = () => {
    const { usuario } = useAuth();
    const { items, total, clear } = useCarrito();
    const navigate = useNavigate();

    const methods = ["MASTERCARD ****5678", "VISA ****1122", "PAYPAL", "TRANSFERENCIA"];
    const [selectedMethod, setSelectedMethod] = useState(methods[0]);
    const [loading, setLoading] = useState(false);

    const totalCalc = useMemo(() => total, [total]);
    const canPay = !!usuario && items.length > 0 && !loading;

    const handlePay = async () => {
        if (!usuario || usuario.id == null) {
        navigate("/login");
        return;
        }
        if (items.length === 0) {
        alert("El carrito está vacío");
        return;
        }

        try {
        setLoading(true);

        const payload = {
            usuarioId: usuario.id,
            direccionId: "1",                 // igual que tu app (puedes ajustar después) :contentReference[oaicite:8]{index=8}
            metodoPago: selectedMethod,
            total: Number(totalCalc),
            items: items.map((it) => ({
            productoId: Number(it.productoId),
            nombreProducto: it.nombre,
            cantidad: Number(it.cantidad),
            precioUnitario: Number(it.precio),
            })),
        };

        const comprobante = await pedidosService.pagar(payload);

        // Guardamos el comprobante (como ReceiptManager/TicketScreen) :contentReference[oaicite:9]{index=9}
        localStorage.setItem("th_last_receipt", JSON.stringify(comprobante));

        // Limpia carrito local (como Cart.clearCart()) :contentReference[oaicite:10]{index=10} :contentReference[oaicite:11]{index=11}
        clear();

        navigate("/ticket");
        } catch (e: any) {
        console.error(e);
        const msg = e?.response?.data?.message || e?.message || "Error al pagar";
        alert(msg);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="checkout-bg">
        <div className="checkout-shell">
            <div className="checkout-steps">
            <div className="step"><div className="step-dot">1</div> Carrito</div>
            <div className="step-line" />
            <div className="step"><div className="step-dot">2</div> Datos y pago</div>
            <div className="step-line" />
            <div className="step is-active"><div className="step-dot">3</div> Resumen</div>
            <div className="step-line" />
            <div className="step"><div className="step-dot">4</div> Listo</div>
            </div>

            <div className="checkout-grid">
            {/* LEFT */}
            <div className="d-flex flex-column gap-3">
                <div className="section-card">
                <div className="section-head">
                    <div className="section-title">Detalles de la orden</div>
                </div>

                <div className="order-items">
                    {items.map((p) => (
                    <div className="order-item" key={p.productoId}>
                        <div>
                        <div className="order-item-name">{p.nombre}</div>
                        <div className="order-item-sub">{p.cantidad} pc</div>
                        </div>
                        <div className="order-item-price">
                        ${Number(p.precio * p.cantidad).toFixed(0)}
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                <div className="section-card">
                <div className="section-head">
                    <div className="section-title">Método de pago</div>
                </div>

                <div className="pay-card">
                    <div className="pay-card-title">Tarjetas registradas</div>

                    <div className="card-chips">
                    {methods.map((m) => (
                        <button
                        key={m}
                        type="button"
                        className={`card-chip ${m === selectedMethod ? "is-selected" : ""}`}
                        onClick={() => setSelectedMethod(m)}
                        >
                        <div className="card-chip-top">
                            <div className="card-brand">{m.split(" ")[0]}</div>
                            <div className="card-last4">{m.includes("****") ? m.split("****")[1] : "—"}</div>
                        </div>
                        <div className="card-chip-sub">{m}</div>
                        </button>
                    ))}
                    </div>
                </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="summary">
                <div className="summary-head">
                <div className="summary-title">Total</div>
                <div className="summary-total">${Number(totalCalc).toFixed(0)}</div>
                </div>

                <div className="summary-lines">
                <div className="summary-line"><span>Subtotal</span><strong>${Number(totalCalc).toFixed(0)}</strong></div>
                </div>

                <button className="pay-btn" onClick={handlePay} disabled={!canPay}>
                {loading ? "Procesando..." : `Pagar $${Number(totalCalc).toFixed(0)}`}
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default Pago;
