import React, { createContext, useContext, useEffect, useState } from "react";
import carritoService from "../services/carritoService";
import type { AddItemPayload } from "../services/carritoService";
import { useAuth } from "../context/AuthContext";

export interface ProductoCarrito {
  id: number; // id local del frontend (no necesariamente el productoId del backend)
  titulo: string;
  descripcion?: string;
  imagen?: string;
  categoria?: string;
  tags?: string[];
  precio: number; // monto entero (ej. 90000)
  cantidad: number;
  sku?: string; // si existe, será enviado como productoId; si no, se enviará id como string
}

interface CarritoContextType {
  carrito: ProductoCarrito[];
  agregarAlCarrito: (producto: ProductoCarrito) => Promise<void>;
  eliminarDelCarrito: (id: number) => Promise<void>;
  vaciarCarrito: () => Promise<void>;
  actualizarCantidad: (id: number, nuevaCantidad: number) => Promise<void>;
  carritoId: number | null;
}

// NOTE: preferir usar `useAuth()` para obtener el usuario reactivo en componentes.

// --- CONTEXTO ---
const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [carritoId, setCarritoId] = useState<number | null>(() => {
    const id = localStorage.getItem("carritoTechHiveId");
    return id ? Number(id) : null;
  });
  const auth = (() => {
    try {
      return useAuth();
    } catch {
      return null as any;
    }
  })();

  // Inicializar desde localStorage
  useEffect(() => {
    const raw = localStorage.getItem("carritoTechHive");
    if (raw) {
      try {
        setCarrito(JSON.parse(raw));
      } catch {
        setCarrito([]);
      }
    }
  }, []);

  // Persistir carrito localmente
  useEffect(() => {
    localStorage.setItem("carritoTechHive", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (carritoId !== null) localStorage.setItem("carritoTechHiveId", String(carritoId));
  }, [carritoId]);

  // Asegurar carrito en backend: devuelve carritoId o null
  // Asegurar carrito en backend: devuelve carritoId o null
  const asegurarCarritoEnBackend = async (usuarioId: number): Promise<number | null> => {
    try {
      // 1) Intentar SIEMPRE obtener carrito por usuario
      try {
        const resp = await carritoService.getCartByUser(usuarioId);
        if (resp?.id) {
          setCarritoId(resp.id);
          return resp.id;
        }
      } catch (err) {
        // Si el backend responde error (no tiene carrito, 404 o 500), seguimos y lo creamos
        console.warn("No se encontró carrito para el usuario, se creará uno nuevo.", err);
      }

      // 2) Crear carrito si no existe
      const crear = await carritoService.createCart(usuarioId);
      if (crear?.id) {
        setCarritoId(crear.id);
        return crear.id;
      }

      console.error("Respuesta inesperada al crear carrito:", crear);
      return null;
    } catch (e) {
      console.error("Error asegurando carrito en backend:", e);
      return null;
    }
  };


  // Sincronizar agregado item al backend
  const syncAgregarItemBackend = async (producto: ProductoCarrito) => {
    const usuario = auth?.usuario ?? null;
    if (!usuario) {
      // Modo offline / sin login: no sincronizar
      return;
    }

    const id = await asegurarCarritoEnBackend(usuario.id);
    if (!id) {
      console.error("No se pudo obtener/crear carrito en backend; item no sincronizado.");
      return;
    }

    try {
      const productoId = producto.sku ? String(producto.sku) : String(producto.id);
      const subtotal = (producto.precio * producto.cantidad).toString(); // enviar como string para BigDecimal
      const payload: AddItemPayload = { productoId, cantidad: producto.cantidad, subtotal };
      console.debug("addItem -> carritoId=", id, "payload=", payload);
      await carritoService.addItem(id, payload);
    } catch (err) {
      console.error("Error al agregar ítem al backend:", err);
      const status = (err as any)?.response?.status;
      const data = (err as any)?.response?.data;
      console.debug("addItem error status=", status, "responseData=", data);

      // Si el backend dice que el carrito no existe, intentamos recrearlo y reintentar una vez
      const msg = (data && (data.message || data.error)) || (err as any)?.message || '';
      if (status === 404 || String(msg).toLowerCase().includes("carrito no encontrado")) {
        console.info("addItem: carrito no encontrado en backend, intentando crear y reintentar...");
        try {
          const nuevoId = await asegurarCarritoEnBackend(usuario.id);
          if (nuevoId) {
            setCarritoId(nuevoId);
            const productoId2 = producto.sku ? String(producto.sku) : String(producto.id);
            const subtotal2 = (producto.precio * producto.cantidad).toString();
            const payload2: AddItemPayload = { productoId: productoId2, cantidad: producto.cantidad, subtotal: subtotal2 };
            console.debug("Reintentando addItem -> carritoId=", nuevoId, "payload=", payload2);
            try {
              await carritoService.addItem(nuevoId, payload2);
              console.info("Reintento addItem exitoso");
            } catch (err2) {
              console.error("Reintento de addItem falló:", err2);
            }
          }
        } catch (re) {
          console.error("Error creando carrito durante reintento:", re);
        }
      }
    }
  };

  // Sincronizar eliminación de item al backend (si existe carritoId)
  const syncEliminarItemBackend = async (producto: ProductoCarrito) => {
    const usuario = auth?.usuario ?? null;
    if (!usuario || carritoId == null) return;
    try {
      const productoId = producto.sku ? String(producto.sku) : String(producto.id);
      // Intentar eliminar por productoId si el backend lo soporta
      await carritoService.removeItem(carritoId, productoId);
    } catch (err) {
      // Si el endpoint no existe o falla, lo ignoramos y mantenemos el estado local
      console.error("Error al eliminar ítem en backend (posible endpoint no soportado):", err);
    }
  };

  // ACCIONES que expone el contexto (cada una intenta sincronizar con backend)
  const agregarAlCarrito = async (producto: ProductoCarrito) => {
    // Actualización optimista local
    setCarrito((prev) => {
      const existe = prev.find((p) => (p.sku ? p.sku === producto.sku : p.id === producto.id));
      if (existe) {
        return prev.map((p) =>
          (p.sku ? p.sku === producto.sku : p.id === producto.id)
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      }
      return [...prev, producto];
    });

    // Sincronizar en background
    void syncAgregarItemBackend(producto);
  };

  const eliminarDelCarrito = async (id: number) => {
    const producto = carrito.find((p) => p.id === id);
    setCarrito((prev) => prev.filter((p) => p.id !== id));
    if (producto) {
      void syncEliminarItemBackend(producto);
    }
  };

  const vaciarCarrito = async () => {
    setCarrito([]);
    // Opcional: eliminar carrito en backend o vaciar items si existe endpoint
    // if (carritoId) await api.delete(`/carrito/${carritoId}/items`);
  };

  const actualizarCantidad = async (id: number, nuevaCantidad: number) => {
    setCarrito((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, nuevaCantidad) } : p))
    );
    // Para sincronizar cantidad con backend deberías llamar un endpoint PUT /carrito/{id}/items/{detalleId}
    // que en este proyecto no está mapeado en el cliente. Si tu backend soporta actualizar por productoId:
    // const producto = carrito.find(p => p.id === id);
    // if (producto && carritoId) { await api.put(`/carrito/${carritoId}/items`, { productoId, cantidad: nuevaCantidad, subtotal: ...}) }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
        actualizarCantidad,
        carritoId,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = (): CarritoContextType => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de un CarritoProvider");
  return ctx;
};

export default CarritoContext;