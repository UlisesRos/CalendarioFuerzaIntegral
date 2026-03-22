import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { Box, Flex, Heading, Text, useToast } from '@chakra-ui/react';

// ─── Estilos globales ─────────────────────────────────────────────────────────
const historialStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rowIn {
        from { opacity: 0; transform: translateX(-10px); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes modalBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes modalPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes modalPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .hm-header { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .hm-row {
        animation: rowIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
        transition: background 0.2s ease;
    }

    .hm-ver-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 8px;
        padding: 4px 10px;
        border: 1px solid;
        background: transparent;
        transition: all 0.2s ease;
        margin-top: 6px;
        display: inline-block;
        white-space: nowrap;
    }
    .hm-ver-btn.activos {
        color: #68D391;
        border-color: rgba(104,211,145,0.4);
    }
    .hm-ver-btn.activos:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
        transform: translateY(-1px);
    }
    .hm-ver-btn.inactivos {
        color: #FC8181;
        border-color: rgba(252,129,129,0.4);
    }
    .hm-ver-btn.inactivos:hover {
        background: rgba(252,129,129,0.08);
        border-color: #FC8181;
        transform: translateY(-1px);
    }

    .hm-th {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        padding: 12px 16px;
        white-space: nowrap;
    }
    .hm-td {
        font-family: 'Poppins', sans-serif;
        font-size: 0.83rem;
        padding: 14px 16px;
        vertical-align: middle;
        text-align: center;
    }

    .hm-modal-backdrop {
        animation: modalBackdropIn 0.3s ease both;
    }
    @media (min-width: 600px) {
        .hm-modal-panel { animation: modalPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    }
    @media (max-width: 599px) {
        .hm-modal-panel { animation: modalPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both; }
    }

    .hm-cliente-row {
        transition: background 0.15s ease;
        border-radius: 8px;
        padding: 8px 10px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .hm-cliente-row:hover {
        background: rgba(104,211,145,0.05);
    }
`

// ─── Modal de clientes ────────────────────────────────────────────────────────
function ClientesModal({ clientes, tipo, mes, onClose }) {
    const isActivo = tipo === 'activos'
    const accentColor = isActivo ? '#68D391' : '#FC8181'
    const accentBg = isActivo ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.08)'
    const accentBorder = isActivo ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.25)'

    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [onClose])

    const isMobile = window.innerWidth < 600

    const modalContent = (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
                padding: isMobile ? 0 : '16px',
                animation: 'modalBackdropIn 0.3s ease both',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '460px',
                    maxHeight: isMobile ? '88vh' : '80vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: `1px solid ${accentBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: isMobile
                        ? 'modalPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                        : 'modalPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                {/* Handle mobile */}
                {isMobile && (
                    <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '36px',
                        height: '4px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '9999px',
                        zIndex: 20,
                    }} />
                )}

                {/* ── Header ── */}
                <div style={{
                    padding: isMobile ? '28px 20px 18px' : '24px 28px 18px',
                    borderBottom: `1px solid ${accentBorder}`,
                    flexShrink: 0,
                    position: 'relative',
                }}>
                    {/* Botón cerrar */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                            lineHeight: 1,
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                        ✕
                    </button>

                    {/* Label mes */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '20px', height: '2px', background: accentColor, borderRadius: '9999px' }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.68rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: accentColor,
                        }}>
                            {mes}
                        </span>
                    </div>

                    {/* Título */}
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.55rem',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1.1,
                        margin: '0 0 12px',
                    }}>
                        {isActivo ? 'Clientes activos' : 'Sin pagar'}
                    </h2>

                    {/* Badge cantidad */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: accentBg,
                        border: `1px solid ${accentBorder}`,
                    }}>
                        <div style={{
                            width: '6px', height: '6px',
                            borderRadius: '50%',
                            background: accentColor,
                            flexShrink: 0,
                        }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            color: accentColor,
                        }}>
                            {clientes.length} {isActivo ? 'pagaron' : 'pendientes'}
                        </span>
                    </div>
                </div>

                {/* ── Lista scrolleable ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '14px 20px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${accentColor}55 transparent`,
                }}>
                    {clientes.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 0',
                        }}>
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.85rem',
                                color: 'rgba(255,255,255,0.3)',
                            }}>
                                No hay clientes en esta categoría
                            </span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {clientes.map((cliente, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 10px',
                                        borderRadius: '8px',
                                        transition: 'background 0.15s ease',
                                        cursor: 'default',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.25)',
                                        width: '20px',
                                        textAlign: 'right',
                                        flexShrink: 0,
                                    }}>
                                        {index + 1}
                                    </span>
                                    <div style={{
                                        width: '6px', height: '6px',
                                        borderRadius: '50%',
                                        background: accentColor,
                                        opacity: 0.6,
                                        flexShrink: 0,
                                    }} />
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.88rem',
                                        fontWeight: 500,
                                        color: 'rgba(255,255,255,0.85)',
                                        textTransform: 'capitalize',
                                    }}>
                                        {cliente.nombre} {cliente.apellido}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    // ← Portal: renderiza directo en document.body, fuera de la tabla
    return createPortal(modalContent, document.body)
}

// ─── Celda de clientes (badge + botón) ───────────────────────────────────────
function ClientesCell({ clientes, tipo, mes, textMain, esArrayVacio, cantidadFallback }) {
    const [modalAbierto, setModalAbierto] = useState(false)
    const isActivo = tipo === 'activos'
    const cantidad = esArrayVacio ? cantidadFallback : clientes.length
    const clientesReales = esArrayVacio ? [] : clientes

    return (
        <td className="hm-td">
            {/* Badge cantidad */}
            <Flex
                alignItems="center"
                justifyContent="center"
                gap="7px"
                display="inline-flex"
                px="10px" py="4px"
                borderRadius="full"
                bg={isActivo ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.08)'}
                border="1px solid"
                borderColor={isActivo ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.25)'}
                mb="6px"
            >
                <Box
                    w="6px" h="6px"
                    borderRadius="full"
                    bg={isActivo ? '#68D391' : '#FC8181'}
                    flexShrink={0}
                />
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.72rem"
                    fontWeight="600"
                    color={isActivo ? '#68D391' : '#FC8181'}
                >
                    {cantidad}
                </Text>
            </Flex>

            {/* Botón ver — solo si hay datos con nombre */}
            {!esArrayVacio && clientes.length > 0 && (
                <Box>
                    <button
                        className={`hm-ver-btn ${tipo}`}
                        onClick={() => setModalAbierto(true)}
                    >
                        {isActivo ? 'Ver activos →' : 'Ver pendientes →'}
                    </button>
                </Box>
            )}

            {/* Modal */}
            {modalAbierto && (
                <ClientesModal
                    clientes={clientesReales}
                    tipo={tipo}
                    mes={mes}
                    onClose={() => setModalAbierto(false)}
                />
            )}
        </td>
    )
}

