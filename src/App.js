import ProtectedRouteToken from "./components/ProtectedRoute/ProtectedRouteToken";
import ProtectedRouteCode from './components/ProtectedRoute/ProtectedRouteCode';
import InitialCalendar from "./components/admin/InitialCalendar";
import Novedades from "./components/admin/Novedades";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Calendario from "./components/calendario/Calendario";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/footer/Footer";
import Registro from "./components/Registro/Registro";
import Login from "./components/Login/Login";
import axios from 'axios';
import AdminRoute from "./components/admin/AdminRoute";
import SeccionAdmin from "./components/admin/SeccionAdmin";
import RegistroClientes from "./components/admin/clients/RegistroClientes";
import OpcionesPago from "./components/Pagos/OpcionesPago";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import IngresoUsuario from "./components/ingreso/IngresoUsuario";
import Perfil from "./components/usuario/Perfil";
import ForgotPasswordForm from "./components/Login/ForgotPasswordForm";
import ResetPasswordForm from "./components/Login/ResetPasswordForm";
import HistorialMensual from "./components/admin/clients/HistorialMensual";
import Nutricion from "./components/nutricion/NutricionCalendar";
import HomeNutricion from './components/nutricion/HomeNutricion';
import AdminTurnosHistorial from "./components/nutricion/AdminTurnosHistorial";

const apiUrl = process.env.REACT_APP_API_URL;
// const apiUrl = 'http://localhost:5000'; // URL base de la API

