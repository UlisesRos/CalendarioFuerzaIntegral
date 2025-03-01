import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed }) => {
    const [displayedText, setDisplayedText] = useState(''); // Texto que se mostrará
    const [index, setIndex] = useState(0); // Índice del carácter actual

    const texto = text || ''

    useEffect(() => {
        if (index < texto.length) {
        // Crear un temporizador para añadir el siguiente carácter
        const timer = setTimeout(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            setIndex(index + 1);
        }, speed);

        // Limpiar el temporizador cuando el componente se desmonte o cambie el índice
        return () => clearTimeout(timer);
        }
    }, [index, text, speed]);

    return <span>{displayedText}</span>;
};

export default TypingEffect;