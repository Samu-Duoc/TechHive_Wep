import axios from "axios";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8083";
const api = axios.create({ baseURL: BASE_URL });

export interface AddItemPayload {
    productoId: string;
    cantidad: number;
    subtotal: string; // enviar como string para BigDecimal
}

const getCartByUser = async (usuarioId: number) => {
    const resp = await api.get(`/carrito/usuario/${usuarioId}`);
    return resp.data;
};

const createCart = async (usuarioId: number) => {
    const resp = await api.post(`/carrito`, { usuarioId });
    return resp.data;
};

const addItem = async (carritoId: number, payload: AddItemPayload) => {
    const resp = await api.post(`/carrito/${carritoId}/items`, payload);
    return resp.data;
};

const removeItem = async (carritoId: number, productoId: string) => {
  // Si tu backend soporta eliminación por productoId
    const resp = await api.delete(`/carrito/${carritoId}/items/${encodeURIComponent(productoId)}`);
    return resp.data;
};

const updateItem = async (carritoId: number, productoId: string, cantidad: number, subtotal: string) => {
    const resp = await api.put(`/carrito/${carritoId}/items`, { productoId, cantidad, subtotal });
    return resp.data;
};

const clearCart = async (carritoId: number) => {
    const resp = await api.delete(`/carrito/${carritoId}/items`);
    return resp.data;
};

export default {
    getCartByUser,
    createCart,
    addItem,
    removeItem,
    updateItem,
    clearCart,
};
