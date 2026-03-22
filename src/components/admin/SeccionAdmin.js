import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

// ─── Estilos globales ─────────────────────────────────────────────────────────
const adminStyles = `
    @keyframes adminReveal {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .admin-card {
        animation: adminReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        text-decoration: none;
    }
    .admin-card:nth-child(1) { animation-delay: 0.04s; }
    .admin-card:nth-child(2) { animation-delay: 0.10s; }
    .admin-card:nth-child(3) { animation-delay: 0.16s; }
    .admin-card:nth-child(4) { animation-delay: 0.22s; }
    .admin-card:nth-child(5) { animation-delay: 0.28s; }
    .admin-card:nth-child(6) { animation-delay: 0.34s; }

    .admin-card .ac-bar {
        width: 0;
        transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        height: 2px;
        background: #68D391;
        border-radius: 2px;
        margin-top: 10px;
    }
    .admin-card:hover .ac-bar {
        width: 100%;
    }
    .admin-card .ac-arrow {
        opacity: 0;
        transform: translateX(-6px);
        transition: opacity 0.3s ease, transform 0.3s ease;
        font-size: 1rem;
        color: #68D391;
    }
    .admin-card:hover .ac-arrow {
        opacity: 1;
        transform: translateX(0);
    }
    .admin-card .ac-box {
        transition: border-color 0.3s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
    }
    .admin-card:hover .ac-box {
        border-color: rgba(104, 211, 145, 0.5) !important;
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.18);
    }
`

// ─── Datos de cada botón ──────────────────────────────────────────────────────
const ADMIN_ITEMS = [
    { to: '/initialcalendar', label: 'Editar Calendario', icon: '📅', desc: 'Modificá fechas y eventos' },
    { to: '/registroclientes', label: 'Registros', icon: '📋', desc: 'Listado de clientes activos' },
    { to: '/novedades', label: 'Novedades', icon: '📣', desc: 'Publicá anuncios y noticias' },
    { to: '/historialmensual', label: 'Historial Mensual', icon: '📊', desc: 'Revisá el historial por mes' },
    { to: '/ingresousuario', label: 'Ingreso de Usuarios', icon: '🔐', desc: 'Gestioná accesos al sistema' },
    { to: '/gestionhorarios', label: 'Gestión de Horarios', icon: '🕐', desc: 'Configurá turnos y horarios' },
    { to: '/preciosadmin', label: 'Configurar Precios', icon: '💰', desc: 'Ajustá cuotas y descuentos' },
]

// ─── AdminCard ────────────────────────────────────────────────────────────────
function AdminCard({ to, label, icon, desc, theme }) {
    const isDark = theme === 'dark'

    return (
        <Link to={to} className="admin-card" style={{ display: 'block' }}>
            <Box
                className="ac-box"
                bg={isDark ? 'rgba(255,255,255,0.04)' : 'white'}
                border="1px solid"
                borderColor={isDark ? 'whiteAlpha.100' : 'gray.100'}
                borderRadius="14px"
                p={['16px', '20px']}
                display="flex"
                flexDir="column"
                gap="6px"
                h="100%"
            >
                {/* Icono + flecha */}
                <Flex justifyContent="space-between" alignItems="flex-start">
                    <Box
                        fontSize="1.5rem"
                        lineHeight="1"
                        mb="4px"
                    >
                        {icon}
                    </Box>
                    <Box className="ac-arrow">→</Box>
                </Flex>

                {/* Título */}
                <Text
                    fontFamily='"Playfair Display", serif'
                    fontSize={['0.95rem', '1.05rem']}
                    fontWeight="700"
                    color={isDark ? 'white' : 'gray.800'}
                    lineHeight="1.25"
                >
                    {label}
                </Text>

                {/* Descripción corta */}
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.72rem"
                    color={isDark ? 'gray.400' : 'gray.500'}
                    lineHeight="1.5"
                >
                    {desc}
                </Text>

                {/* Barra verde animada */}
                <Box className="ac-bar" />
            </Box>
        </Link>
    )
}

// ─── SeccionAdmin ─────────────────────────────────────────────────────────────
function SeccionAdmin({ theme }) {
    return (
        <Flex
            flexDir="column"
            align="center"
            w="100%"
            px={['20px', '40px', '80px']}
            py={['40px', '60px']}
        >
            <style>{adminStyles}</style>

            {/* Header de sección */}
            <Box w="100%" maxW="900px" mb={['28px', '40px']}>
                <Flex alignItems="center" gap="12px" mb="14px">
                    <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize={['0.7rem', '0.8rem']}
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Panel de control
                    </Text>
                </Flex>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={theme === 'dark' ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                >
                    Administración
                </Heading>
            </Box>

            {/* Grid de cards */}
            <Box
                w="100%"
                maxW="900px"
                display="grid"
                gridTemplateColumns={[
                    'repeat(2, 1fr)',   // mobile: 2 columnas
                    'repeat(2, 1fr)',   // tablet: 2 columnas
                    'repeat(3, 1fr)',   // desktop: 3 columnas
                ]}
                gap={['10px', '14px', '16px']}
            >
                {ADMIN_ITEMS.map((item) => (
                    <AdminCard
                        key={item.to}
                        {...item}
                        theme={theme}
                    />
                ))}
            </Box>
        </Flex>
    )
}

export default SeccionAdmin