import ProtectedRouteToken from "./components/ProtectedRoute/ProtectedRouteToken";
import ProtectedRouteCode from './components/ProtectedRoute/ProtectedRouteCode'
import InitialCalendar from "./components/admin/InitialCalendar";
import Novedades from "./components/admin/Novedades";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import BoxRutinas from "./components/rutinas/BoxRutinas";
import Calendario from "./components/calendario/Calendario";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/footer/Footer";
import Registro from "./components/Registro/Registro";
import Login from "./components/Login/Login";
import axios from 'axios'
import AdminRoute from "./components/admin/AdminRoute";
import SeccionAdmin from "./components/admin/SeccionAdmin";
import RegistroClientes from "./components/admin/clients/RegistroClientes";
import Pagos from "./components/Pagos/Pagos";
import Transferencia from "./components/Pagos/Transferencia";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import IngresoUsuario from "./components/ingreso/IngresoUsuario";
import Perfil from "./components/usuario/Perfil";
import ForgotPasswordForm from "./components/Login/ForgotPasswordForm";
import ResetPasswordForm from "./components/Login/ResetPasswordForm";
import HistorialMensual from "./components/admin/clients/HistorialMensual";

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {

    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        console.log('token', token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

    const [theme, setTheme] = useState('dark')
    const [userData, setUserData] = useState(null)

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const response = await axios.get(`${apiUrl}/api/auth/user`);
                setUserData(response.data)
            } catch (error) {
                console.error('Error al obtener los datos del usuario', error)
            }
        };

        fetchUserData();
    }, []);
    
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };
    

    return (
        <Router>
            <Navbar toggleTheme={toggleTheme} theme={theme} userData={userData}/>
            <Routes>
                <Route path="/" element={<Rutas toggleTheme={toggleTheme} theme={theme} />} />
                <Route 
                    path="/ingresousuario"
                    element={
                        <AdminRoute>
                            <IngresoUsuario apiUrl={apiUrl} theme={theme}/>
                        </AdminRoute>
                    }
                />
                <Route path='/historialmensual' element={
                    <AdminRoute>
                        <HistorialMensual apiUrl={apiUrl} theme={theme}/>
                    </AdminRoute>
                }
                />
                <Route path="/calendario" element={
                    <ProtectedRouteToken>
                        <Calendario apiUrl={apiUrl} theme={theme} userData={userData} />
                    </ProtectedRouteToken>
                }
                />
                <Route path="/pagos" element={
                    <ProtectedRouteToken>
                        <Transferencia apiUrl={apiUrl} theme={theme} userData={userData} />
                    </ProtectedRouteToken>
                }
                />
                <Route path="/payment_success" element={
                    <ProtectedRouteToken>
                        <PaymentSuccess apiUrl={apiUrl} userData={userData} />
                    </ProtectedRouteToken>
                }
                />
                <Route path="/perfil" element={
                    <ProtectedRouteToken>
                        <Perfil userData={userData} theme={theme} />
                    </ProtectedRouteToken>
                }
                />
                <Route path='/seccionadmin' element={
                    <AdminRoute>
                        <SeccionAdmin toggleTheme={toggleTheme} theme={theme} administrador={userData}/>
                    </AdminRoute>
                }
                />
                <Route path="/novedades" element={
                    <AdminRoute >
                        <Novedades apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                    </AdminRoute>
                }
                />
                <Route path="/initialcalendar" element={
                    <AdminRoute>
                        <InitialCalendar apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} administrador={userData}/>
                    </AdminRoute>
                }
                />
                <Route path="/registroclientes" element={
                    <AdminRoute >
                        <RegistroClientes apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                    </AdminRoute>
                }
                />
                <Route path="/rutinas" element={<BoxRutinas toggleTheme={toggleTheme} theme={theme} />} />
                <Route path="/registro" element={
                    <ProtectedRouteCode>
                        <Registro apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                    </ProtectedRouteCode>
                    } />
                <Route path="/login" element={<Login apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />} />
                <Route path="/forgotpasswordform" element={<ForgotPasswordForm apiUrl={apiUrl} theme={theme} />} />
                <Route path="/resetpasswordform" element={<ResetPasswordForm apiUrl={apiUrl} theme={theme} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
