import { Flex, Text, Box, Spinner, Link } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import SpotlightCard from './SpotlightCard'

// ─── Estilos ──────────────────────────────────────────────────────────────────
const transferenciaStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fieldIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .tr-header  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .tr-panel   { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }

    .tr-dato-row {
        animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }
    .tr-dato-row:nth-child(1) { animation-delay: 0.06s; }
    .tr-dato-row:nth-child(2) { animation-delay: 0.10s; }
    .tr-dato-row:nth-child(3) { animation-delay: 0.14s; }

    .tr-copy-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 6px;
        padding: 4px 10px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: transparent;
        transition: all 0.2s ease;
        white-space: nowrap;
        flex-shrink: 0;
    }
    .tr-copy-btn:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
    }
    .tr-copy-btn.copied {
        color: white;
        background: #68D391;
        border-color: #68D391;
    }

    .tr-whatsapp-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 12px;
        padding: 13px 24px;
        border: none;
        color: white;
        background: #25D366;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        text-decoration: none;
    }
    .tr-whatsapp-btn:hover {
        background: #1fa952;
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(37,211,102,0.35);
    }
`

// ─── CopyField: campo con botón de copiar ─────────────────────────────────────
function CopyField({ label, value, mono, isDark }) {
    const [copied, setCopied] = useState(false)
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const fieldBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(104,211,145,0.04)'
    const fieldBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(104,211,145,0.2)'

    const handleCopy = () => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="tr-dato-row" style={{ width: '100%' }}>
            <span style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: textMuted,
                display: 'block',
                marginBottom: '6px',
            }}>
                {label}
            </span>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: fieldBg,
                border: `1px solid ${fieldBorder}`,
                borderRadius: '10px',
                padding: '10px 14px',
            }}>
                <span style={{
                    fontFamily: mono ? "'Courier New', monospace" : "'Poppins', sans-serif",
                    fontSize: mono ? '0.82rem' : '0.88rem',
                    fontWeight: 500,
                    color: textMain,
                    flex: 1,
                    wordBreak: 'break-all',
                    letterSpacing: mono ? '0.05em' : 'normal',
                }}>
                    {value}
                </span>
                <button
                    className={`tr-copy-btn${copied ? ' copied' : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? '✓ Copiado' : 'Copiar'}
                </button>
            </div>
        </div>
    )
}

