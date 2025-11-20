import React from "react";
import "../styles/global.css";

const Inicio: React.FC = () => {
    return (
        <main className="inicio-container">
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <h2>Bienvenidos a <span className="techhive-title">TechHive</span>.</h2>
                        <p>Innovación, gadgets y tecnología al alcance de tu colmena 🐝</p>
                        <a href="/productos" className="btn large">Ver Productos</a>
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

