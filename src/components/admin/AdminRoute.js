import {jwtDecode} from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const getRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.role; // Devuelve el rol del usuario
    } catch (error) {
        console.error('Error decodificando el token:', error);
        return null;
    }
};

const AdminRoute = ({ children }) => {
    const role = getRoleFromToken();

    // Si no tiene el rol adecuado, redirige al inicio
    return role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;