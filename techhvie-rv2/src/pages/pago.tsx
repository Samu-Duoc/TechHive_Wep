import React from "react";

const Pago: React.FC = () => {
    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Procesar Pago</h1>
                    <div className="card">
                        <div className="card-body">
                            <form>
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
                                <button type="submit" className="btn btn-primary w-100">Pagar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pago;
