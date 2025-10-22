import React from "react";

const Productos: React.FC = () => {
    return (
        <div className="container mt-5 pt-5">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-center mb-4">Nuestros Productos</h1>
                    <p className="lead text-center">
                        Descubre nuestra amplia gama de productos tecnológicos
                    </p>
                </div>
            </div>
        </div>
    );
};

// Define una interfaz para los productos
interface Productos {
    id: number;
    nombre_producto: string;
    categoria: string;
    precio: number;
    stock: number;
    imagen: string;
}

// Arreglo de productos
const  Productos: React.FC = () => {
    conts [productos, setProductos] = React.useState<Productos[]>([

        // Productos disponibles
        {id: 1, nombre_producto: "Smartphone X1", categoria: "Electrónica", precio: 699, stock: 50, imagen: "smartphone_x1.jpg" },
    ]);

    const [nuevo]
}



export default Productos;
