import { Box, Flex, Heading, Text } from "@chakra-ui/react"
import { useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'

// ─── Estilos ──────────────────────────────────────────────────────────────────
const novedadesStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .nov-header  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .nov-panel   { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }

    .nov-input, .nov-textarea {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        border-radius: 10px;
        padding: 10px 14px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
    }
    .nov-input:focus, .nov-textarea:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }
    .nov-input::placeholder, .nov-textarea::placeholder {
        color: rgba(160,174,192,0.7);
        font-size: 0.82rem;
    }
    .nov-textarea {
        resize: vertical;
        min-height: 110px;
        line-height: 1.6;
    }

    .nov-save-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 11px 28px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .nov-save-btn:hover {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }

    .nov-reset-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 24px;
        border: 1px solid rgba(252,129,129,0.4);
        color: #FC8181;
        background: rgba(252,129,129,0.06);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .nov-reset-btn:hover {
        background: rgba(252,129,129,0.12);
        border-color: #FC8181;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .nov-char-count {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        color: rgba(160,174,192,0.6);
        text-align: right;
        margin-top: 4px;
    }
`

const toast = (icon, title) => Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false,
    timer: 3000, timerProgressBar: true, color: 'black',
    didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
}).fire({ icon, title })

function Novedades({ theme, apiUrl }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.85)' : '#2D3748'

    const handleSave = async () => {
        if (!title.trim()) {
            toast('warning', 'El título es obligatorio')
            return
        }
        try {
            await axios.post(`${apiUrl}/api/save-modal-content`, {
                title, subtitle: '', link: '', image: '', description
            })
            toast('success', '¡Novedad publicada correctamente!')
            setTitle('')
            setDescription('')
        } catch (error) {
            console.error('Error al guardar los datos del modal', error)
            toast('error', 'Error al guardar la novedad')
        }
    }

    const handleReset = async () => {
        try {
            await axios.post(`${apiUrl}/api/save-modal-content`, {
                title: '', subtitle: '', link: '', image: '', description: ''
            })
            toast('warning', 'El aviso de novedades fue quitado')
        } catch (error) {
            console.error('Error al guardar los datos del modal', error)
        }
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
            <style>{novedadesStyles}</style>

            {/* ── Header ── */}
            <Box className="nov-header" w="100%" maxW="600px" mb={['24px', '36px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Panel de administración
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
                    Novedades
                </Heading>
                <Text
                    mt="8px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                    lineHeight="1.6"
                >
                    Lo que publiques aparecerá como aviso flotante para todos los usuarios al ingresar.
                </Text>
            </Box>

            {/* ── Formulario ── */}
            <Box
                className="nov-panel"
                w="100%"
                maxW="600px"
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
                        Nueva novedad
                    </Text>
                </Flex>

                <Box display="flex" flexDir="column" gap="16px">
                    {/* Título */}
                    <Box>
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.75rem"
                            fontWeight="600"
                            letterSpacing="0.08em"
                            textTransform="uppercase"
                            color={textMuted}
                            mb="6px"
                        >
                            Título *
                        </Text>
                        <input
                            className="nov-input"
                            value={title}
                            placeholder="Ej: ¡Nueva clase de funcional!"
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={80}
                            style={{ background: inputBg, color: inputColor }}
                        />
                        <div className="nov-char-count">{title.length}/80</div>
                    </Box>

                    {/* Descripción */}
                    <Box>
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.75rem"
                            fontWeight="600"
                            letterSpacing="0.08em"
                            textTransform="uppercase"
                            color={textMuted}
                            mb="6px"
                        >
                            Descripción
                        </Text>
                        <textarea
                            className="nov-textarea"
                            value={description}
                            placeholder="Contá los detalles de la novedad..."
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={300}
                            style={{ background: inputBg, color: inputColor }}
                        />
                        <div className="nov-char-count">{description.length}/300</div>
                    </Box>

                    {/* Preview */}
                    {title && (
                        <Box
                            p="14px 16px"
                            bg={isDark ? 'rgba(104,211,145,0.06)' : 'rgba(104,211,145,0.05)'}
                            border="1px solid rgba(104,211,145,0.2)"
                            borderRadius="10px"
                        >
                            <Flex alignItems="center" gap="8px" mb="6px">
                                <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.65rem"
                                    letterSpacing="0.15em"
                                    textTransform="uppercase"
                                    color="green.400"
                                >
                                    Preview del aviso
                                </Text>
                            </Flex>
                            <Text
                                fontFamily='"Playfair Display", serif'
                                fontSize="0.95rem"
                                fontWeight="700"
                                color={textMain}
                                mb="2px"
                            >
                                {title}
                            </Text>
                            {description && (
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.78rem"
                                    color={textMuted}
                                    lineHeight="1.5"
                                >
                                    {description}
                                </Text>
                            )}
                        </Box>
                    )}

                    <button className="nov-save-btn" onClick={handleSave}>
                        Publicar novedad
                    </button>
                </Box>
            </Box>

            {/* ── Zona de peligro ── */}
            <Box
                w="100%"
                maxW="600px"
                bg="rgba(252,129,129,0.04)"
                border="1px solid rgba(252,129,129,0.2)"
                borderRadius="16px"
                p={['18px', '24px']}
            >
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="20px" h="2px" bg="#FC8181" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color="#FC8181"
                    >
                        Quitar aviso
                    </Text>
                </Flex>
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.82rem"
                    color={textMuted}
                    lineHeight="1.65"
                    mb="16px"
                >
                    Si no hay novedades activas, el aviso no aparecerá para los usuarios.
                </Text>
                <button className="nov-reset-btn" onClick={handleReset}>
                    Sin novedades
                </button>
            </Box>
        </Box>
    )
}

export default Novedades