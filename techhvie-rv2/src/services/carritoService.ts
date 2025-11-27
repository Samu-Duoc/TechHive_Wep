import axios from "axios";

const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:8083";
const api = axios.create({ baseURL: BASE_URL });

    export interface AddItemPayload {
    productoId: string;
    cantidad: number;
    subtotal: string; // enviar como string para BigDecimal
    }

    // Normalizamos para que SIEMPRE tengamos data.id con el id real del carrito
    const normalizarCarrito = (data: any) => {
    const id =
        data?.carritoId ??
        data?.id ??
        data?.carrito_id ??
        null;

    return {
        ...data,
        id,
    };
    };

    const getCartByUser = async (usuarioId: number) => {
    const resp = await api.get(`/carrito/usuario/${usuarioId}`);
    const data = normalizarCarrito(resp.data);
    console.log("getCartByUser ->", data);
    return data;
    };

    const createCart = async (usuarioId: number) => {
    const resp = await api.post("/carrito", { usuarioId });
    const data = normalizarCarrito(resp.data);
    console.log("createCart ->", data);
    return data;
    };

    const addItem = async (carritoId: number, payload: AddItemPayload) => {
    const resp = await api.post(`/carrito/${carritoId}/items`, payload);
    return resp.data;
    };

    const removeItem = async (carritoId: number, itemId: number) => {
    const resp = await api.delete(`/carrito/${carritoId}/items/${itemId}`);
    return resp.data;
    };

    const updateItem = async (carritoId: number, itemId: number, payload: AddItemPayload) => {
    const resp = await api.put(`/carrito/${carritoId}/items/${itemId}`, payload);
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
