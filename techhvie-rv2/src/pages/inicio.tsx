import React from "react";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import "../styles/global.css";

const Inicio: React.FC = () => {
    return (
        <main className="inicio-container">
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <h2>Bienvenidos a <span className="techhive-title">TechHive</span>.</h2>
                        <p>Innovación, gadgets y tecnología al alcance de tu colmena 🐝</p>
                                                <Link to="/login">
                                                    <Button
                                                        className="btn-large"
                                                        style={{
                                                            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                                                            color: "#111",
                                                            fontWeight: 800,
                                                            border: "none",
                                                            borderRadius: 12,
                                                            padding: "12px 22px",
                                                            boxShadow: "0 6px 18px rgba(231,182,43,0.18)",
                                                        }}
                                                    >
                                                        Iniciar Sesión
                                                    </Button>
                                                </Link>
                    </div>

                    <div className="hero-art">
                        <img src="/img/LogoP.png" alt="Logo TechHive" className="hero-logo" />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Inicio;

