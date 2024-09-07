import Admin from "./components/admin/Admin";
import InitialCalendar from "./components/admin/InitialCalendar";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

const adminCalendar = {
    lunes: {
        mañana: {
            8: ['isabel c', 'belu s', 'joaco m', "hugo d", "nanci g", "javier r", "miriam p"],
            9: ['valen o', "lu s", "ale p", "mauri l", "beti f", null],
            10: ["ro b", "ailen m", "facu a","omar b", null, null],
            11: ["bruno",null,null,null,null,null]
        },
        tarde: {
            16: ["jor p", "dona r", "irina roman", "mayra n", "marian g", "cuervo", null],
            17: ['clari s', "ale a", "ale g", "facu a",null,null,null],
            18: ["franco s", "alicia n", "belu a", "damian o", "maela g", "eze s"],
            19: ["rama r", "maia b", "mariano f", "uli", "mica p",null],
        }
    },
    martes: {
        mañana: {
            8: ["agos p", "joaco m", "juan jose f", "pato c", null, null,null],
            9: ["marina m", "sabri v", "lu w", "flor p", "martina g", "mayra m"],
            10: ["betty j", "adri f", "marian m", null, null,null],
            11: ["dani r", null,null, null, null, null]
        },
        tarde: {
            16: ["dani e", "zio r", "malvi r", "liliana v", "rocio g", null, null],
            17: ["guille sc","elba g", "irina r", null, null, null,null],
            18: ["frances", "sofia f", "eve v",null,null,null],
            19: ["lucas k",null,null,null,null,null],
        }
    },
    miércoles: {
        mañana: {
            8: ["lu w", "isabel c", "nanci g", "romi m", null, null],
            9: ["daniela a", "mauri l", "Ale P", "Yas", null, null],
            10: ["ailen m","omar b",null,null,null,null],
            11: ["Lu S",null,null,null,null,null]
        },
        tarde: {
            16: ["irina r","ale G","marcelo m","cande b","marian g",null],
            17: ["ale a","melina l","facu a","cuervo","sofia f",null],
            18: ["ulises","flor m","laura f","franco s","bruno","mica p"],
            19: ["frances","juli",null,null,null,null],
        }
    },
    jueves: {
        mañana: {
            8: ["joaco m","javier r",null,null,null,null],
            9: ["Yaz","belu","Licha R","martina g",null,null],
            10: ["ro b","mayra","betty j",null,null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["juli pau","dona r","jor p","alicia n","ziomara r","malvi r"],
            17: ["agos p","facu a","cori o","liliana v","dani r","guille s","eva a"],
            18: ["frances","celesta g",null,null,null,null],
            19: ["mariano f","lucas k","rama",null,null,null],
        }
    },
    viernes: {
        mañana: {
            8: ["daniela a","isabel c",null,null,null,null],
            9: ["lu w","flor b",null,null,null,null],
            10: ["dani r","mauri l","damian o","cori o",null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["ale g","marian g","belu a","cande b","irina r",null],
            17: ["sofia f","melina l","eve v",null,null,null],
            18: ["ro b","belu","irina r","Maela G","mica p", null],
            19: ["maia b","rama","frances","juli b","uli","flor m"],
        }
    },
    sábado: {
        mañana: {
            930: ["fatima d","dani r","flor p","lu s","cori o",null],
            1030: ["marian m","eve v","sofia f","ro b",null,null],
            1130: ["mayran", "dona r",null,null,null,null]
        }
    }
};

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Verificar autenticación al montar el componente
    useEffect(() => {
        const authStatus = localStorage.getItem('adminAuthenticated');
        setIsAuthenticated(authStatus === 'true');
    }, []);

    const [theme, setTheme] = useState('light')

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
            <Route path="/" element={<Rutas toggleTheme={toggleTheme} theme={theme} adminCalendar={adminCalendar} />} />
            <Route path="/admin" element={<Admin setIsAuthenticated={setIsAuthenticated} theme={theme}/>} />
            <Route path='/initialcalendar' element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <InitialCalendar setIsAuthenticated={setIsAuthenticated} toggleTheme={toggleTheme} theme={theme} adminCalendar={adminCalendar} />
                </ProtectedRoute>
            }
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        </Router>
    );
}

export default App;
