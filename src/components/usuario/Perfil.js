import React, { useEffect } from 'react'
import HistorialPagosUs from './HistorialPagosUs'
import { Box, Flex, Heading, Text, Spinner } from '@chakra-ui/react'

// ─── Estilos ──────────────────────────────────────────────────────────────────
const perfilStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fieldIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .pf-header  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .pf-card    { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }

    .pf-info-row {
        animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 12px 0;
    }
    .pf-info-row:nth-child(1) { animation-delay: 0.06s; }
    .pf-info-row:nth-child(2) { animation-delay: 0.10s; }
    .pf-info-row:nth-child(3) { animation-delay: 0.14s; }
    .pf-info-row:nth-child(4) { animation-delay: 0.18s; }
`

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, accent, isDark }) {
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'

    return (
        <div className="pf-info-row" style={{
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(104,211,145,0.12)'}`,
        }}>
            {/* Icono */}
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(104,211,145,0.08)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(104,211,145,0.2)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
            }}>
                {icon}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: textMuted,
                    display: 'block',
                    marginBottom: '2px',
                }}>
                    {label}
                </span>
                <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: accent || textMain,
                    display: 'block',
                    wordBreak: 'break-word',
                }}>
                    {value}
                </span>
            </div>
        </div>
    )
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
function Perfil({ userData, theme }) {
    useEffect(() => {
        if (userData?.pago) {
            console.log('✅ Estado de pago actualizado:', userData.pago)
        }
    }, [userData?.pago, userData?.fechaPago])

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'

    if (!userData) {
        return (
            <Flex w="100%" h="70vh" align="center" justify="center" flexDir="column" gap="12px">
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                    Cargando...
                </Text>
                <Spinner size="lg" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    const isPago = userData.pago

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{perfilStyles}</style>

            {/* ── Header ── */}
            <Box className="pf-header" w="100%" maxW="560px" mb={['24px', '32px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Mi cuenta
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
                    {userData.username} {userData.userlastname}
                </Heading>
                <Text
                    mt="6px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                >
                    {userData.useremail}
                </Text>
            </Box>

            <Box w="100%" maxW="560px" display="flex" flexDir="column" gap="16px">

                {/* ── Card info personal ── */}
                <Box
                    className="pf-card"
                    bg={panelBg}
                    border="1px solid"
                    borderColor={borderC}
                    borderRadius="16px"
                    p={['18px', '24px']}
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
                            Información personal
                        </Text>
                    </Flex>

                    <Box>
                        <InfoRow icon="📱" label="Celular" value={userData.usertelefono} isDark={isDark} />
                        <InfoRow icon="💪" label="Días de entrenamiento" value={`${userData.diasentrenamiento} días`} isDark={isDark} />
                        <InfoRow
                            icon="🗓️"
                            label="Días restantes"
                            value={`${userData.diasrestantes} días`}
                            accent={userData.diasrestantes <= 5 ? '#FC8181' : '#68D391'}
                            isDark={isDark}
                        />
                    </Box>
                </Box>

                {/* ── Card estado de pago ── */}
                <Box
                    bg={isPago
                        ? 'rgba(104,211,145,0.06)'
                        : 'rgba(252,129,129,0.05)'}
                    border="1px solid"
                    borderColor={isPago
                        ? 'rgba(104,211,145,0.3)'
                        : 'rgba(252,129,129,0.25)'}
                    borderRadius="16px"
                    p={['18px', '24px']}
                    style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.14s both' }}
                >
                    <Flex alignItems="center" justifyContent="space-between" mb="14px" flexWrap="wrap" gap="10px">
                        <Flex alignItems="center" gap="10px">
                            <Box
                                w="20px" h="2px"
                                bg={isPago ? 'green.400' : '#FC8181'}
                                borderRadius="full"
                            />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.68rem"
                                letterSpacing="0.2em"
                                textTransform="uppercase"
                                color={textMuted}
                            >
                                Mes actual
                            </Text>
                        </Flex>

                        {/* Badge estado */}
                        <Flex
                            alignItems="center"
                            gap="7px"
                            px="12px" py="5px"
                            borderRadius="full"
                            bg={isPago ? 'rgba(104,211,145,0.12)' : 'rgba(252,129,129,0.1)'}
                            border="1px solid"
                            borderColor={isPago ? 'rgba(104,211,145,0.4)' : 'rgba(252,129,129,0.35)'}
                        >
                            <Box
                                w="6px" h="6px"
                                borderRadius="full"
                                bg={isPago ? '#68D391' : '#FC8181'}
                            />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.72rem"
                                fontWeight="700"
                                letterSpacing="0.1em"
                                textTransform="uppercase"
                                color={isPago ? '#68D391' : '#FC8181'}
                            >
                                {isPago ? 'Pagado' : 'No pagado'}
                            </Text>
                        </Flex>
                    </Flex>

                    {/* Fecha de pago */}
                    {isPago && userData.fechaPago && (
                        <Flex alignItems="center" gap="8px">
                            <Box
                                w="32px" h="32px"
                                borderRadius="8px"
                                bg="rgba(104,211,145,0.1)"
                                border="1px solid rgba(104,211,145,0.2)"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                fontSize="0.9rem"
                                flexShrink={0}
                            >
                                🗓️
                            </Box>
                            <Box>
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.65rem"
                                    letterSpacing="0.1em"
                                    textTransform="uppercase"
                                    color={textMuted}
                                >
                                    Fecha de pago
                                </Text>
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.88rem"
                                    fontWeight="500"
                                    color={textMain}
                                >
                                    {userData.fechaPago}
                                </Text>
                            </Box>
                        </Flex>
                    )}

                    {/* Descuento */}
                    {userData.descuento && (
                        <Box
                            mt="14px"
                            pt="14px"
                            borderTop="1px solid"
                            borderColor={isPago ? 'rgba(104,211,145,0.15)' : 'rgba(252,129,129,0.15)'}
                        >
                            <Flex alignItems="center" gap="8px">
                                <Box
                                    w="32px" h="32px"
                                    borderRadius="8px"
                                    bg="rgba(104,211,145,0.08)"
                                    border="1px solid rgba(104,211,145,0.2)"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="0.9rem"
                                    flexShrink={0}
                                >
                                    ✨
                                </Box>
                                <Box>
                                    <Text
                                        fontFamily='"Poppins", sans-serif'
                                        fontSize="0.65rem"
                                        letterSpacing="0.1em"
                                        textTransform="uppercase"
                                        color={textMuted}
                                    >
                                        Descuento activo
                                    </Text>
                                    <Text
                                        fontFamily='"Poppins", sans-serif'
                                        fontSize="0.85rem"
                                        fontWeight="500"
                                        color="#68D391"
                                        textTransform="capitalize"
                                    >
                                        10% — {userData.descuento}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    )}
                </Box>

                {/* ── Historial de pagos ── */}
                <Box
                    bg={panelBg}
                    border="1px solid"
                    borderColor={borderC}
                    borderRadius="16px"
                    p={['18px', '24px']}
                    style={{ animation: 'fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both' }}
                >
                    <Flex alignItems="center" gap="10px" mb="20px">
                        <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.2em"
                            textTransform="uppercase"
                            color={textMuted}
                        >
                            Historial de pagos
                        </Text>
                    </Flex>
                    <HistorialPagosUs userData={userData} theme={theme} />
                </Box>

            </Box>
        </Box>
    )
}

export default Perfil