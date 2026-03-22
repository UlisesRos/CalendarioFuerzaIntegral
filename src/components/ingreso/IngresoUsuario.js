import React, { useState } from "react";
import axios from "axios";
import { Box, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

// ─── Utilidad de Sonido (Web Audio API) ───────────────────────────────────────
const playSound = (type) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        if (type === 'success') {
            // Sonido agradable de doble tono (Campana/Chime)
            const playNote = (freq, startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.5, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            const now = ctx.currentTime;
            playNote(523.25, now, 0.4); // C5
            playNote(659.25, now + 0.15, 0.6); // E5
        } else if (type === 'error') {
            // Sonido de error/alarma (Buzzer)
            const playBuzzer = (startTime, duration) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, startTime);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
                gain.gain.linearRampToValueAtTime(0, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            const now = ctx.currentTime;
            playBuzzer(now, 0.2);
            playBuzzer(now + 0.25, 0.3);
        }
    } catch (e) {
        console.error("Audio Web API no soportada", e);
    }
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const ingresoStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes resultIn {
        from { opacity: 0; transform: translateY(12px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
    }
    @keyframes successPulse {
        0%   { box-shadow: 0 0 0 0 rgba(104,211,145,0.4); }
        70%  { box-shadow: 0 0 0 12px rgba(104,211,145,0); }
        100% { box-shadow: 0 0 0 0 rgba(104,211,145,0); }
    }
    @keyframes errorPulse {
        0%   { box-shadow: 0 0 0 0 rgba(252,129,129,0.4); }
        70%  { box-shadow: 0 0 0 12px rgba(252,129,129,0); }
        100% { box-shadow: 0 0 0 0 rgba(252,129,129,0); }
    }

    .ing-header  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .ing-panel   { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
    .ing-result  { animation: resultIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }

    .ing-input {
        font-family: 'Poppins', sans-serif;
        font-size: 1.1rem;
        font-weight: 500;
        letter-spacing: 0.12em;
        border-radius: 12px;
        padding: 14px 18px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        text-align: center;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
    }
    .ing-input:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 2px rgba(104,211,145,0.2);
    }
    .ing-input::placeholder {
        color: rgba(160,174,192,0.6);
        font-size: 0.85rem;
        letter-spacing: 0.05em;
        font-weight: 400;
    }

    .ing-verify-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 12px;
        padding: 14px 28px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .ing-verify-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(104,211,145,0.4);
    }
    .ing-verify-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`

// ─── Componente de resultado ──────────────────────────────────────────────────
function ResultCard({ username, userlastname, mensaje, diasRestantes, diasEntrenamiento, isDark, resultStatus }) {
    const isSuccess = resultStatus === 'success';
    const accentColor = isSuccess ? '#68D391' : '#FC8181'
    const accentBg = isSuccess ? 'rgba(104,211,145,0.07)' : 'rgba(252,129,129,0.06)'
    const accentBorder = isSuccess ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.25)'
    const pulseAnim = isSuccess ? 'successPulse 1.2s ease 0.3s 1' : 'errorPulse 1.2s ease 0.3s 1'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'

    return (
        <Box
            className="ing-result"
            w="100%"
            bg={accentBg}
            border="1px solid"
            borderColor={accentBorder}
            borderRadius="14px"
            p={['18px', '22px']}
            style={{ animation: `resultIn 0.5s cubic-bezier(0.22,1,0.36,1) both, ${pulseAnim}` }}
        >
            {/* Indicador */}
            <Flex alignItems="center" gap="8px" mb="14px">
                <Box
                    w="8px" h="8px"
                    borderRadius="full"
                    bg={accentColor}
                    flexShrink={0}
                />
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.68rem"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    fontWeight="600"
                    color={accentColor}
                >
                    {isSuccess ? 'Acceso verificado' : 'Acceso denegado'}
                </Text>
            </Flex>

            {/* Nombre bienvenida */}
            {username && (
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.4rem', '1.7rem']}
                    fontWeight="900"
                    color={textMain}
                    lineHeight="1.15"
                    mb="6px"
                    textTransform="capitalize"
                >
                    {isSuccess ? `¡Bienvenido/a, ${username} ${userlastname}!` : `Hola, ${username} ${userlastname}`}
                </Heading>
            )}

            {/* Mensaje */}
            <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.85rem"
                color={isSuccess ? textMuted : '#FC8181'}
                lineHeight="1.6"
                mb={isSuccess && diasRestantes > 0 ? '16px' : '0'}
            >
                {mensaje}
            </Text>

            {/* Info de días */}
            {isSuccess && diasRestantes > 0 && diasEntrenamiento > 0 && (
                <>
                    <Box h="1px" bg={accentBorder} mb="16px" />
                    <Flex gap={['10px', '16px']} flexDir={['column', 'row']}>
                        {/* Días restantes */}
                        <Box
                            flex="1"
                            bg={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'}
                            border="1px solid"
                            borderColor={accentBorder}
                            borderRadius="10px"
                            p="14px 16px"
                        >
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.65rem"
                                letterSpacing="0.15em"
                                textTransform="uppercase"
                                color={textMuted}
                                mb="6px"
                            >
                                Días restantes
                            </Text>
                            <Text
                                fontFamily='"Playfair Display", serif'
                                fontSize="2rem"
                                fontWeight="900"
                                color={accentColor}
                                lineHeight="1"
                            >
                                {diasRestantes}
                            </Text>
                        </Box>

                        {/* Días de entrenamiento */}
                        <Box
                            flex="1"
                            bg={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'}
                            border="1px solid"
                            borderColor={accentBorder}
                            borderRadius="10px"
                            p="14px 16px"
                        >
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.65rem"
                                letterSpacing="0.15em"
                                textTransform="uppercase"
                                color={textMuted}
                                mb="6px"
                            >
                                Días de entrenamiento
                            </Text>
                            <Text
                                fontFamily='"Playfair Display", serif'
                                fontSize="2rem"
                                fontWeight="900"
                                color={textMain}
                                lineHeight="1"
                            >
                                {diasEntrenamiento}
                            </Text>
                        </Box>
                    </Flex>
                </>
            )}
        </Box>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
const IngresoUsuario = ({ theme, apiUrl }) => {
    const [documento, setDocumento] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [diasRestantes, setDiasRestantes] = useState(0)
    const [diasEntrenamiento, setDiasEntrenamiento] = useState(0)
    const [username, setUsername] = useState('')
    const [userlastname, setUserlastname] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [resultStatus, setResultStatus] = useState(null)
    const toast = useToast()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'

    const resetResult = () => {
        setShowResult(false)
        setMensaje("")
        setDiasRestantes(0)
        setDiasEntrenamiento(0)
        setUsername("")
        setUserlastname("")
        setResultStatus(null)
    }

    const verificarCliente = async () => {
        resetResult()

        if (!documento.trim()) {
            toast({
                id: "documento-vacio",
                title: "Error",
                description: "Por favor, ingresá un número de documento.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/ingresousuario`, { documento })

            // En caso de que el backend devolviera status 200 pero fuera un yaIngresado
            // (En este caso el backend actual devuelve 400 y entra en el catch, pero por seguridad)
            if (response.data.yaIngresadoHoy) {
                playSound('error');
                setMensaje("Ya ingresaste hoy al gimnasio.")
                setUsername(response.data.username || "")
                setUserlastname(response.data.userlastname || "")
                setResultStatus('error')
                setShowResult(true)
                toast({
                    id: "ya-ingresado",
                    title: "Ya ingresaste hoy",
                    description: "No podés registrar otro ingreso el mismo día.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            } else {
                playSound('success');
                setMensaje(response.data.msg)
                setDiasRestantes(response.data.diasRestantes)
                setDiasEntrenamiento(response.data.diasEntrenamiento)
                setUsername(response.data.username)
                setUserlastname(response.data.userlastname)
                setResultStatus('success')
                setShowResult(true)

                toast({
                    id: "verificacion-exitosa",
                    title: "¡Acceso confirmado!",
                    description: "Podés ingresar al gimnasio.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
                setDocumento("")
            }
        } catch (error) {
            playSound('error');
            const errorMessage = error.response?.data?.msg || "Ocurrió un error al verificar el cliente."
            setMensaje(errorMessage)
            
            // Atrapamos posibles datos de usuario en caso de estar fuera de fecha de pago etc.
            if (error.response?.data?.username) {
                setUsername(error.response.data.username)
                setUserlastname(error.response.data.userlastname)
            }

            setResultStatus('error')
            setShowResult(true)
            toast({
                id: "verificacion-fallida",
                title: "Verificación fallida",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') verificarCliente()
    }

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{ingresoStyles}</style>

            {/* ── Header ── */}
            <Box className="ing-header" w="100%" maxW="480px" mb={['24px', '36px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Control de acceso
                    </Text>
                </Flex>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                >
                    Ingreso de Usuario
                </Heading>
                <Text
                    mt="8px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                    lineHeight="1.6"
                >
                    Ingresá el número de documento para verificar el acceso al gimnasio.
                </Text>
            </Box>

            {/* ── Panel de verificación ── */}
            <Box
                className="ing-panel"
                w="100%"
                maxW="480px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['20px', '28px', '32px']}
                mb="20px"
            >
                <Flex alignItems="center" gap="10px" mb="20px">
                    <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color={textMuted}
                    >
                        Verificar documento
                    </Text>
                </Flex>

                <Box display="flex" flexDir="column" gap="14px">
                    {/* Input DNI */}
                    <input
                        className="ing-input"
                        type="text"
                        value={documento}
                        onChange={(e) => {
                            setDocumento(e.target.value)
                            if (showResult) resetResult()
                        }}
                        onKeyDown={handleEnter}
                        placeholder="Número de documento"
                        style={{ background: inputBg, color: inputColor }}
                        autoFocus
                    />

                    {/* Botón verificar */}
                    <button
                        className="ing-verify-btn"
                        onClick={verificarCliente}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="sm" color="white" thickness="2px" />
                                Verificando...
                            </>
                        ) : (
                            'Verificar acceso'
                        )}
                    </button>
                </Box>
            </Box>

            {/* ── Resultado ── */}
            {showResult && mensaje && (
                <Box w="100%" maxW="480px">
                    <ResultCard
                        username={username}
                        userlastname={userlastname}
                        mensaje={mensaje}
                        diasRestantes={diasRestantes}
                        diasEntrenamiento={diasEntrenamiento}
                        isDark={isDark}
                        resultStatus={resultStatus}
                    />
                </Box>
            )}
        </Box>
    )
}

export default IngresoUsuario