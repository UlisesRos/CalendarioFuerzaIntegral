import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Heading, Select, Spinner, Text } from '@chakra-ui/react';
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import axios from 'axios'
import ModalTurnos from './modalTurnos'
import ModalRestriccionPago from '../modal/ModalRestriccionPago'

const socket = io('/')

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MAX_RESERVAS_DEFAULT = 3
const DIAS_ORDEN = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

// Los nombres se guardan en minúsculas en el calendario: comparamos siempre normalizado
const normalizarNombre = (valor) => (typeof valor === 'string' ? valor.trim().toLowerCase() : '')
const claveHorario = (day, shift, hour) => `${day}.${shift}.${hour}`
const capitalizar = (texto) => String(texto ?? '').replace(/(^|\s)\S/g, (letra) => letra.toUpperCase())
// Los nombres los cargan los usuarios: se escapan antes de meterlos en el HTML de SweetAlert
const escaparHtml = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

// ─── Estilos globales ─────────────────────────────────────────────────────────
const calendarioStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hourCardIn {
        from { opacity: 0; transform: translateY(16px) scale(0.98); }
        to   { opacity: 1; transform: translateY(0)   scale(1); }
    }
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to   { opacity: 1; transform: translateX(0); }
    }

    .cal-header    { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .cal-controls  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
    .cal-day-title { animation: slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .cal-hour-card { animation: hourCardIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

    .cal-primary-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 22px;
        border: 1px solid rgba(104,211,145,0.45);
        color: #68D391;
        background: rgba(104,211,145,0.08);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        white-space: nowrap;
    }
    .cal-primary-btn:hover:not(:disabled) {
        background: rgba(104,211,145,0.18);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .cal-primary-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .cal-inscribir-btn {
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
        white-space: nowrap;
    }
    .cal-inscribir-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }
    .cal-inscribir-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
    .cal-inscribir-btn.is-reserva {
        border-color: #F6AD55;
        background: #F6AD55;
    }
    .cal-inscribir-btn.is-reserva:hover:not(:disabled) {
        background: #ED8936;
        border-color: #ED8936;
        box-shadow: 0 8px 24px rgba(237,137,54,0.35);
    }

    .cal-remove-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.7rem;
        font-weight: 600;
        cursor: pointer;
        border-radius: 8px;
        padding: 5px 10px;
        border: 1px solid rgba(252,129,129,0.4);
        color: #FC8181;
        background: transparent;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }
    .cal-remove-btn:hover {
        background: rgba(252,129,129,0.1);
        border-color: #FC8181;
        transform: scale(1.05);
    }

    .cal-move-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 8px;
        padding: 5px 12px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: transparent;
        transition: all 0.2s ease;
        flex-shrink: 0;
    }
    .cal-move-btn:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
        transform: scale(1.05);
    }

    /* En pantallas táctiles los botones de acción necesitan un área de toque mayor */
    @media (pointer: coarse) {
        .cal-remove-btn, .cal-move-btn {
            min-height: 32px;
            min-width: 34px;
        }
    }

    .cal-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        border-radius: 10px;
        padding: 8px 14px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        cursor: pointer;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2368D391' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 32px;
        min-width: 200px;
    }
    .cal-select:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }

    .person-row {
        transition: background 0.2s ease;
        border-radius: 8px;
        padding: 6px 8px;
    }
    .person-row:hover {
        background: rgba(104,211,145,0.05);
    }

    @keyframes rpPulse {
        0%   { box-shadow: 0 0 0 0 rgba(252,129,129,0.5); }
        70%  { box-shadow: 0 0 0 7px rgba(252,129,129,0); }
        100% { box-shadow: 0 0 0 0 rgba(252,129,129,0); }
    }
