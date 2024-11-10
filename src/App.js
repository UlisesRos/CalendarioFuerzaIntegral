import Admin from "./components/admin/Admin";
import InitialCalendar from "./components/admin/InitialCalendar";
import Novedades from "./components/admin/Novedades";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import BoxRutinas from "./components/rutinas/BoxRutinas";

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar autenticación al montar el componente
    useEffect(() => {
        const authStatus = localStorage.getItem('adminAuthenticated');
        setIsAuthenticated(authStatus === 'true');
    }, []);

    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Rutas toggleTheme={toggleTheme} theme={theme} />} />
                <Route path="/admin" element={<Admin setIsAuthenticated={setIsAuthenticated} theme={theme}/>} />
                <Route path='/initialcalendar' element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <InitialCalendar setIsAuthenticated={setIsAuthenticated} toggleTheme={toggleTheme} theme={theme} />
                    </ProtectedRoute>
                }
                />
                <Route path="/novedades" element={
                    <ProtectedRoute isAuthenticated={isAuthenticated} >
                        <Novedades toggleTheme={toggleTheme} theme={theme} setIsAuthenticated={setIsAuthenticated} />
                    </ProtectedRoute>
                }
                />
                <Route path="/rutinas" element={<BoxRutinas toggleTheme={toggleTheme} theme={theme} />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
