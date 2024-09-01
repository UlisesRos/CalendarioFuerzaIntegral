import { Flex } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Calendario from '../calendario/Calendario'
import Navbar from '../Navbar/Navbar'
import '../../css/Navbar.css'

function Rutas() {

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
        <Flex
            flexDir='column'
            >
            <Navbar toggleTheme={toggleTheme}/>
            <Calendario theme={theme}/>
        </Flex>
    )
}

export default Rutas