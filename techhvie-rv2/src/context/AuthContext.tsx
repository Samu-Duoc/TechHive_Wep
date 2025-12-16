import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Usuario {
    id?: number;
    nombre?: string;
    apellido?: string;
    email?: string;
    rut?: string;
    telefono?: string;
    direccion?: string;
    rol?: "ADMIN" | "VENDEDOR" | "CLIENTE" | string;
    estado?: string;
    fechaRegistro?: string;
}

export type LoginResponse = { token: string; usuario: Usuario } | Usuario;

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    isLoggedIn: boolean;

    // helpers de rol (para UI/rutas)
    role: string | null;
    isAdmin: boolean;
    isVendedor: boolean;
    isCliente: boolean;

    // acciones
    login: (data: LoginResponse) => void;
    logout: () => void;
    setUsuario: (u: Usuario | null) => void;
    setToken: (t: string | null) => void;

    // útil para fetch()
    getAuthHeaders: (extra?: Record<string, string>) => Record<string, string>;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    function safeJsonParse<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
    }

    export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => safeJsonParse<Usuario>(localStorage.getItem("usuario")));
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    // Persistencia en localStorage
    useEffect(() => {
        if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        if (usuario.rol) localStorage.setItem("rol", String(usuario.rol));
        localStorage.setItem("isLoggedIn", "true");
        } else {
        localStorage.removeItem("usuario");
        localStorage.removeItem("rol");
        localStorage.removeItem("isLoggedIn");
        }
    }, [usuario]);

    useEffect(() => {
        if (token) localStorage.setItem("token", token);
        else localStorage.removeItem("token");
    }, [token]);

    const login = (data: LoginResponse) => {
        // Caso JWT real: {token, usuario}
        if (data && typeof data === "object" && "token" in data && "usuario" in data) {
        const d = data as { token: string; usuario: Usuario };
        setToken(d.token);
        setUsuario(d.usuario ?? null);
        return;
        }

        //Caso backend viejo: UsuarioDTO sin token
        setToken(null);
        setUsuario(data as Usuario);
    };

    const logout = () => {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("isLoggedIn");
    };

    const role = (usuario?.rol ?? localStorage.getItem("rol")) || null;
    const isAdmin = String(role).toUpperCase() === "ADMIN";
    const isVendedor = String(role).toUpperCase() === "VENDEDOR";
    const isCliente = !role || String(role).toUpperCase() === "CLIENTE";

    const getAuthHeaders = (extra: Record<string, string> = {}) => {
        const headers: Record<string, string> = { ...extra };
        if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";

        const t = token ?? localStorage.getItem("token");
        if (t) headers["Authorization"] = `Bearer ${t}`;

        return headers;
    };

    const value = useMemo(
    () => ({
        usuario,
        token,
        isLoggedIn: !!usuario,

        role,
        isAdmin,
        isVendedor,
        isCliente,

        login,
        logout,
        setUsuario,
        setToken,

        getAuthHeaders,
    }),
    [usuario, token, role, isAdmin, isVendedor, isCliente]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return ctx;
};

export default AuthContext;