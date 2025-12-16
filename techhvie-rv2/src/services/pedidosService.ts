import axios, { AxiosError } from "axios";

const BASE_URL =
	(import.meta as any).env?.VITE_PEDIDOS_URL ?? "http://localhost:8084";

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as any).Authorization = `Bearer ${token}`;
	}
	return config;
});

// Tipos opcionales
export interface ItemPedidoDTO {
	productoId: number;
	cantidad: number;
	precioUnitario: number;
}

export interface CrearPedidoPagoDTO {
	usuarioId: number;
	direccionId: string;
	metodoPago: string;
	total: number;
	items: ItemPedidoDTO[];
}

export interface ComprobantePagoDTO {
	mensaje: string;
	pedidoId: string;
	fecha: string;
	total: number;
	metodoPago: string;
}

// Listado/resumen de pedido
export type EstadoPedido =
	| "CONFIRMADO"
	| "PREPARANDO"
	| "EN_TRANSITO"
	| "ENTREGADO"
	| "CANCELADO";

export interface Pedido {
	id: number;
	usuarioId: number;
	total: number;
	estado: EstadoPedido | string;
}

// Detalle de pedido
export interface PedidoItemDetalleDTO {
	productoId: number;
	nombreProducto: string;
	cantidad: number;
	precioUnitario: number;
	subtotal: number;
}

export interface PedidoDetalleDTO {
	pedidoId: number | string;
	usuarioId: number;
	fecha: string;
	metodoPago: string;
	total: number;
	estado: EstadoPedido | string;
	items: PedidoItemDetalleDTO[];
}

export async function pagar(
	payload: CrearPedidoPagoDTO
): Promise<ComprobantePagoDTO> {
	try {
		const { data } = await api.post<ComprobantePagoDTO>(
			"/pedidos/pagar",
			payload
		);
		return data;
	} catch (err) {
		const e = err as AxiosError<any>;
		const msg = (e.response?.data as any)?.message || e.message || "Error al pagar";
		throw new Error(msg);
	}
}

// Listar pedidos por usuario
export async function listarPorUsuario(usuarioId: number): Promise<Pedido[]> {
	try {
		const { data } = await api.get<Pedido[]>(`/pedidos/usuario/${usuarioId}`);
		return data;
	} catch (err) {
		const e = err as AxiosError<any>;
		const msg = (e.response?.data as any)?.message || e.message || "Error al listar pedidos del usuario";
		throw new Error(msg);
	}
}

// Listar todos los pedidos (admin/vendedor)
export async function listarTodas(): Promise<Pedido[]> {
	try {
		const { data } = await api.get<Pedido[]>(`/pedidos`);
		return data;
	} catch (err) {
		const e = err as AxiosError<any>;
		const msg = (e.response?.data as any)?.message || e.message || "Error al listar pedidos";
		throw new Error(msg);
	}
}

// Obtener detalle de un pedido
export async function detalle(pedidoId: string | number): Promise<PedidoDetalleDTO> {
	try {
		const { data } = await api.get<PedidoDetalleDTO>(`/pedidos/${pedidoId}`);
		return data;
	} catch (err) {
		const e = err as AxiosError<any>;
		const msg = (e.response?.data as any)?.message || e.message || "Error al obtener detalle del pedido";
		throw new Error(msg);
	}
}

// Actualizar estado de un pedido
export async function actualizarEstado(
	pedidoId: string | number,
	estado: EstadoPedido
): Promise<void> {
	try {
		await api.patch(`/pedidos/${pedidoId}/estado`, { estado });
	} catch (err) {
		const e = err as AxiosError<any>;
		const msg = (e.response?.data as any)?.message || e.message || "Error al actualizar estado del pedido";
		throw new Error(msg);
	}
}

export default {
	pagar,
	listarPorUsuario,
	listarTodas,
	detalle,
	actualizarEstado,
};