function App() {
    const [theme, setTheme] = useState('light');
    const [userData, setUserData] = useState(null);
    const [appStatus, setAppStatus] = useState('loading');
    const [errorMessage, setErrorMessage] = useState('');

    // Configuración de interceptores de axios
    axios.interceptors.request.use((config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Manejo centralizado de errores 401
                localStorage.removeItem('token');
                setUserData(null);
                
                // Solo muestra error si no está en la página de login
                if (!window.location.pathname.includes('/login')) {
                    setErrorMessage('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
                    setAppStatus('error');
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const initializeApp = async () => {
            try {
                setAppStatus('loading');
                
                // Verificar conexión a internet
                if (!navigator.onLine) {
                    throw new Error('No hay conexión a internet. Por favor verifica tu conexión.');
                }

                // Configurar tema
                const savedTheme = 'light';
                setTheme(savedTheme);
                document.documentElement.setAttribute('data-theme', savedTheme);

                // Cargar datos del usuario si hay token
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const response = await axios.get(`${apiUrl}/api/auth/user`);
                        setUserData(response.data);
                    } catch (error) {
                        if (error.response?.status === 401) {
                            // Token inválido - limpiamos y continuamos como usuario no autenticado
                            localStorage.removeItem('token');
                            setUserData(null);
                        } else {
                            throw error;
                        }
                    }
                }

                setAppStatus('ready');
            } catch (error) {
                console.error('Error inicializando la app:', error);
                setErrorMessage(
                    error.response?.data?.message || 
                    error.message || 
                    'Error al cargar la aplicación. Por favor intenta nuevamente.'
                );
                setAppStatus('error');
            }
        };

        // Pequeño retraso para mejor experiencia de usuario
        const timer = setTimeout(() => {
            initializeApp();
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLoginSuccess = (token, user) => {
        localStorage.setItem('token', token);
        setUserData(user);
        setErrorMessage('');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserData(null);
        // No usar window.location.reload() para mantener el estado del tema
        setAppStatus('ready');
    };

    const handleRetry = () => {
        setAppStatus('loading');
        setErrorMessage('');
        window.location.reload();
    };

    // Pantalla de carga
    if (appStatus === 'loading') {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                zIndex: 1000,
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: `5px solid ${theme === 'light' ? '#e0e0e0' : '#333'}`,
                    borderTopColor: theme === 'light' ? '#3f51b5' : '#4fc3f7',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '20px'
                }} />
                <p style={{ 
                    color: theme === 'light' ? '#333' : '#fff',
                    fontSize: '18px',
                    textAlign: 'center',
                    maxWidth: '300px'
                }}>
                    Cargando Gimnasio App...
                </p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // Pantalla de error
    if (appStatus === 'error') {
        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212',
                zIndex: 1000,
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div style={{ 
                    color: theme === 'light' ? '#d32f2f' : '#f44336',
                    fontSize: '24px',
                    marginBottom: '20px'
                }}>
                    ⚠️
                </div>
                <h2 style={{ 
                    color: theme === 'light' ? '#333' : '#fff',
                    fontSize: '20px',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}>
                    Ocurrió un problema
                </h2>
                <p style={{ 
                    color: theme === 'light' ? '#666' : '#ccc',
                    fontSize: '16px',
                    textAlign: 'center',
                    marginBottom: '30px',
                    maxWidth: '300px'
                }}>
                    {errorMessage}
                </p>
                <button
                    onClick={handleRetry}
                    style={{
                        padding: '12px 24px',
                        backgroundColor: theme === 'light' ? '#3f51b5' : '#4fc3f7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = theme === 'light' ? '#303f9f' : '#3dbbdc'}
                    onMouseOut={(e) => e.target.style.backgroundColor = theme === 'light' ? '#3f51b5' : '#4fc3f7'}
                >
                    Reintentar
                </button>
                {errorMessage.includes('expirado') && (
                    <button
                        onClick={() => window.location.href = '/login'}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'transparent',
                            color: theme === 'light' ? '#3f51b5' : '#4fc3f7',
                            border: `1px solid ${theme === 'light' ? '#3f51b5' : '#4fc3f7'}`,
                            borderRadius: '4px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            marginTop: '15px',
                            transition: 'all 0.3s'
                        }}
                    >
                        Ir a Iniciar Sesión
                    </button>
                )}
            </div>
        );
    }

    // Aplicación principal
    return (
        <div style={{ 
            minWidth: '320px', 
            overflowX: 'hidden',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme === 'light' ? '#ffffff' : '#121212'
        }}>
            <Router>
                <Navbar 
                    toggleTheme={toggleTheme} 
                    theme={theme} 
                    userData={userData}
                    onLogout={handleLogout}
                />
                <main style={{ flex: 1 }}>
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
                        }/>
                        <Route path="/admin/historial" element={
                            <AdminRoute>
                                <AdminTurnosHistorial apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                            </AdminRoute>
                        }/>
                        <Route path="/calendario" element={
                            <ProtectedRouteToken>
                                <Calendario apiUrl={apiUrl} theme={theme} userData={userData} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path="/pagos" element={
                            <ProtectedRouteToken>
                                <OpcionesPago apiUrl={apiUrl} theme={theme} userData={userData} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path="/payment_success" element={
                            <ProtectedRouteToken>
                                <PaymentSuccess apiUrl={apiUrl} userData={userData} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path="/perfil" element={
                            <ProtectedRouteToken>
                                <Perfil userData={userData} theme={theme} onLogout={handleLogout} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path="/nutricion" element={
                            <ProtectedRouteToken>
                                <Nutricion apiUrl={apiUrl} theme={theme} userData={userData} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path="/homenutricion" element={
                            <ProtectedRouteToken>
                                <HomeNutricion apiUrl={apiUrl} theme={theme} userData={userData} />
                            </ProtectedRouteToken>
                        }/>
                        <Route path='/seccionadmin' element={
                            <AdminRoute>
                                <SeccionAdmin toggleTheme={toggleTheme} theme={theme} administrador={userData}/>
                            </AdminRoute>
                        }/>
                        <Route path="/novedades" element={
                            <AdminRoute>
                                <Novedades apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                            </AdminRoute>
                        }/>
                        <Route path="/initialcalendar" element={
                            <AdminRoute>
                                <InitialCalendar apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} administrador={userData}/>
                            </AdminRoute>
                        }/>
                        <Route path="/registroclientes" element={
                            <AdminRoute>
                                <RegistroClientes apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                            </AdminRoute>
                        }/>
                        <Route path="/registro" element={
                            <ProtectedRouteCode>
                                <Registro apiUrl={apiUrl} toggleTheme={toggleTheme} theme={theme} />
                            </ProtectedRouteCode>
                        }/>
                        <Route path="/login" element={
                            <Login 
                                apiUrl={apiUrl} 
                                toggleTheme={toggleTheme} 
                                theme={theme} 
                                onLoginSuccess={handleLoginSuccess}
                            />
                        }/>
                        <Route path="/forgotpasswordform" element={
                            <ForgotPasswordForm apiUrl={apiUrl} theme={theme} />
                        }/>
                        <Route path="/resetpasswordform" element={
                            <ResetPasswordForm apiUrl={apiUrl} theme={theme} />
                        }/>
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer theme={theme} />
            </Router>
        </div>
    );
}

export default App;