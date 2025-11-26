import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  let usuario: any = null;
  try {
    const raw = localStorage.getItem("usuario");
    usuario = raw ? JSON.parse(raw) : null;
  } catch (e) {
    usuario = null;
  }

  // Si no está logueado -> ir a login
  if (!usuario) return <Navigate to="/login" replace />;

  // Si no tiene rol permitido -> ir al inicio (403 alternativa)
  if (!allowedRoles.includes(usuario.rol)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
