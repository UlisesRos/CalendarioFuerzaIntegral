import Admin from "./components/admin/Admin";
import InitialCalendar from "./components/admin/InitialCalendar";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

const adminCalendar = {
    lunes: {
        mañana: {
            8: ["isabel c","belu s","joaco m","hugo d","nanci g","javier r","miriam p"],
            9: ["valen o","lu s","ale p","beti f","mauri l",null],
            10: ["ro b","ailen m","facu a","omar b",null,null],
            11: ["bruno",null,null,null,null,null]
        },
        tarde: {
            16: ["jor p","dona r","irina r","mayra n","marian g","cuervo",null],
            17: ["clari s","ale a","ale g","facu a",null,null,null],
            18: ["franco s","alicia n","belu a","damian o","maela g","eze s"],
            19: ["rama r","maia b","mariano f","uli","mica p",null],
        }
    },
    martes: {
        mañana: {
            8: ["joaco m","agos p","juan jose f","pato c",null,null,null],
            9: ["marina m","sabri v","lu w","flor p","mayra n","martina g"],
            10: ["adri f","marian m","betty j",null,null,null],
            11: ["dani r",null,null, null, null, null]
        },
        tarde: {
            16: ["dani e","ziu r","malvi r","liliana v","rocio g",null,null],
            17: ["guille sc","irina r","elba g",null,null,null,null],
            18: ["frances","sofi f","eve v",null,null,null],
            19: ["lucas k",null,null,null,null,null]
        }
    },
    miércoles: {
        mañana: {
            8: ["daniela a","belu s","isabel c","nanci g","romi m",null,null],
            9: ["beti f","valen o","lu s","mauri l","yaz w",null],
            10: ["ro b","flor b","ailen m","omar b",null,null],
            11: ["dani r",null,null,null,null,null]
        },
        tarde: {
            16: ["irina r","fati d","mayra n","cande b","marian g",null,null],
            17: ["clari s","ale a","ale g","cuervo","facu a",null,null],
            18: ["maela g","eze s","vero t","franco s","bruno",null],
            19: ["rama r","maia b","uli","mica p",null,null],
        }
    },
    jueves: {
        mañana: {
            8: ["joaco m","javier r",null,null,null,null,null],
            9: ["marina m","ale p","flor p","martina g","sabri v",null],
            10: ["dani e","facu a","marian m",null,null,null],
            11: [null,null,null,null,null,null]
        },
        tarde: {
            16: ["dona r","jor p","mayra n","ziomara r","malvi r",null,null],
            17: ["agos p","facu a","rocio g","liliana v","elba","guille sc","pato c"],
            18: ["frances","belu a","irina r",null,null,null],
            19: ["mariano f","flor m","lucas k","sofi f","eve v",null],
        }
    },
    viernes: {
        mañana: {
            8: ["juan jose f","miriam p","daniela a","isabel c","romi m","belu s","hugo d"],
            9: ["martina g","yaz w","lu w","beti f","nanci g","mauri l"],
            10: ["ro b","dani r","adri f","flor b","ailen m",null],
            11: [null,null,null,null,null,null]
        },
        tarde: {
            16: ["jor p","marian g","mayra n","cande b","dona r","irina r",null],
            17: ["ale g","bruno","liliana v","rocio g","damian o","irina r",null],
            18: ["alicia n","eze s","maela g","vero t", null,null],
            19: ["maia b","rama r","mica p","uli",null,null],
        }
    },
    sábado: {
        mañana: {
            930: ["yaz w","fatima d","dani r","flor p","licha r",null],
            1030: ["lu s","marian m","eve v","sofia f",null,null],
            1130: ["flor m",null,null,null,null,null,null]
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
