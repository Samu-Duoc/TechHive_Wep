import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CarritoItem = {
  productoId: number;     // Long en backend
  sku?: string;           // opcional
  nombre: string;
  precio: number;
  cantidad: number;
  imagenUrl?: string;     // opcional (solo UI)
  stock?: number;         // opcional: para limitar cantidades
};

type CarritoContextType = {
  items: CarritoItem[];
  total: number;
  addItem: (p: Omit<CarritoItem, "cantidad">, cantidad?: number) => void;
  increase: (productoId: number) => void;
  decrease: (productoId: number) => void;
  remove: (productoId: number) => void;
  clear: () => void;
};

const KEY = "th_cart_items";

const CarritoContext = createContext<CarritoContextType | null>(null);

export const CarritoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CarritoItem[]>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, it) => sum + it.precio * it.cantidad, 0),
    [items]
  );

  // Igual que tu Cart singleton: add / increase / decrease / remove / clear :contentReference[oaicite:6]{index=6}
  const addItem = (p: Omit<CarritoItem, "cantidad">, cantidad = 1) => {
    if (cantidad <= 0) return;
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.productoId === p.productoId);
      if (idx >= 0) {
        const copy = [...prev];
        const current = copy[idx];
        const effectiveStock = current.stock ?? p.stock; // conserva stock si ya existe, o toma del nuevo
        const nextCantidad = current.cantidad + cantidad;
        copy[idx] = {
          ...current,
          stock: effectiveStock,
          cantidad: effectiveStock != null ? Math.min(nextCantidad, effectiveStock) : nextCantidad,
        };
        return copy;
      }
      const initialCantidad = p.stock != null ? Math.min(cantidad, p.stock) : cantidad;
      return [...prev, { ...p, cantidad: initialCantidad }];
    });
  };

  const increase = (productoId: number) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.productoId !== productoId) return x;
        if (x.stock != null && x.cantidad >= x.stock) return x; // no superar stock
        return { ...x, cantidad: x.cantidad + 1 };
      })
    );
  };

  const decrease = (productoId: number) => {
    setItems((prev) =>
      prev.map((x) =>
        x.productoId === productoId ? { ...x, cantidad: Math.max(1, x.cantidad - 1) } : x
      )
    );
  };

  const remove = (productoId: number) => {
    setItems((prev) => prev.filter((x) => x.productoId !== productoId));
  };

  const clear = () => setItems([]);

  return (
    <CarritoContext.Provider value={{ items, total, addItem, increase, decrease, remove, clear }}>
      {children}
    </CarritoContext.Provider>
  );
};

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
};
