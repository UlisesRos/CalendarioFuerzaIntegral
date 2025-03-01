import { Navigate } from "react-router-dom";

function ProtectedRouteCode({ children }) {
    const accessGranted = localStorage.getItem("accessGranted") === "true"; // Verifica si el código fue ingresado correctamente

    return accessGranted ? children : <Navigate to="/home" />;
}

export default ProtectedRouteCode;
