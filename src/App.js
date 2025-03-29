import ProtectedRouteToken from "./components/ProtectedRoute/ProtectedRouteToken";
import ProtectedRouteCode from './components/ProtectedRoute/ProtectedRouteCode'
import InitialCalendar from "./components/admin/InitialCalendar";
import Novedades from "./components/admin/Novedades";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
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

const apiUrl = process.env.REACT_APP_API_URL;

function App() {
    const [theme, setTheme] = useState('light');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para controlar la carga
    const [error, setError] = useState(null); // Estado para manejar errores

    // Configuración de axios
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    });

    useEffect(() => {
        const fetchUserData = async() => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await axios.get(`${apiUrl}/api/auth/user`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error al obtener los datos del usuario', error);
                setError('Error al cargar los datos del usuario');
            } finally {
                setLoading(false);
            }
        };

        // Simulamos un mínimo tiempo de carga para mejor experiencia
        const loadingTimer = setTimeout(() => {
            fetchUserData();
        }, 500);

        return () => clearTimeout(loadingTimer);
    }, []);

    useEffect(() => {
        const savedTheme = 'light';
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // Pantalla de carga
    if (loading) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: theme === 'light' ? '#ffffff' : '#121212',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                zIndex: 9999
            }}>
                <div className="spinner" style={{
                    border: `4px solid ${theme === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'}`,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    borderLeftColor: theme === 'light' ? '#09f' : '#0af',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                }}></div>
                <p style={{ color: theme === 'light' ? '#333' : '#fff' }}>Cargando aplicación...</p>
                
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Pantalla de error (opcional)
    if (error) {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: theme === 'light' ? '#ffffff' : '#121212',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                zIndex: 9999,
                padding: '20px',
                textAlign: 'center'
            }}>
                <h2 style={{ color: theme === 'light' ? '#333' : '#fff', marginBottom: '16px' }}>Error al cargar la aplicación</h2>
                <p style={{ color: theme === 'light' ? '#666' : '#ccc', marginBottom: '24px' }}>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: theme === 'light' ? '#09f' : '#0af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Recargar Página
                </button>
            </div>
        );
    }

    // Aplicación normal
    return (
        <Router>
            <Navbar toggleTheme={toggleTheme} theme={theme} userData={userData}/>
            <Routes>
                <Route path="/" element={<Rutas apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />} />
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
