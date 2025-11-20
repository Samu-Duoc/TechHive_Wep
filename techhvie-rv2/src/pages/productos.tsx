import React, { useState, useEffect } from "react";
import { useReveal } from "../hooks/useReveal";
import Notificacion from "../components/Notificacion";
import { useCarrito } from "../context/CarritoContext";



{/*Tipo de dato para un producto*/}
interface Producto {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    categoria: string;
    tags: string[];
    precio: number;
    demoUrl: string;
    codeUrl: string;
}


{/* Componente principal de Productos*/}
const Productos: React.FC = () => {
    useReveal();
    const { agregarAlCarrito } = useCarrito();
    const [notificacion, setNotificacion] = useState<string | null>(null);


    {/*Estados*/}
    const [productos] = useState<Producto[]>([
        {
            id: 1,
            titulo: "Asus vivoBook 15",
            descripcion: "Notebook liviano con pantalla Full HD, ideal para estudio y trabajo diario.",
            imagen: "/img/categorias/computadoras/asusVivo15.jpg",
            categoria: "Computadores",
            tags: ["Notebook", "Asus", "Estudio"],
            precio: 499990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 2,
            titulo: "MacBook Air M1",
            descripcion: "Ultraportátil de Apple con chip M1 y batería de larga duración.",
            imagen: "/img/categorias/computadoras/macBook Air M1.jpg",
            categoria: "Computadores",
            tags: ["Apple", "Mac", "Ligero"],
            precio: 899990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 3,
            titulo: "PC Gamer Ryzen 5",
            descripcion: "Computador de escritorio con gran potencia para juegos y multitarea.",
            imagen: "/img/categorias/computadoras/PCRyzen.jpg",
            categoria: "Computadores",
            tags: ["Gaming", "Ryzen", "Desktop"],
            precio: 649990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 4,
            titulo: "Samsung Galaxy S21",
            descripcion: "Smartphone Android con cámara avanzada y rendimiento rápido.",
            imagen: "/img/categorias/smartphones/SamsungGalaxyS21.jpg",
            categoria: "Smartphones",
            tags: ["Samsung", "Android", "Smartphone"],
            precio: 429990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 5,
            titulo: "iPhone 12 Reacondicionado",
            descripcion: "Teléfono Apple reacondicionado con diseño premium y garantía.",
            imagen: "/img/categorias/smartphones/iPhone 12.jpg",
            categoria: "Smartphones",
            tags: ["Apple", "Reacondicionado"],
            precio: 389990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 6,
            titulo: "Cargador Rápido 65W",
            descripcion: "Adaptador de carga rápida compatible con notebooks y smartphones.",
            imagen: "/img/categorias/accesorios/CargadorRapido65W.jpg",
            categoria: "Accesorios",
            tags: ["Cargador", "65W", "USB-C"],
            precio: 24990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 7,
            titulo: "Cable LAN Cat6",
            descripcion: "Cable de red de alta velocidad para conexión estable a internet.",
            imagen: "/img/categorias/accesorios/CableLAN.jpg",
            categoria: "Accesorios",
            tags: ["Cable", "Red", "Internet"],
            precio: 6000,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 8,
            titulo: "Pendrive Kingston 64GB",
            descripcion: "Memoria portátil confiable para almacenar archivos.",
            imagen: "/img/categorias/accesorios/Pendrive Kingston 64GB.jpg",
            categoria: "Accesorios",
            tags: ["USB", "Memoria", "Kingston"],
            precio: 15000,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 9,
            titulo: "PlayStation 4 Slim Reacondionada",
            descripcion: "Consola reacondicionada con garantía y amplio catálogo de juegos.",
            imagen: "/img/categorias/rect/PS4Slim.jpg",
            categoria: "Dispositivos Reacondicionados",
            tags: ["PlayStation", "Reacondicionado", "Gaming"],
            precio: 229990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 10,
            titulo: "Dell Inspiron 3520 Reacondionada",
            descripcion: "Notebook reacondicionado con rendimiento confiable para trabajo y estudio.",
            imagen: "../img/categorias/rect/DellInspiron.jpg",
            categoria: "Dispositivos Reacondicionados",
            tags: ["Dell", "Reacondicionado", "Notebook"],
            precio: 229990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 11,
            titulo: "NVIDIA RTX 4060 MSI",
            descripcion: "Tarjeta gráfica potente para gaming y creación de contenido.",
            imagen: "/img/categorias/componentes/RTX4060.jpg",
            categoria: "Componentes",
            tags: ["NVIDIA", "Gráfica", "Gaming"],
            precio: 379990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 12,
            titulo: "ASUS Prime B550M",
            descripcion: "Placa madre de alta calidad para procesadores AMD Ryzen.",
            imagen: "../img/categorias/componentes/ASUS Prime B550M.jpg",
            categoria: "Componentes",
            tags: ["ASUS", "Motherboard", "PC"],
            precio: 149990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 13,
            titulo: "Steam Deck 512GB",
            descripcion: "Consola portátil para jugar toda tu biblioteca de Steam en cualquier lugar.",
            imagen: "../img/categorias/consolas/SteamDeck.jpg",
            categoria: "Consolas",
            tags: ["Steam", "Portátil", "Gaming"],
            precio: 699990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 14,
            titulo: "Sony WH-1000XM4",
            descripcion: "Audífonos inalámbricos con cancelación de ruido de última generación.",
            imagen: "/img/categorias/audio/SonyWH1000XM4.jpg",
            categoria: "Audio",
            tags: ["Sony", "Audífonos", "Cancelación de ruido"],
            precio: 249990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 15,
            titulo: "Sound BlasterX G6",
            descripcion: "Amplificador de audio DAC/AMP para experiencia de sonido premium.",
            imagen: "/img/categorias/audio/CreativeSoundBlasterXG6.jpg",
            categoria: "Audio",
            tags: ["Creative", "DAC", "Audio"],
            precio: 99990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 22,
            titulo: "Teclado Mecánico Redragon K630",
            descripcion: "Teclado retroiluminado mecanico, perfecto para gaming",
            imagen: "/img/categorias/Perifericos/TecladoMecánicoRedragon.png",
            categoria: "Perifericos",
            tags: ["Teclado", "Mecánico", "Redragon"],
            precio: 179990,
            demoUrl: "#",
            codeUrl: "#"
        },
        {
            id: 23,
            titulo: "Silla Gamer Cougar Armor",
            descripcion: "Silla ergonomica con soporte ajustable para largas sesiones",
            imagen: "../img/categorias/Perifericos/SillaGamerCougarArmor.jpg",
            categoria: "Perifericos",
            tags: ["Silla", "Gamer", "Cougar"],
            precio: 199990,
            demoUrl: "#",
            codeUrl: "#"
        }
    ]);
    
   // Categoría y búsqueda y productos filtrados
    const [categoriaActiva, setCategoriaActiva] = useState<string>("all");
    const [terminoBusqueda, setTerminoBusqueda] = useState<string>("");
    const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});

    //Efectos
    useEffect(() => {
        // Inicializar cantidades
        const cantidadesIniciales = productos.reduce((acc, producto) => {
            acc[producto.id] = 1;
            return acc;
        }, {} as { [key: number]: number });
        setCantidades(cantidadesIniciales);
    }, [productos]);

    //Componente de Handlers (Sirve para cambiar la cantidad de productos)
    const cambiarCantidad = (idProducto: number, cambio: number) => {
        setCantidades(prev => {
            const nuevaCantidad = Math.min(Math.max((prev[idProducto] || 1) + cambio, 1), 10);
            return { ...prev, [idProducto]: nuevaCantidad };
        });
    };

    //Componente de filtrado de productos
    const filtrarProductos = () => {
        return productos
            .filter(producto => {
                if (categoriaActiva === "all") return true;
                return producto.categoria.toLowerCase() === categoriaActiva.toLowerCase();
            })
            .filter(producto =>
                terminoBusqueda === "" ||
                producto.titulo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                producto.tags.some(tag => tag.toLowerCase().includes(terminoBusqueda.toLowerCase()))
            );
    };

    // Obtener productos filtrados
    const productosFiltrados = filtrarProductos();

    
    return (
    <div className="container mt-3">
        <div className="row">
        <div className="col-12">
        <h1 className="text-center mb-4">Nuestros Productos</h1>
        <p className="lead text-center">Descubre nuestra amplia gama de productos tecnológicos</p>
        </div>
    </div>

      {/* Filtros y Búsqueda */}
    <div className="row mb-4">
        <div className="col-md-8">
        <div className="btn-group">

            <button
                className={`btn ${categoriaActiva === "all" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setCategoriaActiva("all")}> Todos
            </button>
            {["Computadores", "Smartphones", "Accesorios", "Audio", "Componentes", "Perifericos"].map(
                (cat) => (
                <button
                    key={cat}
                    className={`btn ${
                    categoriaActiva === cat ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setCategoriaActiva(cat)}
                >
                    {cat}
                </button>
                )
            )}
            </div>
        </div>

        <div className="col-md-4">
            <input
            type="text"
            className="form-control"
            placeholder="Buscar productos..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
        </div>
    </div>

      {/* Grid de Productos */}
    <div className="row mt-4">
        {productosFiltrados.length === 0 ? (
            <div className="col-12 text-center">
            <h3>No se encontraron productos</h3>
            <p>No hay productos disponibles en esta categoría actualmente.</p>
            </div>
        ) : (
            productosFiltrados.map((producto) => (
            <div key={producto.id} className="col-sm-6 col-md-4 mb-4">
                <div className="card h-100 border-0 shadow-sm">
                <div style={{ height: "200px", overflow: "hidden" }}>
                    <img
                    src={producto.imagen}
                    className="card-img-top h-100"
                    style={{ objectFit: "cover" }}
                    alt={producto.titulo}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/img/logo.jpg";
                    }}
                    />
                </div>

                {/* Cuerpo de la tarjeta */}
                <div className="card-body d-flex flex-column">
                    <div className="mb-2">
                    {producto.tags.map((tag) => (
                        <span key={tag} className="badge bg-light text-dark me-1">{tag}</span>
                    ))}
                </div>

                <h5 className="card-title">{producto.titulo}</h5>
                <p className="card-text text-muted">{producto.descripcion}</p>

                <div className="mt-auto">
                    <p className="card-text">
                        <strong>Precio: {producto.precio}</strong>

                        </p>
                    <div className="d-flex align-items-center mb-3">
                    <label className="me-2">Cantidad:</label>
                    <div className="input-group" style={{ maxWidth: "150px" }}>
                        <button
                        className="btn btn-outline-secondary"
                        onClick={() => cambiarCantidad(producto.id, -1)}
                        > - </button>
                        <input
                        type="number"
                        className="form-control text-center"
                        value={cantidades[producto.id] || 1}
                        readOnly
                        />
                        <button
                        className="btn btn-outline-secondary"
                        onClick={() => cambiarCantidad(producto.id, 1)}> + </button>
                    </div>
                    </div>
                    <button
                    className="btn w-100"
                    style={{
                        background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                        color: "black",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(231, 182, 43, 0.3)",
                    }}
                    onClick={() => {
                        const cantidadSel = cantidades[producto.id] || 1;
                        agregarAlCarrito({...producto, cantidad: cantidadSel});
                        setNotificacion(`${producto.titulo} agregado al carrito`);
                        }}> 🛒 Agregar al Carrito </button>
                    </div>
                    </div>
                </div>
            </div>
            ))
        )}
    </div>

      {/* Notificación */}
        {notificacion && (
        <Notificacion mensaje={notificacion} onClose={() => setNotificacion(null)} />
        )}
    </div>
    );
};

export default Productos;