// ─── Transferencia ────────────────────────────────────────────────────────────
function Transferencia({ theme, userData, apiUrl }) {
    const [config, setConfig] = useState({ precios: null, descuento: 0 })
    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/config/precios`)
                setConfig(response.data)
            } catch (error) {
                console.error("Error fetching config", error)
            }
        }
        if (apiUrl) fetchConfig()
    }, [apiUrl])

    if (!userData || !config.precios) {
        return (
            <Flex w="100%" h="70vh" align="center" justify="center" flexDir="column" gap="12px">
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                    Cargando...
                </Text>
                <Spinner size="lg" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    const precioBase = config.precios[userData.diasentrenamiento] || 0
    const precioFinal = userData.descuento ? precioBase - precioBase * config.descuento : precioBase
    const precioMostrar = precioBase ? `$ ${precioFinal.toLocaleString('es-ES')}` : '$ —'

    const whatsappUrl = `https://api.whatsapp.com/send?phone=3416948109&text=Hola! Mi nombre es ${userData.username} ${userData.userlastname}. Te envio el comprobante de pago de este mes!`

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{transferenciaStyles}</style>

            {/* ── Header ── */}
            <Box className="tr-header" w="100%" maxW="520px" mb={['24px', '32px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Pago por transferencia
                    </Text>
                </Flex>
                <Text
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                    as="h1"
                >
                    Datos bancarios
                </Text>
                <Text
                    mt="8px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                    lineHeight="1.6"
                >
                    Usá estos datos para realizar tu transferencia. Después envianos el comprobante por WhatsApp.
                </Text>
            </Box>

            <Box w="100%" maxW="520px" display="flex" flexDir="column" gap="14px">

                {/* ── Datos bancarios ── */}
                <Box
                    className="tr-panel"
                    bg={panelBg}
                    border="1px solid"
                    borderColor={borderC}
                    borderRadius="16px"
                    p={['18px', '24px']}
                >
                    <Flex alignItems="center" gap="10px" mb="18px">
                        <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color={textMuted}
                        >
                            Cuenta bancaria
                        </Text>
                    </Flex>

                    <Box display="flex" flexDir="column" gap="12px">
                        <CopyField label="Alias" value="fzabaseintegral" isDark={isDark} />
                        <CopyField label="Titular" value="Manuel Mariano Martino" isDark={isDark} />
                        <CopyField label="N° de cuenta" value="0000003100035185326089" isDark={isDark} mono />
                    </Box>
                </Box>

                {/* ── Resumen del pago ── */}
                <Box
                    bg={panelBg}
                    border="1px solid"
                    borderColor={borderC}
                    borderRadius="16px"
                    p={['18px', '24px']}
                    style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.12s both' }}
                >
                    <Flex alignItems="center" gap="10px" mb="16px">
                        <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color={textMuted}
                        >
                            Resumen
                        </Text>
                    </Flex>

                    <Flex gap="12px" flexDir={['column', 'row']}>
                        {/* Importe */}
                        <Box
                            flex="1"
                            bg={isDark ? 'rgba(104,211,145,0.06)' : 'rgba(104,211,145,0.05)'}
                            border="1px solid rgba(104,211,145,0.2)"
                            borderRadius="12px"
                            p="16px"
                            textAlign="center"
                        >
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.65rem"
                                letterSpacing="0.15em"
                                textTransform="uppercase"
                                color={textMuted}
                                mb="6px"
                            >
                                Importe a pagar
                            </Text>
                            <Text
                                fontFamily='"Playfair Display", serif'
                                fontSize="1.9rem"
                                fontWeight="900"
                                color="#68D391"
                                lineHeight="1"
                            >
                                {precioMostrar}
                            </Text>
                            {userData.descuento && (
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.7rem"
                                    color={textMuted}
                                    mt="4px"
                                    style={{ textDecoration: 'line-through' }}
                                >
                                    $ {precioBase.toLocaleString('es-ES')}
                                </Text>
                            )}
                        </Box>

                        {/* Días */}
                        <Box
                            flex="1"
                            bg={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
                            border="1px solid"
                            borderColor={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'}
                            borderRadius="12px"
                            p="16px"
                            textAlign="center"
                        >
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.65rem"
                                letterSpacing="0.15em"
                                textTransform="uppercase"
                                color={textMuted}
                                mb="6px"
                            >
                                Días por semana
                            </Text>
                            <Text
                                fontFamily='"Playfair Display", serif'
                                fontSize="1.9rem"
                                fontWeight="900"
                                color={textMain}
                                lineHeight="1"
                            >
                                {userData.diasentrenamiento}
                            </Text>
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.7rem"
                                color={textMuted}
                                mt="4px"
                            >
                                días de entrenamiento
                            </Text>
                        </Box>
                    </Flex>

                    {/* Descuento badge */}
                    {userData.descuento && (
                        <Box
                            mt="12px"
                            p="10px 14px"
                            bg="rgba(104,211,145,0.08)"
                            border="1px solid rgba(104,211,145,0.25)"
                            borderRadius="10px"
                        >
                            <Flex alignItems="center" gap="8px">
                                <Box w="6px" h="6px" borderRadius="full" bg="green.400" flexShrink={0} />
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.78rem"
                                    color="#68D391"
                                    fontWeight="500"
                                >
                                    10% de descuento aplicado — {userData.descuento}
                                </Text>
                            </Flex>
                        </Box>
                    )}
                </Box>

                {/* ── Aviso + WhatsApp ── */}
                <Box
                    bg="rgba(252,129,129,0.05)"
                    border="1px solid rgba(252,129,129,0.25)"
                    borderRadius="16px"
                    p={['18px', '22px']}
                    style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.18s both' }}
                >
                    <Flex alignItems="center" gap="10px" mb="12px">
                        <Box w="20px" h="2px" bg="#FC8181" borderRadius="full" />
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color="#FC8181"
                        >
                            Importante
                        </Text>
                    </Flex>
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.85rem"
                        color={textMuted}
                        lineHeight="1.7"
                        mb="16px"
                    >
                        Después de realizar la transferencia, <span style={{ color: textMain, fontWeight: 600 }}>envianos el comprobante por WhatsApp</span> para confirmar tu pago.
                    </Text>

                    <Link
                        href={whatsappUrl}
                        target="_blank"
                        _hover={{ textDecoration: 'none' }}
                    >
                        <button className="tr-whatsapp-btn">
                            <span style={{ fontSize: '1.15rem' }}>📲</span>
                            Enviar comprobante por WhatsApp
                        </button>
                    </Link>
                </Box>

            </Box>
        </Box>
    )
}

export default Transferencia