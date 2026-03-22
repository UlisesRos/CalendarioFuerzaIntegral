import { Box, Flex, Heading, Image, Text, Spinner } from '@chakra-ui/react'
import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import manu from '../../img/manuu.png'
import juli from '../../img/julii.png'
import flor from '../../img/flor.png'
import vicky from '../../img/vicky.png'

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(phrases, typingSpeed = 80, deletingSpeed = 40, pause = 2000) {
    const [displayText, setDisplayText] = useState('')
    const [phraseIndex, setPhraseIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isPaused, setIsPaused] = useState(false)

    useEffect(() => {
        if (isPaused) return
        const currentPhrase = phrases[phraseIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (charIndex < currentPhrase.length) {
                    setDisplayText(currentPhrase.slice(0, charIndex + 1))
                    setCharIndex(c => c + 1)
                } else {
                    setIsPaused(true)
                    setTimeout(() => { setIsPaused(false); setIsDeleting(true) }, pause)
                }
            } else {
                if (charIndex > 0) {
                    setDisplayText(currentPhrase.slice(0, charIndex - 1))
                    setCharIndex(c => c - 1)
                } else {
                    setIsDeleting(false)
                    setPhraseIndex(i => (i + 1) % phrases.length)
                }
            }
        }, isDeleting ? deletingSpeed : typingSpeed)
        return () => clearTimeout(timeout)
    }, [charIndex, isDeleting, isPaused, phraseIndex, phrases, typingSpeed, deletingSpeed, pause])

    return displayText
}

// ─── Estilos globales ─────────────────────────────────────────────────────────
const globalStyles = `
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
    }
    @keyframes cardReveal {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes modalBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes modalPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
    }
    @keyframes modalPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .trainer-card {
        animation: cardReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .trainer-card:nth-child(1) { animation-delay: 0.05s; }
    .trainer-card:nth-child(2) { animation-delay: 0.15s; }
    .trainer-card:nth-child(3) { animation-delay: 0.25s; }
    .trainer-card:nth-child(4) { animation-delay: 0.35s; }

    .trainer-card .card-photo {
        transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.5s ease;
        filter: grayscale(60%);
    }
    .trainer-card:hover .card-photo {
        transform: scale(1.06);
        filter: grayscale(0%);
    }
    .trainer-card:hover .card-overlay {
        opacity: 0.55;
    }
    .card-overlay {
        transition: opacity 0.5s ease;
        opacity: 0.25;
    }

    .accent-bar {
        transition: height 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        height: 3px;
    }
    .trainer-card:hover .accent-bar {
        height: 100%;
    }

    /* Modal */
    .modal-backdrop {
        animation: modalBackdropIn 0.3s ease both;
    }
    @media (min-width: 600px) {
        .modal-panel {
            animation: modalPanelIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
    }
    @media (max-width: 599px) {
        .modal-panel {
            animation: modalPanelInMobile 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
    }
`

