import {
    Spinner, Box, Heading, Image, Text, useDisclosure, useToast,
    Tooltip, Input, Flex, Select
} from '@chakra-ui/react'
import pagado from '../../../img/pagado.png'
import nopago from '../../../img/nopago.png'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ClienteModal from './ClienteModal'
import EditUserButton from './EditUserButton'
import basura from '../../../img/basura.png'
import CountUp from '../clients/utils/CountUp'
import GradientText from '../clients/utils/GradientText'
import ModalIngresos from './ModalIngresos'

// ─── Estilos globales ─────────────────────────────────────────────────────────
const registroStyles = `
    @keyframes tableRowIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

    .rc-row {
        animation: tableRowIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        transition: background 0.2s ease;
    }

    .rc-nombre-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        font-weight: 500;
        transition: color 0.2s ease, transform 0.2s ease;
        text-transform: capitalize;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
    }
    .rc-nombre-btn:hover {
        color: #68D391;
        transform: translateX(2px);
    }

    .rc-delete-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 8px;
        padding: 5px 12px;
        border: 1px solid rgba(252,129,129,0.4);
        color: #FC8181;
        background: transparent;
        transition: all 0.2s ease;
        white-space: nowrap;
    }
    .rc-delete-btn:hover {
        background: rgba(252,129,129,0.1);
        border-color: #FC8181;
        transform: translateY(-1px);
    }

    .rc-metodo-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        background: none;
        border: none;
        transition: color 0.2s ease;
        padding: 0;
    }
    .rc-metodo-btn:hover {
        color: #68D391;
        text-decoration: underline;
    }

    .rc-ingresos-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 9px 20px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: rgba(104,211,145,0.08);
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .rc-ingresos-btn:hover {
        background: rgba(104,211,145,0.16);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    }

    .rc-pago-img {
        transition: transform 0.2s ease, filter 0.2s ease;
        cursor: pointer;
        border-radius: 50%;
    }
    .rc-pago-img:hover {
        transform: scale(1.15);
        filter: brightness(1.1);
    }

    .rc-th {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        white-space: nowrap;
        padding: 12px 14px;
    }
    .rc-td {
        font-family: 'Poppins', sans-serif;
        font-size: 0.83rem;
        padding: 12px 14px;
        vertical-align: middle;
        text-align: center;
        white-space: nowrap;
    }
`

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <Flex alignItems="center" gap="10px" mb="12px">
            <Box w="24px" h="2px" bg="green.400" borderRadius="full" flexShrink={0} />
            <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.7rem"
                letterSpacing="0.25em"
                textTransform="uppercase"
                color="gray.500"
            >
                {children}
            </Text>
        </Flex>
    )
}

function StyledInput({ placeholder, value, onChange, theme }) {
    const isDark = theme === 'dark'
    return (
        <Input
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            fontFamily='"Poppins", sans-serif'
            fontSize="0.85rem"
            bg={isDark ? 'rgba(255,255,255,0.04)' : 'white'}
            border="1px solid"
            borderColor="rgba(104,211,145,0.3)"
            borderRadius="10px"
            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #68D391' }}
            _hover={{ borderColor: 'green.400' }}
            _placeholder={{ color: 'gray.400', fontSize: '0.82rem' }}
            transition="all 0.2s"
            h="40px"
        />
    )
}

