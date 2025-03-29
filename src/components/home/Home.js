import { Box, Flex, Heading, Image, Text, Spinner } from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react'
import anime from 'animejs'
import manu from '../../img/manuu.png'
import juli from '../../img/julii.png'
import 'animate.css'
import TrueFocus from './TrueFocus';

function Home() {
    const cardRefs = useRef([])
    const [activeCard, setActiveCard] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simula la carga de la página por 2 segundos
        setTimeout(() => {
            setIsLoading(false)

            // Animación de entrada con anime.js
            anime({
                targets: '.card',
                opacity: [0, 1],
                translateY: [50, 0],
                easing: 'easeOutExpo',
                duration: 1200,
                delay: anime.stagger(200)
            })
        }, 0)
    }, [])

    const cardVisible = (cardId) => setActiveCard(cardId)
    const cardInvisible = () => setActiveCard(null)

    return (
        <Flex justifyContent="center" flexDir="column" alignItems="center">
            {isLoading ? (
                <Flex height="100vh" alignItems="center" justifyContent="center">
                    <Spinner size="xl" thickness="4px" speed="0.65s" color="green.400" />
                </Flex>
            ) : (
            <>
                <Box
                    mt="30px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize={['2rem', '2.2rem', '2.6rem']}
                    w={['85%', '75%', '70%']}
                    textAlign="center"
                >
                    <TrueFocus 
                        sentence="Fuerza Base Integral"
                        manualMode={false}
                        blurAmount={5}
                        borderColor="green"
                        animationDuration={1}
                        pauseBetweenAnimations={1}
                        />
                </Box>
                <Text mt="28px" w="70%" textAlign="center">
                    Si buscas alcanzar tu mejor versión, te invitamos a que entrenes con nosotros! 🏋🏻‍♂️
                </Text>
                <Text w="70%" textAlign="center">
                    ¿Qué esperas para conocernos? ¡Te esperamos! 🫡
                </Text>

                <Flex
                    flexDir={['column', 'column', 'row']}
                    m="50px 0"
                    w="90%"
                    justifyContent="space-around"
                    alignItems={['center', 'center', 'start']}
                    rowGap="40px"
                >
                    {[ 
                        { id: 1, img: manu, name: 'Manuel Mariano Martino', desc: 'Soy Manuel Martino, tengo 28 años. Me recibi en el ISEF 11 como profesor de Educación Física, preparador físico especialista en fútbol en APEFFA y especialista en el entrenamiento de la fuerza en GRUPO 757 y FEFA. 📚. Mi principal objetivo es que cada persona que llegue al gimnasio vivencie y obtenga los frutos que nos proporciona el entrenamiento de fuerza. 💪🏾. Me representan dos frases y se las quiero compartir: “Sé el profe que siempre quisiste tener” “Conozca todas las teorías, domine todas las técnicas, pero al relacionarte con un alma humana, sé apenas otra alma humana” 🫂. Fanático de Messi, de los yuyos en el mate y del reggaeton. 🧉🇦🇷🎶', anim: 'animate__animated animate__fadeInTopLeft' }, 
                        { id: 2, img: juli, name: 'Julian Atencio', desc: 'Soy Julián Atencio, tengo 25 años. Recibido en el ISEF 11 como profesor de Educación Física, Licenciado en Actividad Física en la UGR, Preparador Físico de Futbol en FyP Y Especialista en Entrenamiento de Fuerza en Grupo 757 y FEFA. 📚. Mi principal objetivo es que cada atleta alcance su máximo nivel en su deporte. Y también que cada persona lleve una vida saludable a través del entrenamiento de fuerza ⚡️. Mis frases favoritas son “No dejes nunca de luchar, el fracaso esta en abandonar” y “La mejor enseñanza que podemos dar como entrenadores, es que aquellos que nos confían, crean en si mismo”🙅🏽‍♂️. Fanático de la música, el mate y el futbol.🎸🧉⚽️', anim: 'animate__animated animate__fadeInTopRight' }
                    ].map((trainer, index) => (
                        <Box
                            className={trainer.anim}
                            key={trainer.id}
                            ref={(el) => (cardRefs.current[index] = el)}
                            borderRadius="8px"
                            border="solid black 1px"
                            w={['auto', 'auto', '400px']}
                            display="flex"
                            flexDir="column"
                            justifyContent="center"
                            alignItems="center"
                            onMouseEnter={() => cardVisible(trainer.id)}
                            onMouseLeave={cardInvisible}
                            transition="box-shadow 0.3s ease"
                            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1), 0px 12px 24px rgba(0, 0, 0, 0.05)"
                            _hover={{
                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2), 0px 16px 32px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Image mt="10px" src={trainer.img} alt={`Imagen de ${trainer.name}`} objectFit="cover" w="350px" h="350px" />
                            <Heading fontFamily="poppins" fontWeight="semibold" textAlign="center" fontSize="1.5rem">
                                {trainer.name}
                            </Heading>
                            <Text
                                mt="15px"
                                mb="20px"
                                visibility={activeCard === trainer.id ? 'visible' : 'hidden'}
                                opacity={activeCard === trainer.id ? 1 : 0}
                                transition="opacity 0.7s ease, max-height 0.7s ease"
                                textAlign="center"
                                w="90%"
                                maxH={activeCard === trainer.id ? '500px' : '0px'}
                                overflow="hidden"
                                className={activeCard === trainer.id ? `animate__animated animate__zoomIn` : ''}
                            >
                                {trainer.desc}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </>
            )}
        </Flex>
    )
}

export default Home
