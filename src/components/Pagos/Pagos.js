import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Heading, Text, Spinner } from '@chakra-ui/react';
import { Box, Flex, Heading, Text, Spinner } from '@chakra-ui/react';

// ─── Estilos ──────────────────────────────────────────────────────────────────
const pagosStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pricePulse {
        0%   { box-shadow: 0 0 0 0 rgba(104,211,145,0.4); }
        70%  { box-shadow: 0 0 0 14px rgba(104,211,145,0); }
        100% { box-shadow: 0 0 0 0 rgba(104,211,145,0); }
    }

    .pag-header  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .pag-card    { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
    .pag-price   { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.14s both; }
    .pag-btn-wrap { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both; }

    .pag-pay-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.92rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 14px;
        padding: 15px 36px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .pag-pay-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(104,211,145,0.45);
    }
    .pag-pay-btn:active:not(:disabled) {
        transform: translateY(0);
    }
    .pag-pay-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .pag-mp-logo {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(160,174,192,0.6);
        margin-top: 12px;
        justify-content: center;
        width: 100%;
    }
`

function Pagos({ theme, userData, apiUrl }) {
    const [loading, setLoading] = useState(false)
    const [config, setConfig] = useState({ precios: null, descuento: 0 })

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'

    useEffect(() => {
        if (!userData) console.error("userData no está disponible")
    }, [userData])

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
    const precioFinal = userData.descuento
        ? precioBase - precioBase * config.descuento
        : precioBase
    const precioMostrar = precioBase
        ? `$ ${precioFinal.toLocaleString('es-ES')}`
        : '$ —'

    const handlePayment = async () => {
        if (!userData) return
        setLoading(true)
        try {
            const data = {
                name: userData.username,
                lastname: userData.userlastname,
                days: parseInt(userData.diasentrenamiento, 10),
                descuento: userData.descuento,
                userId: userData._id,
            }
            const response = await axios.post(`${apiUrl}/api/payments/create_preference`, data)
            window.location.href = response.data.init_point
        } catch (error) {
            console.error('Error al procesar el pago:', error)
            alert('Hubo un error al procesar el pago. Intentalo de nuevo.')
        } finally {
            setLoading(false)
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
            <style>{pagosStyles}</style>

            {/* ── Header ── */}
            <Box className="pag-header" w="100%" maxW="480px" mb={['24px', '32px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Cuota mensual
                    </Text>
                </Flex>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                    textTransform="capitalize"
                >
                    ¡Hola, {userData.username}!
                </Heading>
                <Text
                    mt="8px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                    lineHeight="1.6"
                >
                    Acá podés abonar tu cuota mensual por los {userData.diasentrenamiento} días de entrenamiento.
                </Text>
            </Box>

            {/* ── Card resumen ── */}
            <Box
                className="pag-card"
                w="100%" maxW="480px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['18px', '24px']}
                mb="16px"
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
                        Detalle del plan
                    </Text>
                </Flex>

                <Box display="flex" flexDir="column" gap="0">
                    {/* Fila: días */}
                    {[
                        { label: 'Días de entrenamiento', value: `${userData.diasentrenamiento} días por semana` },
                        { label: 'Modalidad', value: 'Entrenamiento de fuerza' },
                    ].map(({ label, value }, i, arr) => (
                        <Flex
                            key={label}
                            justifyContent="space-between"
                            alignItems="center"
                            py="12px"
                            borderBottom={i < arr.length - 1 ? '1px solid' : 'none'}
                            borderColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(104,211,145,0.1)'}
                        >
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.8rem"
                                color={textMuted}
                            >
                                {label}
                            </Text>
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.85rem"
                                fontWeight="500"
                                color={textMain}
                            >
                                {value}
                            </Text>
                        </Flex>
                    ))}
                </Box>

                {/* Descuento */}
                {userData.descuento && (
                    <Box
                        mt="14px"
                        p="12px 14px"
                        bg="rgba(104,211,145,0.08)"
                        border="1px solid rgba(104,211,145,0.25)"
                        borderRadius="10px"
                    >
                        <Flex alignItems="center" gap="8px">
                            <Box w="6px" h="6px" borderRadius="full" bg="green.400" flexShrink={0} />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.8rem"
                                color="#68D391"
                                fontWeight="500"
                            >
                                10% de descuento aplicado — {userData.descuento}
                            </Text>
                        </Flex>
                    </Box>
                )}
            </Box>

            {/* ── Precio ── */}
            <Box
                className="pag-price"
                w="100%" maxW="480px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['18px', '24px']}
                mb="16px"
                textAlign="center"
                style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.14s both, pricePulse 1s ease 0.7s 1' }}
            >
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.68rem"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    color={textMuted}
                    mb="10px"
                >
                    Importe a pagar
                </Text>
                <Text
                    fontFamily='"Playfair Display", serif'
                    fontSize={['2.8rem', '3.5rem']}
                    fontWeight="900"
                    color="#68D391"
                    lineHeight="1"
                    letterSpacing="-0.02em"
                >
                    {precioMostrar}
                </Text>
                {userData.descuento && (
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.75rem"
                        color={textMuted}
                        mt="8px"
                        style={{ textDecoration: 'line-through' }}
                    >
                        Precio base: $ {precioBase.toLocaleString('es-ES')}
                    </Text>
                )}
            </Box>

            {/* ── Botón pagar ── */}
            <Box className="pag-btn-wrap" w="100%" maxW="480px">
                <button
                    className="pag-pay-btn"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" color="gray.800" thickness="2px" />
                            Procesando...
                        </>
                    ) : (
                        <>
                            Ir a pagar
                            <span style={{ fontSize: '1.1rem' }}>→</span>
                        </>
                    )}
                </button>

                {/* Powered by MP */}
                <div className="pag-mp-logo">
                    <span>🔒</span>
                    Pago seguro via Mercado Pago
                </div>
            </Box>
        </Box>
    )
}

export default Pagos