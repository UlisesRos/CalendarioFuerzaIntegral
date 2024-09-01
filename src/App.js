import Admin from "./components/admin/Admin";
import Rutas from "./components/Rutas/Rutas";
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

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
        <Route path="/" element={<Rutas toggleTheme={toggleTheme} theme={theme}/>} />
        <Route path="/admin" element={<Admin theme={theme}/>} />
      </Routes>
    </Router>
  );
}

export default App;