`

// ─── Componente HourCard ──────────────────────────────────────────────────────
function HourCard({ hour, people, reservas, maxReservas, usuario, isAdmin, selectedDay, selectedShift, onRemove, onMove, onRemoveReserva, isClosed, isRestricted, theme, delay }) {
    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderBase = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.35)' : '#A0AEC0'
    // Ámbar legible en ambos temas (contraste AA sobre blanco y sobre fondo oscuro)
    const reservaColor = isDark ? '#F6AD55' : '#C05621'

    const usuarioKey = normalizarNombre(usuario)
    const filledCount = people.filter(p => p !== null).length
    const totalSlots = people.length
    const occupancy = totalSlots ? Math.round((filledCount / totalSlots) * 100) : 0
    const isFull = totalSlots > 0 && filledCount === totalSlots
    const isUserHere = people.some(p => normalizarNombre(p) === usuarioKey)
    const isUserInReserve = reservas.some(r => r.nombre === usuarioKey)
    const showReserva = !isClosed && (isFull || reservas.length > 0)
    const reservaRows = Math.max(maxReservas, reservas.length)

    return (
        <Box
            className="cal-hour-card"
            style={{ animationDelay: `${delay}s` }}
            bg={isClosed ? (isDark ? 'rgba(252,129,129,0.06)' : 'rgba(252,129,129,0.05)') : panelBg}
            border="1px solid"
            borderColor={
                isClosed ? 'rgba(252,129,129,0.35)' :
                    isUserHere ? 'rgba(104,211,145,0.5)' :
                        isUserInReserve ? 'rgba(237,137,54,0.5)' :
                            isRestricted ? 'rgba(160,174,192,0.35)' :
                                borderBase
            }
            borderRadius="14px"
            p="16px 18px"
            w={['100%', '48%', 'calc(33.33% - 12px)']}
            flexShrink={0}
            opacity={isClosed ? 0.7 : (isRestricted && !isUserHere ? 0.55 : 1)}
        >
            {/* Header de la card */}
            <Flex justifyContent="space-between" alignItems="center" mb="12px">
                <Flex alignItems="baseline" gap="4px">
                    <Text
                        fontFamily='"Playfair Display", serif'
                        fontSize="1.6rem"
                        fontWeight="900"
                        color={isClosed ? '#FC8181' : '#68D391'}
                        lineHeight="1"
                    >
                        {hour}
                    </Text>
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.75rem"
                        color={textMuted}
                        fontWeight="500"
                    >
                        :00 hs
                    </Text>
                </Flex>

                {!isClosed && (
                    <Box textAlign="right">
                        <Text
                            fontFamily='"Poppins", sans-serif'
                            fontSize="0.68rem"
                            letterSpacing="0.1em"
                            textTransform="uppercase"
                            color={filledCount === totalSlots ? '#FC8181' : textMuted}
                        >
                            {filledCount}/{totalSlots}
                        </Text>
                        {/* Barra de ocupación */}
                        <Box
                            mt="3px"
                            w="48px"
                            h="3px"
                            bg={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                            borderRadius="full"
                            overflow="hidden"
                        >
                            <Box
                                h="100%"
                                w={`${occupancy}%`}
                                bg={occupancy === 100 ? '#FC8181' : '#68D391'}
                                borderRadius="full"
                                transition="width 0.5s ease"
                            />
                        </Box>
                    </Box>
                )}
            </Flex>

            {/* Divider */}
            <Box h="1px" bg={isClosed ? 'rgba(252,129,129,0.2)' : borderBase} mb="10px" />

            {/* Horario no habilitado para este usuario */}
            {!isClosed && isRestricted && (
                <Flex alignItems="center" gap="8px" mb="8px">
                    <Box w="6px" h="6px" borderRadius="full" bg="#A0AEC0" flexShrink={0} />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.74rem"
                        color={textMuted}
                        fontWeight="600"
                    >
                        No habilitado para vos
                    </Text>
                </Flex>
            )}

            {/* Cerrado */}
            {isClosed ? (
                <Flex alignItems="center" gap="8px" py="4px">
                    <Box w="6px" h="6px" borderRadius="full" bg="#FC8181" flexShrink={0} />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.78rem"
                        color="#FC8181"
                        fontWeight="600"
                    >
                        Horario cerrado
                    </Text>
                </Flex>
            ) : (
                <>
                <Box display="flex" flexDir="column" gap="2px">
                    {people.map((person, index) => {
                        const isMe = !!person && normalizarNombre(person) === usuarioKey
                        return (
                            <Box
                                key={index}
                                className="person-row"
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                gap="8px"
                            >
                                {/* Indicador + nombre */}
                                <Flex alignItems="center" gap="8px" flex="1" minW={0}>
                                    <Box
                                        w="6px" h="6px"
                                        borderRadius="full"
                                        flexShrink={0}
                                        bg={person ? (isMe ? '#68D391' : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)')) : 'transparent'}
                                        border={!person ? '1px dashed' : 'none'}
                                        borderColor={textMuted}
                                    />
                                    <Text
                                        fontFamily='"Poppins", sans-serif'
                                        fontSize="0.82rem"
                                        fontWeight={isMe ? '600' : '400'}
                                        color={person ? (isMe ? '#68D391' : textMain) : textMuted}
                                        textTransform="capitalize"
                                        noOfLines={1}
                                        flex="1"
                                        style={{
                                            fontStyle: !person ? 'italic' : 'normal',
                                        }}
                                    >
                                        {person || 'Disponible'}
                                    </Text>
                                </Flex>

                                {/* Acciones del propio usuario */}
                                {isMe && (
                                    <Flex gap="4px" flexShrink={0}>
                                        <button
                                            className="cal-move-btn"
                                            onClick={() => onMove(selectedDay, selectedShift, hour, index)}
                                        >
                                            Mover
                                        </button>
                                        <button
                                            className="cal-remove-btn"
                                            onClick={() => onRemove(selectedDay, selectedShift, hour, index)}
                                            aria-label="Cancelar mi turno"
                                            title="Cancelar mi turno"
                                        >
                                            ✕
                                        </button>
                                    </Flex>
                                )}

                                {/* El admin puede quitar a cualquier persona del horario */}
                                {!isMe && person && isAdmin && (
                                    <button
                                        className="cal-remove-btn"
                                        onClick={() => onRemove(selectedDay, selectedShift, hour, index)}
                                        aria-label={`Quitar a ${capitalizar(person)} del horario`}
                                        title="Quitar del horario"
                                    >
                                        ✕
                                    </button>
                                )}
                            </Box>
                        )
                    })}
                </Box>

                {/* Lista de reserva: aparece cuando el horario está completo o hay gente esperando */}
                {showReserva && (
                    <Box
                        mt="10px"
                        pt="10px"
                        borderTop="1px dashed"
                        borderColor={isDark ? 'rgba(246,173,85,0.3)' : 'rgba(192,86,33,0.3)'}
                    >
                        <Flex justifyContent="space-between" alignItems="center" mb="4px" px="8px">
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.68rem"
                                letterSpacing="0.12em"
                                textTransform="uppercase"
                                fontWeight="600"
                                color={reservaColor}
                            >
                                Lista de reserva
                            </Text>
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.68rem"
                                letterSpacing="0.1em"
                                color={reservas.length >= maxReservas ? reservaColor : textMuted}
                            >
                                {reservas.length}/{maxReservas}
                            </Text>
                        </Flex>

                        <Box display="flex" flexDir="column" gap="2px">
                            {Array.from({ length: reservaRows }).map((_, i) => {
                                const reserva = reservas[i]
                                const esMia = !!reserva && reserva.nombre === usuarioKey
                                return (
                                    <Box
                                        key={reserva ? reserva.id : `libre-${i}`}
                                        className="person-row"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        gap="8px"
                                    >
                                        <Flex alignItems="center" gap="8px" flex="1" minW={0}>
                                            <Flex
                                                w="20px" h="20px"
                                                borderRadius="full"
                                                alignItems="center"
                                                justifyContent="center"
                                                flexShrink={0}
                                                border={reserva ? '1px solid' : '1px dashed'}
                                                borderColor={reserva ? reservaColor : textMuted}
                                                bg={esMia ? reservaColor : 'transparent'}
                                            >
                                                <Text
                                                    fontFamily='"Poppins", sans-serif'
                                                    fontSize="0.68rem"
                                                    fontWeight="700"
                                                    lineHeight="1"
                                                    color={esMia ? (isDark ? '#1a202c' : 'white') : (reserva ? reservaColor : textMuted)}
                                                >
                                                    {i + 1}
                                                </Text>
                                            </Flex>
                                            <Text
                                                fontFamily='"Poppins", sans-serif'
                                                fontSize="0.82rem"
                                                fontWeight={esMia ? '600' : '400'}
                                                color={reserva ? (esMia ? reservaColor : textMain) : textMuted}
                                                textTransform={reserva ? 'capitalize' : 'none'}
                                                fontStyle={reserva ? 'normal' : 'italic'}
                                                noOfLines={1}
                                                flex="1"
                                            >
                                                {reserva ? reserva.nombre : 'Libre'}
                                            </Text>
                                        </Flex>

                                        {reserva && (esMia || isAdmin) && (
                                            <button
                                                className="cal-remove-btn"
                                                onClick={() => onRemoveReserva(selectedDay, selectedShift, hour, reserva)}
                                                aria-label={esMia ? 'Salir de la lista de reserva' : `Quitar a ${capitalizar(reserva.nombre)} de la reserva`}
                                                title={esMia ? 'Salir de la reserva' : 'Quitar de la reserva'}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </Box>
                                )
                            })}
                        </Box>

                        {isUserInReserve && (
                            <Text
                                mt="8px"
                                px="8px"
                                fontFamily='"Poppins", sans-serif'
                                fontSize="0.76rem"
                                lineHeight="1.5"
                                color={isDark ? 'rgba(255,255,255,0.7)' : '#4A5568'}
                            >
                                Estás en reserva: todavía no tenés lugar en este horario. Si alguien se baja, entrás automáticamente y te avisamos por mail.
                            </Text>
                        )}
                    </Box>
                )}
                </>
            )}
        </Box>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
const Calendario = ({ theme, userData, apiUrl }) => {
    const [calendar, setCalendar] = useState('')
    const [closedSchedules, setClosedSchedules] = useState([])
    const [restriccion, setRestriccion] = useState(null)
    const [selectedDay, setSelectedDay] = useState('')
    const [selectedShift, setSelectedShift] = useState('')
    const [selectedHour, setSelectedHour] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    // Listas de reserva por horario: { "lunes.mañana.10": [{ id, nombre }] }
    const [reservas, setReservas] = useState({})
    const [maxReservas, setMaxReservas] = useState(MAX_RESERVAS_DEFAULT)
    const [procesando, setProcesando] = useState(false)
    const procesandoRef = useRef(false)

    // Restricción de pago: activa a partir del día 12 si el usuario no pagó
    const isRestricted = userData && userData.role !== 'admin' && new Date().getDate() >= 12 && !userData.pago
    const [showPaymentModal, setShowPaymentModal] = useState(() =>
        !!(userData && userData.role !== 'admin' && new Date().getDate() >= 12 && !userData.pago)
    )

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'
    const selectBg = isDark ? '#1a202c' : 'white'
    const selectColor = isDark ? 'rgba(255,255,255,0.85)' : '#2D3748'

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/calendar`)
                setCalendar(response.data)
            } catch (error) {
                console.error('Error fetching calendar', error)
            }
        }
        fetchCalendar()

        const fetchReservas = () => axios.get(`${apiUrl}/api/calendar/reservas`)
            .then(res => {
                setReservas(res.data?.reservas || {})
                if (res.data?.maxReservas) setMaxReservas(res.data.maxReservas)
            })
            .catch(err => console.error('Error fetching reservas', err))
        fetchReservas()

        // Sin actualizaciones en tiempo real, al volver a la pestaña/app se traen
        // los lugares y reservas actuales (como máximo una vez cada 15 segundos)
        let ultimaActualizacion = Date.now()
        const actualizarAlVolver = () => {
            if (document.visibilityState !== 'visible') return
            if (Date.now() - ultimaActualizacion < 15000) return
            ultimaActualizacion = Date.now()
            fetchCalendar()
            fetchReservas()
        }
        document.addEventListener('visibilitychange', actualizarAlVolver)
        window.addEventListener('focus', actualizarAlVolver)

        axios.get(`${apiUrl}/api/closed-schedules/public`)
            .then(res => setClosedSchedules(res.data))
            .catch(err => console.error('Error fetching closed schedules', err))

        // Restricción de horarios del usuario (la carga el admin desde el panel)
        if (localStorage.getItem('token')) {
            axios.get(`${apiUrl}/api/schedule-restrictions/me`)
                .then(res => setRestriccion(res.data))
                .catch(err => console.error('Error fetching schedule restrictions', err))
        }

        socket.on('updateCalendar', (updateCalendar) => setCalendar(updateCalendar))
        return () => {
            socket.off('updateCalendar')
            document.removeEventListener('visibilitychange', actualizarAlVolver)
            window.removeEventListener('focus', actualizarAlVolver)
        }
    }, [])

    const isDayClosed = (day) => closedSchedules.some(cs => cs.day === day && cs.closedDay)
    const isHourClosed = (day, shift, hour) => closedSchedules.some(cs => cs.day === day && !cs.closedDay && cs.closedHours?.includes(`${shift}.${hour}`))
    const getClosedReason = (day) => closedSchedules.find(cs => cs.day === day)?.reason || ''

    // ── Restricción de horarios por usuario ──────────────────────────────────
    const tieneRestriccion = !!(restriccion?.tieneRestriccion && restriccion.slots?.length)

    // Un horario está restringido si:
    //  - modo 'allow' -> NO está dentro de los horarios habilitados
    //  - modo 'block' -> SÍ está dentro de los horarios bloqueados
    const isHourRestricted = (day, shift, hour) => {
        if (!tieneRestriccion) return false
        const incluido = restriccion.slots.includes(`${day}.${shift}.${hour}`)
        return restriccion.mode === 'allow' ? !incluido : incluido
    }

    const isDayRestricted = (day) => {
        if (!tieneRestriccion || !calendar || !calendar[day]) return false
        const horas = Object.keys(calendar[day]).flatMap(shift =>
            Object.keys(calendar[day][shift]).map(hour => ({ shift, hour }))
        )
        return horas.length > 0 && horas.every(({ shift, hour }) => isHourRestricted(day, shift, hour))
    }

    if (!userData) {
        return (
            <Flex w="100%" h="70vh" align="center" justify="center" flexDir="column" gap="12px">
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">Cargando...</Text>
                <Spinner size="lg" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    const usuario = `${userData?.username || ''} ${userData?.userlastname || ''}`
    const usuarioKey = normalizarNombre(usuario)
    const isAdmin = userData.role === 'admin'

    // Toast reutilizable (mismo estilo que el resto del calendario).
    // Se usa titleText (texto plano): los mensajes pueden incluir nombres cargados por usuarios.
    const showToast = (icon, title) => Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false,
        timer: 4000, timerProgressBar: true, color: 'black',
        didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
    }).fire({ icon, titleText: title })

    const recargarCalendario = () => {
        axios.get(`${apiUrl}/api/calendar`)
            .then(res => setCalendar(res.data))
            .catch(err => console.error('Error refreshing calendar', err))
        axios.get(`${apiUrl}/api/calendar/reservas`)
            .then(res => setReservas(res.data?.reservas || {}))
            .catch(err => console.error('Error refreshing reservas', err))
    }

    const reservasDe = (day, shift, hour) => reservas[claveHorario(day, shift, hour)] || []

    // El servidor responde con el estado actualizado del horario (lugares + reservas):
    // lo aplicamos directo para que la pantalla quede sincronizada sin recargar todo
    const aplicarEstadoHorario = (day, shift, hour, data) => {
        if (!data) return
        const hora = String(hour)
        if (Array.isArray(data.horario)) {
            setCalendar(prev => {
                if (!prev?.[day]?.[shift]) return prev
                return { ...prev, [day]: { ...prev[day], [shift]: { ...prev[day][shift], [hora]: data.horario } } }
            })
        }
        if (Array.isArray(data.reservas)) {
            setReservas(prev => ({ ...prev, [claveHorario(day, shift, hora)]: data.reservas }))
        }
    }

    const apiInscribir = async (day, shift, hour, aceptaReserva) => {
        try {
            const { data } = await axios.put(`${apiUrl}/api/calendar`, { day, shift, hour, aceptaReserva })
            // Sin "estado" la respuesta no es del servidor actualizado: no confirmamos nada
            if (!data || typeof data !== 'object' || !data.estado) {
                throw new Error('Respuesta inesperada del servidor al inscribir')
            }
            aplicarEstadoHorario(day, shift, hour, data)
            return data
        } catch (err) {
            aplicarEstadoHorario(day, shift, hour, err.response?.data)
            throw err
        }
    }

    const apiQuitar = async (day, shift, hour, index, nombre) => {
        try {
            const { data } = await axios.put(`${apiUrl}/api/calendar/remove`, { day, shift, hour, index, nombre })
            if (Array.isArray(data?.horario)) aplicarEstadoHorario(day, shift, hour, data)
            else recargarCalendario()
            return data || {}
        } catch (err) {
            aplicarEstadoHorario(day, shift, hour, err.response?.data)
            throw err
        }
    }

    const confirmar = ({ title, html, confirmButtonText, confirmButtonColor = '#E53E3E', icon = 'warning', cancelButtonText = 'Cancelar' }) => Swal.fire({
        title,
        html,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        // Gris oscuro: texto blanco legible (el gris claro no llegaba al contraste mínimo)
        cancelButtonColor: '#4A5568',
        focusCancel: true,
    })

    const confirmarReserva = (day, hour, ocupadas) => confirmar({
        title: 'Horario completo',
        icon: 'info',
        html: `El <b>${escaparHtml(day)} a las ${escaparHtml(hour)}:00&nbsp;hs</b> no tiene lugares libres.<br/><br/>` +
            `Podés anotarte en la <b>lista de reserva</b> (quedarías en la posición <b>${ocupadas + 1} de ${maxReservas}</b>). ` +
            'Estar en reserva <b>no</b> te habilita a entrenar en ese horario, pero si alguien se baja entrás automáticamente y te avisamos por mail.',
        confirmButtonText: 'Anotarme en reserva',
        cancelButtonText: 'Elegir otro horario',
        confirmButtonColor: '#C05621',
    })

    // Evita dobles envíos (doble click, Enter + click) mientras hay una operación en curso
    const conBloqueo = async (operacion) => {
        if (procesandoRef.current) return null
        procesandoRef.current = true
        setProcesando(true)
        try {
            return await operacion()
        } finally {
            procesandoRef.current = false
            setProcesando(false)
        }
    }

    // Envía la inscripción. El servidor decide si hay lugar o si queda en reserva.
    const enviarInscripcion = async (day, shift, hour, aceptaReserva) => {
        try {
            const data = await apiInscribir(day, shift, hour, aceptaReserva)
            if (data.estado === 'reserva') {
                showToast('info', `Quedaste en la reserva del ${day} ${hour}:00 hs (posición ${data.posicion}). Si entrás, te avisamos por mail.`)
            } else {
                showToast('success', `Turno confirmado: ${day}, ${hour}:00 hs`)
            }
            return data.estado
        } catch (err) {
            const data = err.response?.data

            // Otra persona tomó el último lugar mientras elegías: ofrecemos la reserva
            if (data?.code === 'HORARIO_COMPLETO') {
                const { isConfirmed } = await confirmarReserva(day, hour, data.reservasOcupadas ?? 0)
                return isConfirmed ? enviarInscripcion(day, shift, hour, true) : null
            }

            if (data?.msg && data?.code) {
                showToast('warning', data.msg)
            } else {
                showToast('error', 'No se pudo guardar el turno. Intentá de nuevo.')
                console.error('Error adding person:', data || err.message)
            }

            // Volvemos a traer el estado real para no dejar un turno "fantasma"
            if (!data?.horario) recargarCalendario()
            if (data?.code === 'SCHEDULE_RESTRICTED') {
                axios.get(`${apiUrl}/api/schedule-restrictions/me`)
                    .then(res => setRestriccion(res.data))
                    .catch(() => { })
            }
            return null
        }
    }

    const handleAddPerson = (day, shift, hour) => conBloqueo(async () => {
        // El admin puede restringirle horarios a un usuario: no lo dejamos anotarse
        if (isHourRestricted(day, shift, hour)) {
            showToast('warning', restriccion?.reason
                ? `No podés anotarte en este horario. ${restriccion.reason}`
                : 'No tenés habilitado este horario. Consultá con el gimnasio.'
            )
            return null
        }

        const horario = calendar?.[day]?.[shift]?.[hour]
        if (!Array.isArray(horario)) {
            showToast('warning', 'Ese horario no existe en el calendario.')
            return null
        }

        if (horario.some(p => normalizarNombre(p) === usuarioKey)) {
            showToast('warning', 'Ya estás registrado en este horario. Elegí otro.')
            return null
        }

        const enReserva = reservasDe(day, shift, hour)
        const miPosicion = enReserva.findIndex(r => r.nombre === usuarioKey)
        if (miPosicion !== -1) {
            showToast('info', `Ya estás en la reserva de este horario (posición ${miPosicion + 1}).`)
            return null
        }

        let aceptaReserva = false
        if (!horario.includes(null)) {
            if (enReserva.length >= maxReservas) {
                showToast('error', 'El horario y la lista de reserva están completos. Probá con otro horario.')
                return null
            }
            const { isConfirmed } = await confirmarReserva(day, hour, enReserva.length)
            if (!isConfirmed) return null
            aceptaReserva = true
        }

        return enviarInscripcion(day, shift, hour, aceptaReserva)
    })

    // Quitar a una persona del horario: el usuario a sí mismo, el admin a cualquiera
    const handleRemovePerson = (day, shift, hour, index) => conBloqueo(async () => {
        const persona = calendar?.[day]?.[shift]?.[hour]?.[index]
        if (!persona) return

        const esPropio = normalizarNombre(persona) === usuarioKey
        if (!esPropio && !isAdmin) return

        const siguiente = reservasDe(day, shift, hour)[0]
        const horarioTexto = `<b>${escaparHtml(day)} a las ${escaparHtml(hour)}:00&nbsp;hs</b>`

        if (!esPropio) {
            const { isConfirmed } = await confirmar({
                title: 'Quitar del horario',
                html: `¿Querés quitar a <b>${escaparHtml(capitalizar(persona))}</b> del ${horarioTexto}?` +
                    (siguiente
                        ? `<br/><br/>Su lugar lo va a ocupar <b>${escaparHtml(capitalizar(siguiente.nombre))}</b>, que está primero en la lista de reserva, y se le avisa por mail.`
                        : ''),
                confirmButtonText: 'Sí, quitar',
            })
            if (!isConfirmed) return
        } else if (siguiente) {
            // Si hay gente esperando, el lugar se ocupa al instante: pedimos confirmación
            const { isConfirmed } = await confirmar({
                title: '¿Cancelar tu turno?',
                html: `Si te bajás del ${horarioTexto}, tu lugar pasa automáticamente a quien está primero en la lista de reserva.`,
                confirmButtonText: 'Sí, cancelar turno',
                cancelButtonText: 'Mantener turno',
            })
            if (!isConfirmed) return
        }

        try {
            const data = await apiQuitar(day, shift, hour, index, persona)
            const promovido = data.promovidos?.[0]
            const mensajeBase = esPropio
                ? `Turno cancelado: ${day}, ${hour}:00 hs.`
                : `Se quitó a ${capitalizar(persona)} del horario.`
            showToast('success', promovido
                ? `${mensajeBase} Entró ${capitalizar(promovido)} desde la reserva.`
                : mensajeBase
            )
        } catch (err) {
            const data = err.response?.data
            showToast('warning', data?.msg || 'No se pudo quitar del horario. Intentá de nuevo.')
            if (!data?.horario) recargarCalendario()
        }
    })

    // Quitar una reserva: el usuario la propia, el admin cualquiera
    const handleRemoveReserva = (day, shift, hour, reserva) => conBloqueo(async () => {
        const esPropia = reserva.nombre === usuarioKey
        if (!esPropia && !isAdmin) return

        const horarioTexto = `<b>${escaparHtml(day)} a las ${escaparHtml(hour)}:00&nbsp;hs</b>`
        const { isConfirmed } = await confirmar(esPropia
            ? {
                title: '¿Salir de la reserva?',
                html: `Vas a dejar de estar en la lista de reserva del ${horarioTexto} y perdés tu lugar en la fila.`,
                confirmButtonText: 'Sí, salir',
            }
            : {
                title: 'Quitar de la reserva',
                html: `¿Querés quitar a <b>${escaparHtml(capitalizar(reserva.nombre))}</b> de la lista de reserva del ${horarioTexto}?`,
                confirmButtonText: 'Sí, quitar',
            })
        if (!isConfirmed) return

        try {
            const { data } = await axios.delete(`${apiUrl}/api/calendar/reservas/${reserva.id}`)
            aplicarEstadoHorario(day, shift, hour, data)
            showToast('success', esPropia
                ? 'Saliste de la lista de reserva.'
                : `Se quitó a ${capitalizar(reserva.nombre)} de la reserva.`
            )
        } catch (err) {
            const data = err.response?.data
            aplicarEstadoHorario(day, shift, hour, data)
            showToast('warning', data?.msg || 'No se pudo quitar la reserva. Intentá de nuevo.')
            if (!data?.reservas) recargarCalendario()
        }
    })

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => conBloqueo(async () => {
        const persona = calendar?.[fromDay]?.[fromShift]?.[fromHour]?.[index]
        if (!persona || normalizarNombre(persona) !== usuarioKey) return

        const toShiftRaw = prompt('Ingresá el turno de destino (mañana o tarde):')
        if (toShiftRaw === null) return
        const toShift = toShiftRaw.trim().toLocaleLowerCase()
        if (toShift !== 'mañana' && toShift !== 'tarde') {
            showToast('error', 'Turno inválido. Por favor ingresá mañana o tarde.')
            return
        }

        const toHourRaw = prompt('Ingresá la hora de destino (por ejemplo, 16):')
        if (toHourRaw === null) return
        const toHourNumber = parseInt(toHourRaw, 10)
        const toHour = String(toHourNumber)
        const destino = calendar?.[fromDay]?.[toShift]?.[toHour]

        if (isNaN(toHourNumber) || !Array.isArray(destino)) {
            showToast('warning', 'Hora inválida o el horario no existe en el calendario.')
            return
        }

        if (toShift === fromShift && toHour === String(fromHour)) {
            showToast('info', 'Ya estás en ese horario.')
            return
        }

        // No lo movemos a un horario que tiene restringido (perdería el turno actual)
        if (isHourRestricted(fromDay, toShift, toHour)) {
            showToast('warning', restriccion?.reason
                ? `No podés anotarte en ese horario. ${restriccion.reason}`
                : 'No tenés habilitado ese horario. Tu turno actual queda como estaba.'
            )
            return
        }

        if (destino.some(p => normalizarNombre(p) === usuarioKey)) {
            showToast('warning', 'Ya estás registrado en el horario de destino.')
            return
        }

        if (!destino.includes(null)) {
            showToast('warning', 'El horario de destino está completo. Tu turno actual queda como estaba.')
            return
        }

        // Primero se asegura el lugar nuevo y recién después se libera el anterior:
        // si el destino se llena en el medio, el usuario no pierde su turno actual.
        try {
            await apiInscribir(fromDay, toShift, toHour, false)
        } catch (err) {
            const data = err.response?.data
            showToast('warning', data?.code === 'HORARIO_COMPLETO'
                ? 'El horario de destino se completó. Tu turno actual queda como estaba.'
                : (data?.msg || 'No se pudo mover el turno. Tu turno actual queda como estaba.')
            )
            if (!data?.horario) recargarCalendario()
            return
        }

        try {
            await apiQuitar(fromDay, fromShift, fromHour, index, persona)
            showToast('success', `Turno movido a ${fromDay}, ${toHour}:00 hs`)
        } catch (err) {
            showToast('warning', `Te anotamos a las ${toHour}:00 hs, pero no se pudo liberar tu turno de las ${fromHour}:00 hs. Cancelalo manualmente.`)
            recargarCalendario()
        }
    })

    const handleEnter = (e) => {
        // En un botón, Enter ya dispara su propio click (evita acciones duplicadas)
        if (e.key === 'Enter' && e.target?.tagName !== 'BUTTON') {
            if (isRestricted) {
                setShowPaymentModal(true)
                return
            }
            if (selectedDay && selectedShift && selectedHour && usuario) {
                handleAddPerson(selectedDay, selectedShift, selectedHour)
            } else {
                Swal.mixin({
                    toast: true, position: 'top-end', showConfirmButton: false,
                    timer: 3000, timerProgressBar: true, color: 'black',
                    didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
                }).fire({ icon: 'info', title: 'Seleccioná un día, turno y hora.' })
            }
        }
    }

    const getUserSchedule = () => {
        if (!calendar || !usuarioKey) return []
        const userSchedule = []
        Object.keys(calendar).forEach(day =>
            Object.keys(calendar[day]).forEach(shift =>
                Object.keys(calendar[day][shift]).forEach(hour => {
                    const lugares = calendar[day][shift][hour]
                    if (Array.isArray(lugares) && lugares.some(p => normalizarNombre(p) === usuarioKey))
                        userSchedule.push({ day, shift, hour })
                })
            )
        )
        return userSchedule
    }

    // Horarios donde el usuario está en la lista de reserva (ordenados por día y hora)
    const getUserReservas = () => {
        if (!usuarioKey) return []
        const lista = []
        Object.entries(reservas).forEach(([clave, items]) => {
            const posicion = (items || []).findIndex(r => r.nombre === usuarioKey)
            if (posicion === -1) return
            const [day, shift, hour] = clave.split('.')
            lista.push({ day, shift, hour, posicion: posicion + 1 })
        })
        return lista.sort((a, b) =>
            (DIAS_ORDEN.indexOf(a.day) - DIAS_ORDEN.indexOf(b.day)) || (Number(a.hour) - Number(b.hour))
        )
    }

    const dayClosed = selectedDay && isDayClosed(selectedDay)
    const horaRestringida = !!(selectedDay && selectedShift && selectedHour && isHourRestricted(selectedDay, selectedShift, selectedHour))

    // Estado del horario elegido en los selects (para adaptar el botón de inscripción)
    const horarioSeleccionado = selectedDay && selectedShift && selectedHour
        ? calendar?.[selectedDay]?.[selectedShift]?.[selectedHour]
        : null
    const seleccionCompleta = Array.isArray(horarioSeleccionado) && horarioSeleccionado.length > 0 && !horarioSeleccionado.includes(null)
    const reservasSeleccion = horarioSeleccionado ? reservasDe(selectedDay, selectedShift, selectedHour) : []
    const yaEnSeleccion = Array.isArray(horarioSeleccionado) && horarioSeleccionado.some(p => normalizarNombre(p) === usuarioKey)
    const yaEnReservaSeleccion = reservasSeleccion.some(r => r.nombre === usuarioKey)
    const reservaSeleccionLlena = seleccionCompleta && reservasSeleccion.length >= maxReservas
    const bloqueoPorEstado = yaEnSeleccion || yaEnReservaSeleccion || (seleccionCompleta && reservaSeleccionLlena)
    const modoReserva = seleccionCompleta && !bloqueoPorEstado && !isRestricted && !horaRestringida

    const textoBotonInscribir =
        isRestricted || horaRestringida ? '🔒 Inscribirme'
            : yaEnSeleccion ? 'Ya tenés este turno'
                : yaEnReservaSeleccion ? 'Ya estás en reserva'
                    : reservaSeleccionLlena ? 'Horario completo'
                        : modoReserva ? 'Anotarme en reserva'
                            : 'Inscribirme'

    // Cantidad de horarios habilitados (para el aviso de restricción)
    const horariosHabilitados = (() => {
        if (!tieneRestriccion || !calendar) return []
        const habilitados = []
        Object.keys(calendar).forEach(day =>
            Object.keys(calendar[day]).forEach(shift =>
                Object.keys(calendar[day][shift]).forEach(hour => {
                    if (!isHourRestricted(day, shift, hour)) habilitados.push({ day, shift, hour })
                })
            )
        )
        return habilitados
    })()

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['28px', '44px']}
            onKeyDown={handleEnter}
        >
            <style>{calendarioStyles}</style>

            {/* ── Modal restricción de pago (aparece cada vez que el usuario entra al calendario) ── */}
            <ModalRestriccionPago
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                variant="calendar"
            />

            {/* ── Header ── */}
            <Box className="cal-header" w="100%" maxW="960px" mb={['24px', '32px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Reserva de turnos
                    </Text>
                </Flex>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.7rem', '2.2rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                    textTransform="capitalize"
                >
                    Hola, {usuario.trim()}
                </Heading>
                <Text
                    mt="6px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize={['0.78rem', '0.88rem']}
                    color={textMuted}
                    letterSpacing="0.04em"
                >
                    Seleccioná un día y hora para inscribirte
                </Text>
            </Box>

            {/* ── Banner de restricción de pago ── */}
            {isRestricted && (
                <Box
                    w="100%"
                    maxW="960px"
                    bg="rgba(252,129,129,0.07)"
                    border="1px solid rgba(252,129,129,0.3)"
                    borderRadius="14px"
                    p={['14px 16px', '16px 22px']}
                    mb={['16px', '24px']}
                >
                    <Flex alignItems={['flex-start', 'center']} gap="12px" flexDir={['column', 'row']}>
                        <Flex alignItems="center" gap="10px" flex="1">
                            <Box
                                w="8px"
                                h="8px"
                                borderRadius="full"
                                bg="#FC8181"
                                flexShrink={0}
                                style={{ animation: 'rpPulse 2s infinite' }}
                            />
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize={['0.78rem', '0.84rem']}
                                color="#FC8181"
                                fontWeight="500"
                                lineHeight="1.5"
                            >
                                Tu cuota del mes no está abonada. No podés inscribirte en ningún horario.
                            </Text>
                        </Flex>
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                padding: '7px 14px',
                                border: '1px solid rgba(252,129,129,0.5)',
                                color: '#FC8181',
                                background: 'rgba(252,129,129,0.08)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                                whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={e => { e.target.style.background = 'rgba(252,129,129,0.15)'; e.target.style.borderColor = '#FC8181'; }}
                            onMouseLeave={e => { e.target.style.background = 'rgba(252,129,129,0.08)'; e.target.style.borderColor = 'rgba(252,129,129,0.5)'; }}
                        >
                            Ver detalles
                        </button>
                    </Flex>
                </Box>
            )}

            {/* ── Banner de restricción de horarios ── */}
            {tieneRestriccion && (
                <Box
                    w="100%"
                    maxW="960px"
                    bg={isDark ? 'rgba(104,211,145,0.06)' : 'rgba(104,211,145,0.07)'}
                    border="1px solid rgba(104,211,145,0.35)"
                    borderRadius="14px"
                    p={['14px 16px', '16px 22px']}
                    mb={['16px', '24px']}
                >
                    <Flex alignItems="flex-start" gap="10px">
                        <Box fontSize="1rem" lineHeight="1.4" flexShrink={0}>🔒</Box>
                        <Box flex="1">
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize={['0.8rem', '0.86rem']}
                                color="#68D391"
                                fontWeight="600"
                                lineHeight="1.5"
                                mb="4px"
                            >
                                Tenés horarios asignados
                            </Text>
                            <Text
                                fontFamily='"Poppins", sans-serif'
                                fontSize={['0.76rem', '0.8rem']}
                                color={textMuted}
                                lineHeight="1.6"
                            >
                                Podés anotarte en {horariosHabilitados.length} de los horarios del calendario. Los que no
                                tenés habilitados aparecen con el candado 🔒.
                                {restriccion?.reason ? ` Motivo: ${restriccion.reason}` : ''}
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            )}

            {/* ── Panel de controles ── */}
            <Box
                className="cal-controls"
                w="100%"
                maxW="960px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['18px', '24px', '28px']}
                mb={['24px', '32px']}
            >
                {/* Botón ver turnos */}
                <Flex justifyContent="flex-end" mb="20px">
                    <button
                        className="cal-primary-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Ver turnos asignados
                    </button>
                    <ModalTurnos
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        getUserSchedule={getUserSchedule}
                        getUserReservas={getUserReservas}
                    />
                </Flex>

                {/* Selects + botón inscribir */}
                <Flex
                    gap={['10px', '12px']}
                    flexDir={['column', 'column', 'row']}
                    alignItems={['stretch', 'stretch', 'center']}
                    flexWrap="wrap"
                >
                    {/* Día */}
                    <select
                        className="cal-select"
                        value={selectedDay}
                        onChange={e => { setSelectedDay(e.target.value); setSelectedShift(''); setSelectedHour('') }}
                        style={{ background: selectBg, color: selectColor, flex: 1 }}
                    >
                        <option value="">Seleccionar día</option>
                        {calendar && Object.keys(calendar).map(day => (
                            <option key={day} value={day}>
                                {day}{isDayClosed(day) ? ' 🔴' : ''}{isDayRestricted(day) ? ' 🔒' : ''}
                            </option>
                        ))}
                    </select>

                    {/* Turno */}
                    {selectedDay && (
                        <select
                            className="cal-select"
                            value={selectedShift}
                            onChange={e => { setSelectedShift(e.target.value); setSelectedHour('') }}
                            style={{ background: selectBg, color: selectColor, flex: 1 }}
                        >
                            <option value="">Seleccionar turno</option>
                            <option value="mañana">Mañana</option>
                            {selectedDay !== 'sábado' && <option value="tarde">Tarde</option>}
                        </select>
                    )}

                    {/* Hora */}
                    {selectedShift && (
                        <select
                            className="cal-select"
                            value={selectedHour}
                            onChange={e => setSelectedHour(e.target.value)}
                            style={{ background: selectBg, color: selectColor, flex: 1 }}
                        >
                            <option value="">Seleccionar hora</option>
                            {(calendar[selectedDay]?.[selectedShift])
                                ? Object.keys(calendar[selectedDay][selectedShift]).map(hour => {
                                    const restringida = isHourRestricted(selectedDay, selectedShift, hour)
                                    const lugares = calendar[selectedDay][selectedShift][hour]
                                    const completa = Array.isArray(lugares) && lugares.length > 0 && !lugares.includes(null)
                                    return (
                                        <option key={hour} value={hour} disabled={restringida}>
                                            {hour}:00{restringida ? ' 🔒 no habilitado' : completa ? ' · completo' : ''}
                                        </option>
                                    )
                                })
                                : <option disabled>No hay horas disponibles</option>
                            }
                        </select>
                    )}

                    {/* Inscribir */}
                    <button
                        className={`cal-inscribir-btn${modoReserva ? ' is-reserva' : ''}`}
                        disabled={!usuario || !selectedDay || !selectedShift || !selectedHour || isRestricted || horaRestringida || bloqueoPorEstado || procesando}
                        onClick={() => {
                            if (isRestricted) {
                                setShowPaymentModal(true)
                                return
                            }
                            if (selectedDay && selectedShift && selectedHour && usuario) {
                                handleAddPerson(selectedDay, selectedShift, selectedHour)
                            }
                        }}
                        title={
                            isRestricted ? 'Debés abonar la cuota para inscribirte'
                                : horaRestringida ? 'No tenés habilitado este horario'
                                    : modoReserva ? 'El horario está completo: podés anotarte en la lista de reserva'
                                        : ''
                        }
                    >
                        {textoBotonInscribir}
                    </button>
                </Flex>
            </Box>

            {/* ── Vista del día seleccionado ── */}
            {selectedDay && selectedShift && (
                <Box w="100%" maxW="960px">

                    {/* Título del día */}
                    <Flex alignItems="center" gap="12px" mb={['20px', '28px']}>
                        <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
                        <Text
                            className="cal-day-title"
                            fontFamily='"Playfair Display", serif'
                            fontSize={['1.3rem', '1.7rem']}
                            fontWeight="900"
                            color={isDark ? 'white' : 'gray.800'}
                            textTransform="capitalize"
                            letterSpacing="-0.01em"
                        >
                            {selectedDay} — Turno {selectedShift === 'mañana' ? 'Mañana' : 'Tarde'}
                        </Text>
                    </Flex>

                    {/* Banner día cerrado */}
                    {dayClosed && (
                        <Box
                            bg="rgba(252,129,129,0.08)"
                            border="1px solid rgba(252,129,129,0.35)"
                            borderRadius="14px"
                            p="20px 24px"
                            mb="24px"
                        >
                            <Flex alignItems="center" gap="10px" mb="4px">
                                <Box w="8px" h="8px" borderRadius="full" bg="#FC8181" flexShrink={0} />
                                <Text
                                    fontFamily='"Playfair Display", serif'
                                    fontSize="1.1rem"
                                    fontWeight="700"
                                    color="#FC8181"
                                >
                                    El gimnasio está cerrado este día
                                </Text>
                            </Flex>
                            {getClosedReason(selectedDay) && (
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.8rem"
                                    color={textMuted}
                                    ml="18px"
                                >
                                    Motivo: {getClosedReason(selectedDay)}
                                </Text>
                            )}
                        </Box>
                    )}

                    {/* Grid de cards por hora */}
                    {!dayClosed && (
                        <Flex
                            flexWrap="wrap"
                            gap={['10px', '12px', '14px']}
                            justifyContent={['center', 'flex-start']}
                        >
                            {(calendar[selectedDay]?.[selectedShift])
                                ? Object.keys(calendar[selectedDay][selectedShift]).map((hour, i) => (
                                    <HourCard
                                        key={hour}
                                        hour={hour}
                                        people={calendar[selectedDay][selectedShift][hour]}
                                        reservas={reservasDe(selectedDay, selectedShift, hour)}
                                        maxReservas={maxReservas}
                                        usuario={usuario}
                                        isAdmin={isAdmin}
                                        selectedDay={selectedDay}
                                        selectedShift={selectedShift}
                                        onRemove={handleRemovePerson}
                                        onMove={handleMovePerson}
                                        onRemoveReserva={handleRemoveReserva}
                                        isClosed={isHourClosed(selectedDay, selectedShift, hour)}
                                        isRestricted={isHourRestricted(selectedDay, selectedShift, hour)}
                                        theme={theme}
                                        delay={i * 0.05}
                                    />
                                ))
                                : (
                                    <Text
                                        fontFamily='"Poppins", sans-serif'
                                        fontSize="0.85rem"
                                        color={textMuted}
                                    >
                                        No hay horarios disponibles para este turno.
                                    </Text>
                                )
                            }
                        </Flex>
                    )}
                </Box>
            )}
        </Box>
    )
}

export default Calendario