function StyledSelect({ placeholder, value, onChange, theme, children }) {
    const isDark = theme === 'dark'
    return (
        <Select
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            fontFamily='"Poppins", sans-serif'
            fontSize="0.85rem"
            bg={isDark ? 'rgba(255,255,255,0.04)' : 'white'}
            border="1px solid"
            borderColor="rgba(104,211,145,0.3)"
            borderRadius="10px"
            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #68D391' }}
            _hover={{ borderColor: 'green.400' }}
            transition="all 0.2s"
            h="40px"
        >
            {children}
        </Select>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
function RegistroClientes({ theme, apiUrl }) {
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState([])
    const [config, setConfig] = useState({ precios: null, descuento: 0 })
    const [searchTerm, setSearchTerm] = useState('')
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filtroPago, setFiltroPago] = useState('todos')
    const toast = useToast()

    const isDark = theme === 'dark'

    useEffect(() => {
        const fetchUsuarioAndConfig = async () => {
            try {
                const [userRes, configRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/auth/users`),
                    axios.get(`${apiUrl}/api/config/precios`)
                ])
                setUserData(userRes.data)
                setConfig(configRes.data)
            } catch (error) {
                console.error('Error fetching data', error)
            } finally {
                setIsLoading(false)
            }
        }
        if (apiUrl) fetchUsuarioAndConfig()
    }, [apiUrl])

    const handleSearchChange = (e) => setSearchTerm(e.target.value.toLowerCase())
    const handleFiltroPagoChange = (e) => setFiltroPago(e.target.value)

    const filteredUsers = userData
        .filter(user => user.role !== 'admin')
        .filter(user => {
            const matchesSearch =
                user.username.toLowerCase().includes(searchTerm) ||
                user.userlastname.toLowerCase().includes(searchTerm)
            if (filtroPago === 'todos') return matchesSearch
            if (filtroPago === 'pagados') return matchesSearch && user.pago
            if (filtroPago === 'no-pagados') return matchesSearch && !user.pago
            return matchesSearch
        })

    const handleClienteClick = (cliente) => {
        setClienteSeleccionado(cliente)
        onOpen()
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`${apiUrl}/api/auth/userdelete/${id}`)
                toast({ title: 'Éxito', description: 'Usuario eliminado', status: 'success', duration: 5000, isClosable: true })
                setUserData(userData.filter(user => user._id !== id))
            } catch (error) {
                console.error('Error eliminando usuario:', error)
                alert('Hubo un error al eliminar el usuario')
            }
        }
    }

    const handleMetodoPago = async (id, user) => {
        const nuevoMetodoPago = user.metodopago === 'MP' ? 'Efectivo/Transf' : 'MP'
        try {
            axios.put(`${apiUrl}/api/auth/userupdate/${id}`, { metodopago: nuevoMetodoPago })
            setUserData(prev => prev.map(u => u._id === user._id ? { ...u, metodopago: nuevoMetodoPago } : u))
            toast({ title: 'Método de pago actualizado', description: `Cambiado a ${nuevoMetodoPago}`, status: 'success', duration: 5000, isClosable: true })
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudo actualizar el método de pago', status: 'error', duration: 5000, isClosable: true })
        }
    }

    const handlePago = async (id, user) => {
        const nuevoPago = !user.pago
        const formattedDate = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
        if (!window.confirm(`¿Cambiar estado de pago a ${nuevoPago ? 'Pagado' : 'No Pagado'}?`)) return
        try {
            await axios.put(`${apiUrl}/api/auth/userupdate/${id}`, {
                pago: nuevoPago,
                fechaPago: nuevoPago ? formattedDate : null,
                metodopago: nuevoPago ? 'Efectivo/Transf' : null,
            })
            setUserData(prev => prev.map(u =>
                u._id === user._id
                    ? { ...u, pago: nuevoPago, fechaPago: nuevoPago ? formattedDate : null, metodopago: nuevoPago ? 'Efectivo/Transf' : null }
                    : u
            ))
            toast({ title: 'Estado de pago actualizado', description: `Ahora es ${nuevoPago ? 'Pagado' : 'No Pagado'}`, status: 'success', duration: 5000, isClosable: true })
            setTimeout(() => window.location.reload(), 1000)
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudo actualizar el estado de pago', status: 'error', duration: 5000, isClosable: true })
        }
    }

    const fetchUsuarios = async () => {
        const response = await axios.get(`${apiUrl}/api/auth/users`)
        setUserData(response.data)
    }

    const calcularTotales = () => {
        let totalPagados = 0
        let totalNoPagados = 0
        if (!config.precios) return { totalPagados, totalNoPagados }
        
        filteredUsers.forEach(user => {
            const monto = config.precios[user.diasentrenamiento] || 0
            const montoConDescuento = user.descuento ? monto - monto * config.descuento : monto
            if (user.pago) totalPagados += montoConDescuento
            else totalNoPagados += montoConDescuento
        })
        return { totalPagados, totalNoPagados }
    }

    const { totalPagados, totalNoPagados } = calcularTotales()

    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const headBg = isDark ? 'rgba(104,211,145,0.07)' : 'rgba(104,211,145,0.06)'
    const rowHover = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(104,211,145,0.04)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{registroStyles}</style>

            {/* ── Header ── */}
            <Box w="100%" maxW="1100px" mb={['24px', '36px']}>
                <SectionLabel>Panel de administración</SectionLabel>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                >
                    Datos de Clientes
                </Heading>
            </Box>

            {isLoading ? (
                <Flex align="center" justify="center" h="300px">
                    <Spinner size="xl" color="green.400" thickness="3px" />
                </Flex>
            ) : (
                <Box w="100%" maxW="1100px">

                    {/* ── Controles ── */}
                    <Flex
                        gap={['10px', '14px']}
                        mb="20px"
                        flexDir={['column', 'row']}
                        alignItems={['stretch', 'center']}
                    >
                        <StyledInput
                            placeholder="Buscar por nombre o apellido"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            theme={theme}
                        />
                        <StyledSelect
                            value={filtroPago}
                            onChange={handleFiltroPagoChange}
                            theme={theme}
                        >
                            <option value="todos">Todos</option>
                            <option value="pagados">Pagados</option>
                            <option value="no-pagados">No pagados</option>
                        </StyledSelect>
                        <button
                            className="rc-ingresos-btn"
                            onClick={() => setIsModalOpen(true)}
                            style={{ whiteSpace: 'nowrap' }}
                        >
                            Ingresos Mensuales
                        </button>
                    </Flex>

                    <ModalIngresos
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        totalPagados={totalPagados}
                        totalNoPagados={totalNoPagados}
                    />

                    {/* ── Contador clientes ── */}
                    <Flex
                        alignItems="center"
                        gap="10px"
                        mb="24px"
                        p="14px 18px"
                        bg={panelBg}
                        border="1px solid"
                        borderColor={borderC}
                        borderRadius="12px"
                        w="fit-content"
                    >
                        <Box w="6px" h="6px" borderRadius="full" bg="green.400" flexShrink={0} />
                        <GradientText
                            colors={isDark ? ["green, white, green, white, green"] : ["green, black, green, black, green"]}
                            animationSpeed={3}
                            showBorder={false}
                        >
                            <Flex gap="8px" alignItems="center" fontFamily='"Poppins", sans-serif' fontSize="0.9rem">
                                <Text>Clientes activos:</Text>
                                <CountUp from={0} to={filteredUsers.length} separator="," direction="up" duration={1} className="count-up-text" />
                            </Flex>
                        </GradientText>
                    </Flex>

                    {/* ── Tabla ── */}
                    <Box
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
                                        {['N°', 'Nombre completo', 'Días', 'Monto', 'Pago', 'Fecha pago', 'Método', '', ''].map((h, i) => (
                                            <th
                                                key={i}
                                                className="rc-th"
                                                style={{ color: textMuted, textAlign: 'center' }}
                                            >
                                                {h === '' && i === 7
                                                    ? <Image src={basura} alt="eliminar" w="28px" mx="auto" opacity={0.5} />
                                                    : h
                                                }
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => {
                                        const monto = config.precios ? config.precios[user.diasentrenamiento] : 0
                                        const montoFinal = user.descuento && monto
                                            ? monto - monto * config.descuento
                                            : monto

                                        return (
                                            <tr
                                                key={user._id}
                                                className="rc-row"
                                                style={{
                                                    animationDelay: `${index * 0.03}s`,
                                                    borderBottom: `1px solid ${borderC}`,
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = rowHover}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {/* N° */}
                                                <td className="rc-td" style={{ color: textMuted, fontSize: '0.75rem' }}>
                                                    {index + 1}
                                                </td>

                                                {/* Nombre */}
                                                <td className="rc-td" style={{ textAlign: 'left', minWidth: '160px' }}>
                                                    <Tooltip label="Ver perfil" fontSize="xs">
                                                        <button
                                                            className="rc-nombre-btn"
                                                            onClick={() => handleClienteClick(user)}
                                                            style={{ color: textMain }}
                                                        >
                                                            {user.username} {user.userlastname}
                                                        </button>
                                                    </Tooltip>
                                                </td>

                                                {/* Días */}
                                                <td className="rc-td" style={{ color: textMuted }}>
                                                    {user.diasentrenamiento}d
                                                </td>

                                                {/* Monto */}
                                                <td className="rc-td">
                                                    <Text
                                                        fontFamily='"Poppins", sans-serif'
                                                        fontSize="0.85rem"
                                                        fontWeight="600"
                                                        color={user.descuento ? '#68D391' : textMain}
                                                    >
                                                        {monto
                                                            ? `$\u00a0${montoFinal.toLocaleString('es-ES')}`
                                                            : '$ —'}
                                                    </Text>
                                                </td>

                                                {/* Estado pago */}
                                                <td className="rc-td">
                                                    <Tooltip label={user.pago ? 'Marcar como no pagado' : 'Marcar como pagado'} fontSize="xs">
                                                        <Image
                                                            className="rc-pago-img"
                                                            src={user.pago ? pagado : nopago}
                                                            alt="Estado de pago"
                                                            w="34px"
                                                            h="34px"
                                                            mx="auto"
                                                            onClick={() => handlePago(user._id, user)}
                                                        />
                                                    </Tooltip>
                                                </td>

                                                {/* Fecha pago */}
                                                <td className="rc-td" style={{ color: user.pago ? textMain : textMuted }}>
                                                    {user.pago ? user.fechaPago : '—'}
                                                </td>

                                                {/* Método pago */}
                                                <td className="rc-td">
                                                    <Tooltip label={user.metodopago === 'MP' ? 'Cambiar a Efectivo/Transf' : 'Cambiar a MP'} fontSize="xs">
                                                        <button
                                                            className="rc-metodo-btn"
                                                            onClick={() => handleMetodoPago(user._id, user)}
                                                            style={{ color: textMain }}
                                                        >
                                                            {user.metodopago || 'MP'}
                                                        </button>
                                                    </Tooltip>
                                                </td>

                                                {/* Eliminar */}
                                                <td className="rc-td">
                                                    <button
                                                        className="rc-delete-btn"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>

                                                {/* Editar */}
                                                <td className="rc-td">
                                                    <EditUserButton
                                                        apiUrl={apiUrl}
                                                        user={user}
                                                        theme={theme}
                                                        onUserUpdated={fetchUsuarios}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </Box>

                        {/* Estado vacío */}
                        {filteredUsers.length === 0 && (
                            <Flex
                                justify="center"
                                align="center"
                                py="48px"
                                flexDir="column"
                                gap="8px"
                            >
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                                    No se encontraron clientes
                                </Text>
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.75rem" color="gray.500">
                                    Probá con otro término de búsqueda
                                </Text>
                            </Flex>
                        )}
                    </Box>
                </Box>
            )}

            {clienteSeleccionado && (
                <ClienteModal
                    isOpen={isOpen}
                    onClose={onClose}
                    clienteSeleccionado={clienteSeleccionado}
                    theme={theme}
                />
            )}
        </Box>
    )
}

export default RegistroClientes