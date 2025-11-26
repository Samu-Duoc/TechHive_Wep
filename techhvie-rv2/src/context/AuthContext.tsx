import React, { createContext, useContext, useEffect, useState } from "react";

    interface Usuario {
    id?: number;
    nombre?: string;
    email?: string;
    rol?: string;
    }

    interface AuthContextType {
    usuario: Usuario | null;
    isLoggedIn: boolean;
    login: (usuario: Usuario) => void;
    logout: () => void;
    setUsuario: (u: Usuario | null) => void;
    }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

    export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        try {
        const raw = localStorage.getItem("usuario");
        return raw ? JSON.parse(raw) : null;
        } catch {
        return null;
        }
    });

    useEffect(() => {
        try {
        if (usuario) {
            localStorage.setItem("usuario", JSON.stringify(usuario));
            localStorage.setItem("isLoggedIn", "true");
        } else {
            localStorage.removeItem("usuario");
            localStorage.removeItem("isLoggedIn");
        }
        } catch {

    }
    }, [usuario]);

    const login = (u: Usuario) => setUsuario(u);
    const logout = () => setUsuario(null);

    return (
        <AuthContext.Provider value={{ usuario, isLoggedIn: !!usuario, login, logout, setUsuario }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
    return ctx;
};

export default AuthContext;
