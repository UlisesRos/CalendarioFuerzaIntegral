import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children }) => {
    if (!isAuthenticated) {
        // Si no está autenticado, redirige al inicio o a la página de login
        return <Navigate to="/admin" />;
    }

    // Si está autenticado, renderiza los componentes hijos
    return children;
};

export default ProtectedRoute;