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
    // Enviar 'detalles' como arreglo vacío para que el backend no reciba null
    const resp = await api.post("/carrito", { usuarioId, detalles: [] });
    const data = normalizarCarrito(resp.data);
    console.log("createCart ->", data);
    return data;
    };

    const addItem = async (carritoId: number, payload: AddItemPayload) => {
    // Transformar al contrato backend: producto_id, cantidad, subtotal, carrito_id
    const maybeNum = Number(payload.productoId);
    const producto_id = Number.isNaN(maybeNum) ? payload.productoId : maybeNum;
    const body = {
        producto_id,
        cantidad: payload.cantidad,
        subtotal: payload.subtotal,
        carrito_id: carritoId,
    };

    try {
        console.debug('carritoService.addItem -> URL=', `/carrito/${carritoId}/items`, 'body=', body);
        const resp = await api.post(`/carrito/${carritoId}/items`, body);
        console.debug('carritoService.addItem response -> status=', resp.status, 'data=', resp.data);
        return resp.data;
    } catch (err) {
        console.error('carritoService.addItem error ->', err);
        // rethrow so callers can handle retries
        throw err;
    }
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
