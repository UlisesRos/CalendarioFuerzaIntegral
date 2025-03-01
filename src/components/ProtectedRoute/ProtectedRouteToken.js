import { Navigate } from "react-router-dom"


function ProtectedRouteToken({ children }) {
    const token = localStorage.getItem('token')
    return token ? children : <Navigate to={'/home'} />
}

export default ProtectedRouteToken