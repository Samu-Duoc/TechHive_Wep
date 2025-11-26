import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


//Compoenete para capturar el rol del ms 
export function RequireAuth({ allowedRoles }) {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/no-autorizado" replace />;
    }

    return <Outlet />;
}
