import React, { createContext, useContext, useState, useEffect } from "react";

interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  tags: string[];
  precio: number;
  cantidad: number;
}

interface CarritoContextType {
  carrito: Producto[];
  agregarAlCarrito: (producto: Producto) => void;
  eliminarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
  actualizarCantidad: (id: number, nuevaCantidad: number) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<Producto[]>([]);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const data = localStorage.getItem("carritoTechHive");
    if (data) setCarrito(JSON.parse(data));
  }, []);

  // Guardar carrito cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carritoTechHive", JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      const cantidadAAgregar = producto.cantidad || 1;
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidadAAgregar } : p
        );
      }
      return [...prev, { ...producto, cantidad: cantidadAAgregar }];
    });
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, nuevaCantidad) } : p
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);
  if (!context) throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return context;
};