// ─── HistorialMensual ─────────────────────────────────────────────────────────
function HistorialMensual({ apiUrl, theme }) {
    const [historial, setHistorial] = useState([])
    const toast = useToast()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,149,0.18)'
    const headBg = isDark ? 'rgba(104,211,145,0.06)' : 'rgba(104,211,145,0.05)'
    const rowHover = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(104,211,145,0.03)'
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const rowBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(104,211,145,0.1)'

    useEffect(() => {
        const obtenerHistorial = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/historial`)
                setHistorial(response.data)
            } catch (error) {
                console.error('Error obteniendo el historial:', error)
                toast({
                    title: 'Error',
                    description: 'No se pudo obtener el historial mensual',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                })
            }
        }
        obtenerHistorial()
    }, [])

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{historialStyles}</style>

            {/* ── Header ── */}
            <Box className="hm-header" w="100%" maxW="1100px" mb={['24px', '36px']}>
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
                    Historial Mensual
                </Heading>
            </Box>

            {/* ── Tabla ── */}
            <Box
                w="100%"
                maxW="1100px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                overflow="hidden"
            >
                <Box overflowX="auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: headBg, borderBottom: `1px solid ${borderC}` }}>
                                {[
                                    'Mes',
                                    'Importe ingresado',
                                    'Importe no ingresado',
                                    'Clientes',
                                    'Activos',
                                    'Sin pagar'
                                ].map((h, i) => (
                                    <th
                                        key={i}
                                        className="hm-th"
                                        style={{
                                            color: textMuted,
                                            textAlign: i === 0 ? 'left' : 'center'
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((item, idx) => {
                                const esArrayVacio =
                                    Array.isArray(item.clientesActivos) &&
                                    (item.clientesActivos.length === 0 ||
                                        !item.clientesActivos[0]?.nombre)

                                const cantidadActivos =
                                    item.cantidadClientes - (item.clientesSinPagar?.length || 0)

                                return (
                                    <tr
                                        key={item._id}
                                        className="hm-row"
                                        style={{
                                            animationDelay: `${idx * 0.05}s`,
                                            borderBottom: `1px solid ${rowBorder}`,
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = rowHover}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        {/* Mes */}
                                        <td className="hm-td" style={{ color: textMain, fontWeight: '600', textAlign: 'left', minWidth: '130px' }}>
                                            <Flex alignItems="center" gap="8px">
                                                <Box w="3px" h="16px" bg="green.400" borderRadius="full" flexShrink={0} />
                                                {item.mes}
                                            </Flex>
                                        </td>

                                        {/* Importe ingresado */}
                                        <td className="hm-td">
                                            <Text
                                                fontFamily='"Poppins", sans-serif'
                                                fontSize="0.88rem"
                                                fontWeight="700"
                                                color="#68D391"
                                            >
                                                $ {item.importeIngresado.toLocaleString('es-ES')}
                                            </Text>
                                        </td>

                                        {/* Importe no ingresado */}
                                        <td className="hm-td">
                                            <Text
                                                fontFamily='"Poppins", sans-serif'
                                                fontSize="0.88rem"
                                                fontWeight="700"
                                                color="#FC8181"
                                            >
                                                $ {item.importeNoIngresado.toLocaleString('es-ES')}
                                            </Text>
                                        </td>

                                        {/* Cantidad total */}
                                        <td className="hm-td">
                                            <Flex
                                                alignItems="center"
                                                justifyContent="center"
                                                gap="6px"
                                                display="inline-flex"
                                                px="10px" py="4px"
                                                borderRadius="full"
                                                bg={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                                                border="1px solid"
                                                borderColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
                                            >
                                                <Text
                                                    fontFamily='"Poppins", sans-serif'
                                                    fontSize="0.8rem"
                                                    fontWeight="600"
                                                    color={textMain}
                                                >
                                                    {item.cantidadClientes}
                                                </Text>
                                                <Text fontSize="0.75rem">👤</Text>
                                            </Flex>
                                        </td>

                                        {/* Activos */}
                                        <ClientesCell
                                            clientes={item.clientesActivos || []}
                                            tipo="activos"
                                            mes={item.mes}
                                            textMain={textMain}
                                            esArrayVacio={esArrayVacio}
                                            cantidadFallback={cantidadActivos}
                                        />

                                        {/* Sin pagar */}
                                        <ClientesCell
                                            clientes={item.clientesSinPagar || []}
                                            tipo="inactivos"
                                            mes={item.mes}
                                            textMain={textMain}
                                            esArrayVacio={false}
                                            cantidadFallback={0}
                                        />
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </Box>

                {historial.length === 0 && (
                    <Flex justify="center" align="center" py="56px" flexDir="column" gap="8px">
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                            No hay historial registrado todavía
                        </Text>
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.75rem" color="gray.500">
                            Los datos aparecerán al cerrar el primer mes
                        </Text>
                    </Flex>
                )}
            </Box>
        </Box>
    )
}

export default HistorialMensual;