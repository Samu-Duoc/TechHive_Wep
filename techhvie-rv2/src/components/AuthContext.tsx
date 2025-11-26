import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, nombre, email, rol }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
    }, []);

    // aquí puedes llamar a tu MS de auth, o dejarlo “fake” por ahora
    const login = async (email, password) => {
        // 🔹 OPCIÓN 1: llamar a tu ms auth (si ya lo tienes):
        /*
        const resp = await fetch("http://TU_MS_AUTH/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });
        if (!resp.ok) throw new Error("Credenciales inválidas");
        const data = await resp.json(); // { id, nombre, email, rol }
        */

        // 🔹 OPCIÓN 2 (para avanzar rápido en la U): simular usuarios
        let data;
        if (email === "admin@techhive.cl") {
        data = { id: 1, nombre: "Admin", email, rol: "ADMIN" };
        } else if (email === "vendedor@techhive.cl") {
        data = { id: 2, nombre: "Vendedor", email, rol: "VENDEDOR" };
        } else {
        data = { id: 3, nombre: "Cliente", email, rol: "CLIENTE" };
        }

        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
        value={{
            user,
            role: user?.rol ?? null,
            isAuthenticated: !!user,
            login,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
        );
}

export function useAuth() {
    return useContext(AuthContext);
}
