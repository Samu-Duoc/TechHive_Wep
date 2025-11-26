import React, {createContext,useContext,useEffect,useState} from "react";
import axios from "axios";


//Conexción con ms carrito
const CARRITO_API = "http://localhost:8083/carrito";
export interface ProductoCarrito {
  id: number;       // ID local del front
  titulo: string;
  descripcion: string;
  imagen: string;
  categoria: string;
  tags: string[];
  precio: number;
  cantidad: number;
  sku?: string;     // EL SKU viaja como productoId real al backend
}

interface CarritoContextType {
  carrito: ProductoCarrito[];
  agregarAlCarrito: (producto: ProductoCarrito) => void;
  eliminarDelCarrito: (id: number) => void;
  vaciarCarrito: () => void;
  actualizarCantidad: (id: number, nuevaCantidad: number) => void;
}

interface UsuarioLS {
  id: number;
  nombre: string;
  email: string;
  rol: "ADMIN" | "VENDEDOR" | "CLIENTE";
}


// HELPER — OBTENER USUARIO LOGUEADO
const obtenerUsuarioActual = (): UsuarioLS | null => {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? (JSON.parse(raw) as UsuarioLS) : null;
  } catch {
    return null;
  }
};

// CONTEXTO DEL CARRITO
const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [carritoId, setCarritoId] = useState<number | null>(null);

  
  // Cargar desde localStorage
  useEffect(() => {
    const data = localStorage.getItem("carritoTechHive");
    const id = localStorage.getItem("carritoTechHiveId");

    if (data) {
      try {
        setCarrito(JSON.parse(data));
      } catch {
        setCarrito([]);
      }
    }

    if (id) {
      const parsed = Number(id);
      if (!Number.isNaN(parsed)) setCarritoId(parsed);
    }
  }, []);

  // Guardar al cambiar
  useEffect(() => {
    localStorage.setItem("carritoTechHive", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (carritoId !== null) {
      localStorage.setItem("carritoTechHiveId", String(carritoId));
    }
  }, [carritoId]);

  //Asegurar carrito en el backend
  const asegurarCarritoEnBackend = async (
    usuarioId: number
  ): Promise<number | null> => {
    try {
      // Si ya existe un ID en memoria → reutilizar
      if (carritoId !== null) return carritoId;

      // Intentar obtener carrito existente por usuario
      try {
        const resp = await axios.get(`${CARRITO_API}/usuario/${usuarioId}`);
        if (resp.data?.id) {
          setCarritoId(resp.data.id);
          return resp.data.id;
        }
      } catch {
        // 404, crear nuevo
      }

      // Crear carrito
      const nuevo = await axios.post(CARRITO_API, { usuarioId });
      if (nuevo.data?.id) {
        setCarritoId(nuevo.data.id);
        return nuevo.data.id;
      }
      return null;
    } catch (e) {
      console.error("Error creando/obteniendo carrito:", e);
      return null;
    }
  };

  //Sincronizar ítem al backend
  const syncAgregarItemBackend = async (producto: ProductoCarrito) => {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return; // sin login → modo solo front

    const id = await asegurarCarritoEnBackend(usuario.id);
    if (!id) return;

    try {
      const productoId = producto.sku ?? String(producto.id);
      const subtotal = producto.precio * producto.cantidad;

      await axios.post(`${CARRITO_API}/${id}/items`, {
        productoId,
        cantidad: producto.cantidad,
        subtotal,
      });
    } catch (error) {
      console.error("Error al agregar ítem al backend:", error);
    }
  };


  //ACCIONES DEL CARRITO

  const agregarAlCarrito = (producto: ProductoCarrito) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      }
      return [...prev, producto];
    });

    // sincronizar sin bloquear la UI
    void syncAgregarItemBackend(producto);
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = (): CarritoContextType => {
  const context = useContext(CarritoContext);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return context;
};

export default CarritoContext;