function TrainerModal({ trainer, onClose }) {
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <Box
            className="modal-backdrop"
            position="fixed"
            inset="0"
            zIndex="1000"
            bg="blackAlpha.700"
            display="flex"
            alignItems={['flex-end', 'center']}
            justifyContent="center"
            px={[0, '16px']}
            onClick={onClose}
            sx={{ backdropFilter: 'blur(6px)' }}
        >
            <Box
                className="modal-panel"
                onClick={(e) => e.stopPropagation()}
                position="relative"
                w={['100%', '480px', '540px']}
                maxH={['95vh', '90vh']}
                bg="gray.950"
                borderRadius={['24px 24px 0 0', '20px']}
                overflow="hidden"
                display="flex"
                flexDir="column"
            >
                {/* Handle mobile */}
                <Box
                    display={['block', 'none']}
                    position="absolute"
                    top="10px"
                    left="50%"
                    transform="translateX(-50%)"
                    w="36px"
                    h="4px"
                    bg="whiteAlpha.300"
                    borderRadius="full"
                    zIndex="20"
                />

                {/* Botón cerrar — siempre visible arriba */}
                <Box
                    position="absolute"
                    top="14px"
                    right="14px"
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    bg="blackAlpha.600"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={onClose}
                    zIndex="20"
                    sx={{ backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                    _hover={{ bg: 'blackAlpha.800' }}
                >
                    <Text color="white" fontSize="1.1rem" lineHeight="1" userSelect="none">✕</Text>
                </Box>

                {/* Scroll completo — foto + descripción juntas */}
                <Box
                    overflowY="auto"
                    flex="1"
                    sx={{
                        '&::-webkit-scrollbar': { width: '4px' },
                        '&::-webkit-scrollbar-track': { background: 'transparent' },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'var(--chakra-colors-green-700)',
                            borderRadius: '4px'
                        },
                    }}
                >
                    {/* Foto con aspect-ratio — se ve completa, sin corte */}
                    <Box
                        position="relative"
                        w="100%"
                        sx={{ aspectRatio: '4 / 5' }}
                        flexShrink={0}
                        overflow="hidden"
                    >
                        <Image
                            src={trainer.img}
                            alt={trainer.name}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            objectPosition="center top"
                        />
                        {/* Gradiente sutil en la parte inferior de la foto */}
                        <Box
                            position="absolute"
                            bottom="0"
                            left="0"
                            right="0"
                            h="55%"
                            bgGradient="linear(to-t, gray.950 0%, transparent 100%)"
                        />

                        {/* Nombre superpuesto sobre el gradiente */}
                        <Box
                            position="absolute"
                            bottom="20px"
                            left="24px"
                            right="60px"
                        >
                            <Box w="28px" h="2px" bg="green.400" borderRadius="full" mb="8px" />
                            <Heading
                                fontFamily='"Playfair Display", serif'
                                fontSize={['1.5rem', '1.9rem']}
                                fontWeight="900"
                                color="white"
                                lineHeight="1.1"
                            >
                                {trainer.name}
                            </Heading>
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.7rem"
                                letterSpacing="0.22em"
                                textTransform="uppercase"
                                color="green.400"
                                mt="4px"
                            >
                                {trainer.profesion}
                            </Text>
                        </Box>
                    </Box>

                    {/* Descripción */}
                    <Box
                        px={['20px', '28px']}
                        pt="20px"
                        pb="32px"
                        bg="gray.950"
                    >
                        {/* Separador decorativo */}
                        <Flex alignItems="center" gap="10px" mb="16px">
                            <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.68rem"
                                letterSpacing="0.22em"
                                textTransform="uppercase"
                                color="gray.500"
                            >
                                Sobre mí
                            </Text>
                        </Flex>
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize={['0.88rem', '0.95rem']}
                            color="gray.300"
                            lineHeight="1.85"
                        >
                            {trainer.desc}
                        </Text>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

// ─── TrainerCard ──────────────────────────────────────────────────────────────
function TrainerCard({ trainer, onClick }) {
    return (
        <Box
            className="trainer-card"
            onClick={onClick}
            cursor="pointer"
            position="relative"
            overflow="hidden"
            borderRadius="16px"
            bg="gray.900"
            sx={{ aspectRatio: '3 / 4' }}
            role="group"
        >
            {/* Barra verde izquierda */}
            <Box
                position="absolute"
                left="0" top="0" bottom="0"
                w="3px"
                zIndex="20"
                overflow="hidden"
            >
                <Box
                    className="accent-bar"
                    w="3px"
                    bg="green.400"
                    position="absolute"
                    bottom="0" left="0" right="0"
                />
            </Box>

            {/* Foto */}
            <Box position="absolute" inset="0" overflow="hidden">
                <Image
                    className="card-photo"
                    src={trainer.img}
                    alt={trainer.name}
                    w="100%" h="100%"
                    objectFit="cover"
                    objectPosition="top"
                />
                <Box
                    position="absolute"
                    inset="0"
                    bgGradient="linear(to-t, blackAlpha.800 0%, blackAlpha.200 45%, transparent 70%)"
                />
                <Box
                    className="card-overlay"
                    position="absolute"
                    inset="0"
                    bg="blackAlpha.600"
                />
            </Box>

            {/* Nombre abajo */}
            <Box
                position="absolute"
                bottom="0" left="0" right="0"
                zIndex="10"
                p={['12px', '18px']}
            >
                <Text
                    fontFamily='"Playfair Display", serif'
                    fontSize={['0.9rem', '1.05rem', '1.2rem']}
                    fontWeight="700"
                    color="white"
                    lineHeight="1.2"
                >
                    {trainer.name}
                </Text>
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize={['0.62rem', '0.68rem']}
                    color="green.300"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    mt="2px"
                >
                    {trainer.profesion}
                </Text>
            </Box>

            {/* Hint "ver más" — aparece en hover */}
            <Box
                position="absolute"
                top="12px" right="12px"
                zIndex="10"
                px="10px" py="5px"
                borderRadius="full"
                bg="blackAlpha.600"
                sx={{ backdropFilter: 'blur(4px)', transition: 'opacity 0.3s', opacity: 0 }}
                className="card-hint"
            >
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.62rem"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                    color="green.300"
                >
                    Ver perfil
                </Text>
            </Box>
        </Box>
    )
}

// ─── Home ─────────────────────────────────────────────────────────────────────
function Home({ userData }) {
    const [isLoading, setIsLoading] = useState(true)
    const [selectedTrainer, setSelectedTrainer] = useState(null)

    const PHRASES = ['FUERZA BASE', 'INTEGRAL', 'Entrenamiento', 'Resultados']
    const typedText = useTypewriter(PHRASES, 90, 45, 2200)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 100)
        return () => clearTimeout(timer)
    }, [])

    const trainers = [
        {
            id: 0, img: manu, name: 'Manuel Martino', profesion: 'Fundador/Profe',
            desc: 'Soy Manuel Martino, tengo 29 años. Me recibi en el ISEF 11 como profesor de Educación Física, preparador físico especialista en fútbol en APEFFA y especialista en el entrenamiento de la fuerza en GRUPO 757 y FEFA. Mi principal objetivo es que cada persona que llegue al gimnasio vivencie y obtenga los frutos que nos proporciona el entrenamiento de fuerza. Me representan dos frases: "Sé el profe que siempre quisiste tener" y "al relacionarte con un alma humana, sé apenas otra alma humana". Fanático de Messi, de los yuyos en el mate y del reggaeton.'
        },
        {
            id: 1, img: juli, name: 'Julian Atencio', profesion: 'Fundador/Profe',
            desc: 'Soy Julián Atencio, tengo 26 años. Recibido en el ISEF 11 como profesor de Educación Física, Licenciado en Actividad Física en la UGR, Preparador Físico de Futbol en FyP y Especialista en Entrenamiento de Fuerza en Grupo 757 y FEFA. Mi principal objetivo es que cada atleta alcance su máximo nivel en su deporte y que cada persona lleve una vida saludable a través del entrenamiento de fuerza. "No dejes nunca de luchar, el fracaso está en abandonar." Fanático de la música, el mate y el futbol.'
        },
        {
            id: 2, img: vicky, name: 'Victoria Mastromarino', profesion: 'Profesora',
            desc: 'Soy Victoria Mastromarino, tengo 23 años. Me recibí en el ISEF 11 como profesora de Educación Física y soy preparadora física en Grupo 757. Mi principal objetivo es que cada persona que llegue al gimnasio se sienta acompañada durante su proceso de entrenamiento y pueda entrenar de manera segura y confiada. Hay una frase que me representa: "Todos fuimos principiantes alguna vez." Fanática del café frío y de la música.'
        },
        {
            id: 3, img: flor, name: 'Florencia Payaro', profesion: 'Profesora',
            desc: 'Mi nombre es Florencia Payaro y tengo 28 años. Soy profesora de Educación Física recibida en el ISEF 11. Mi objetivo es que quienes vengan al gimnasio puedan vivenciar el entrenamiento de fuerza adaptado a sus necesidades y objetivos y que, sobre todo, puedan adquirir confianza en sí mismos a lo largo del proceso. Porque no, también contagiarlos para que hagan del entrenamiento un hábito fundamental en sus vidas. Les comparto dos frases relacionadas con el entrenamiento que me representan: "Arrancar liviano, progresar lento, ser extremadamente consistente" y "Lo realmente difícil, es hacerlo simple"'
        },
    ]

    // Agregá esto dentro del Home, justo antes del return o dentro del JSX

    // ─── Botón flotante de acceso rápido ─────────────────────────────────────────
    const fabStyles = `
    @keyframes fabIn {
        from { opacity: 0; transform: translateX(20px); }
        to   { opacity: 1; transform: translateX(0); }
    }

    .fab-wrapper {
        position: fixed;
        right: 20px;
        bottom: 32px;
        z-index: 500;
        display: flex;
        align-items: center;
        gap: 0px;
        animation: fabIn 0.5s cubic-bezier(0.22,1,0.36,1) 0.5s both;
    }

    .fab-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: white;
        background: #111827;
        border: 1px solid rgba(104,211,145,0.35);
        padding: 8px 14px;
        border-radius: 10px 0 0 10px;
        white-space: nowrap;
        max-width: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-width 0.4s cubic-bezier(0.22,1,0.36,1),
                    opacity 0.3s ease,
                    padding 0.3s ease;
        border-right: none;
        pointer-events: none;
    }

    .fab-btn {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: #68D391;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        box-shadow: 0 4px 20px rgba(104,211,145,0.4);
        flex-shrink: 0;
    }

    .fab-wrapper:hover .fab-btn {
        border-radius: 0 12px 12px 0;
        box-shadow: 0 8px 30px rgba(104,211,145,0.5);
        transform: translateY(-1px);
    }

    .fab-wrapper:hover .fab-label {
        max-width: 200px;
        opacity: 1;
        padding: 8px 14px;
    }

    .fab-icon {
        font-size: 1.2rem;
        line-height: 1;
        transition: transform 0.3s ease;
    }
    .fab-wrapper:hover .fab-icon {
        transform: scale(1.1);
    }
`

    return (
        <Flex justifyContent="center" flexDir="column" alignItems="center">
            <style>{globalStyles}</style>
            <style>{`.trainer-card:hover .card-hint { opacity: 1 !important; }`}</style>

            {isLoading ? (
                <Flex height="100vh" alignItems="center" justifyContent="center">
                    <Spinner size="xl" thickness="4px" speed="0.65s" color="green.400" />
                </Flex>
            ) : (
                <>
                    {/* ── HERO TYPEWRITER ── */}
                    <Box
                        w="100%"
                        minH={['140px', '220px', '300px']}
                        display="flex"
                        alignItems="center"
                        justifyContent="flex-start"
                        px={['24px', '48px', '80px']}
                        py={['32px', '52px']}
                        overflow="hidden"
                    >
                        <Box position="relative">
                            <Box
                                position="absolute"
                                left="-20px" top="8%" bottom="8%"
                                w="3px"
                                bg="green.400"
                                borderRadius="full"
                            />
                            <Heading
                                as="h1"
                                fontFamily='"Playfair Display", serif'
                                fontSize={['clamp(1.8rem, 8vw, 4rem)', 'clamp(3rem, 8vw, 7rem)', '9vw']}
                                fontWeight="900"
                                lineHeight="1.05"
                                letterSpacing="-0.02em"
                                color="black"
                                _dark={{ color: 'white' }}
                                whiteSpace="nowrap"
                                minH={['2.4rem', '5rem', '7rem']}
                            >
                                <Box as="span" color="green.400">{typedText}</Box>
                                <Box
                                    as="span"
                                    display="inline-block"
                                    w={['2px', '3px', '5px']}
                                    h={['1.8rem', '4rem', '6rem']}
                                    bg="green.400"
                                    ml="3px"
                                    verticalAlign="middle"
                                    style={{ animation: 'blink 1s step-end infinite' }}
                                />
                            </Heading>
                            <Text
                                mt={['6px', '10px']}
                                fontFamily='"Poppins", sans-serif'
                                fontSize={['0.7rem', '0.9rem', '1.1rem']}
                                fontWeight="400"
                                letterSpacing="0.25em"
                                textTransform="uppercase"
                                color="gray.500"
                            >
                                Entrenamiento · Fuerza · Resultados
                            </Text>
                        </Box>
                    </Box>

                    {/* ── GRID DE TRAINERS ── */}
                    <Box w="90%" mb="60px">
                        <Flex alignItems="center" gap="12px" mb={['20px', '28px']}>
                            <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize={['0.7rem', '0.8rem']}
                                fontWeight="400"
                                letterSpacing="0.25em"
                                textTransform="uppercase"
                                color="gray.500"
                            >
                                Nuestro equipo
                            </Text>
                        </Flex>

                        <Box
                            display="grid"
                            gridTemplateColumns={['1fr 1fr', '1fr 1fr', 'repeat(4, 1fr)']}
                            gap={['10px', '14px', '16px']}
                        >
                            {trainers.map((trainer) => (
                                <TrainerCard
                                    key={trainer.id}
                                    trainer={trainer}
                                    onClick={() => setSelectedTrainer(trainer)}
                                />
                            ))}
                        </Box>

                        <Text
                            display={['block', 'none']}
                            mt="14px"
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.15em"
                            textTransform="uppercase"
                            color="gray.400"
                            textAlign="center"
                        >
                            Tocá una tarjeta para ver el perfil
                        </Text>
                    </Box>

                    {/* ── MODAL ── */}
                    {selectedTrainer && (
                        <TrainerModal
                            trainer={selectedTrainer}
                            onClose={() => setSelectedTrainer(null)}
                        />
                    )}
                </>
            )}

            {/* ── BOTÓN FLOTANTE INGRESO USUARIOS ── */}
            <style>{fabStyles}</style>
            {/* ── FAB INGRESO USUARIOS — solo admin ── */}
            {userData?.role === 'admin' && (
                <Link to="/ingresousuario" style={{ textDecoration: 'none' }}>
                    <div className="fab-wrapper">
                        <div className="fab-label">
                            <span className="fab-label-inner">Ingreso de usuarios</span>
                        </div>
                        <button className="fab-btn" onClick={(e) => e.stopPropagation()}>
                            <span className="fab-icon">🔐</span>
                        </button>
                    </div>
                </Link>
            )}
        </Flex>
    )
}

export default Home