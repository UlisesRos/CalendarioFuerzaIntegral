import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Select, Spinner, Text } from '@chakra-ui/react';
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import axios from 'axios'
import ModalTurnos from './modalTurnos'
import ModalRestriccionPago from '../modal/ModalRestriccionPago'

const socket = io('/')

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
function HourCard({ hour, people, usuario, selectedDay, selectedShift, onRemove, onMove, isClosed, isRestricted, theme, delay }) {
    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderBase = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.35)' : '#A0AEC0'

    const filledCount = people.filter(p => p !== null).length
    const totalSlots = people.length
    const occupancy = Math.round((filledCount / totalSlots) * 100)
    const isUserHere = people.includes(usuario.toLowerCase())

    return (
        <Box
            className="cal-hour-card"
            style={{ animationDelay: `${delay}s` }}
            bg={isClosed ? (isDark ? 'rgba(252,129,129,0.06)' : 'rgba(252,129,129,0.05)') : panelBg}
            border="1px solid"
            borderColor={
                isClosed ? 'rgba(252,129,129,0.35)' :
                    isUserHere ? 'rgba(104,211,145,0.5)' :
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
                <Box display="flex" flexDir="column" gap="2px">
                    {people.map((person, index) => {
                        const isMe = usuario.toLowerCase() === person
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

                                {/* Acciones (solo si es el usuario) */}
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
                                        >
                                            ✕
                                        </button>
                                    </Flex>
                                )}
                            </Box>
                        )
                    })}
                </Box>
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
        return () => socket.off('updateCalendar')
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

    // Toast reutilizable (mismo estilo que el resto del calendario)
    const showToast = (icon, title) => Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false,
        timer: 4000, timerProgressBar: true, color: 'black',
        didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
    }).fire({ icon, title })

    const recargarCalendario = () => {
        axios.get(`${apiUrl}/api/calendar`)
            .then(res => setCalendar(res.data))
            .catch(err => console.error('Error refreshing calendar', err))
    }

    const handleAddPerson = (day, shift, hour, mover) => {
        // El admin puede restringirle horarios a un usuario: no lo dejamos anotarse
        if (isHourRestricted(day, shift, hour)) {
            showToast('warning', restriccion?.reason
                ? `No podés anotarte en este horario. ${restriccion.reason}`
                : 'No tenés habilitado este horario. Consultá con el gimnasio.'
            )
            return
        }

        setCalendar((prev) => {
            const updated = JSON.parse(JSON.stringify(prev))
            const availableSlot = updated[day][shift][hour].indexOf(null)
            const personaRepetida = updated[day][shift][hour].map(pers => pers === usuario.toLocaleLowerCase())

            const toast = (icon, title) => Swal.mixin({
                toast: true, position: 'top-end', showConfirmButton: false,
                timer: 3000, timerProgressBar: true, color: 'black',
                didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
            }).fire({ icon, title })

            if (personaRepetida.filter(p => p === true).length > 0) {
                toast('warning', `Ya estás registrado en este horario. Elegí otro.`)
                return prev
            } else if (availableSlot !== -1) {
                toast('success', mover ? 'Usuario movido a otro horario.' : `Turno confirmado: ${day}, ${hour}:00 hs`)
                updated[day][shift][hour][availableSlot] = usuario.toLocaleLowerCase()
                axios.put(`${apiUrl}/api/calendar`, { day, shift, hour, updatedHour: updated[day][shift][hour] })
                    .catch(err => {
                        const data = err.response?.data
                        // El servidor rechazó la inscripción (restricción de horarios o de pago)
                        if (data?.code === 'SCHEDULE_RESTRICTED' || data?.code === 'PAYMENT_REQUIRED') {
                            showToast('warning', data.msg)
                        } else {
                            showToast('error', 'No se pudo guardar el turno. Intentá de nuevo.')
                            console.error('Error adding person:', data || err.message)
                        }
                        // Volvemos a traer el calendario real para no dejar el turno "fantasma"
                        recargarCalendario()
                        axios.get(`${apiUrl}/api/schedule-restrictions/me`)
                            .then(res => setRestriccion(res.data))
                            .catch(() => { })
                    })
                return updated
            } else {
                toast('error', 'No hay espacios disponibles en este horario.')
                return prev
            }
        })
    }

    const handleRemovePerson = (day, shift, hour, index, mover) => {
        setCalendar((prev) => {
            const updated = { ...prev }
            const updatedHour = [...updated[day][shift][hour]]
            updatedHour[index] = null
            updated[day][shift][hour] = updatedHour
            axios.put(`${apiUrl}/api/calendar/remove`, { day, shift, hour, index })
                .then(() => {
                    if (!mover) Swal.mixin({
                        toast: true, position: 'top-end', showConfirmButton: false,
                        timer: 3000, timerProgressBar: true, color: 'black',
                        didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
                    }).fire({ icon: 'error', title: 'Usuario eliminado' })
                })
                .catch(err => console.error('Error removing person:', err.response?.data || err.message))
            return updated
        })
    }

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index]
        const mover = true
        const toShift = prompt('Ingresá el turno de destino (mañana o tarde):')?.toLocaleLowerCase()

        const toast = (icon, title) => Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false,
            timer: 3000, timerProgressBar: true, color: 'black',
            didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
        }).fire({ icon, title })

        if (toShift !== 'mañana' && toShift !== 'tarde') {
            toast('error', 'Turno inválido. Por favor ingresá mañana o tarde.')
            return
        }
        const toHour = prompt('Ingresá la hora de destino (por ejemplo, 16):')
        const toHourNumber = parseInt(toHour, 10)

        // No lo movemos a un horario que tiene restringido (perdería el turno actual)
        if (!isNaN(toHourNumber) && isHourRestricted(fromDay, toShift, toHourNumber)) {
            toast('warning', restriccion?.reason
                ? `No podés anotarte en ese horario. ${restriccion.reason}`
                : 'No tenés habilitado ese horario. Tu turno actual queda como estaba.'
            )
            return
        }

        if (!isNaN(toHourNumber) && calendar[fromDay]?.[toShift]?.hasOwnProperty(toHourNumber)) {
            const emptyIndex = calendar[fromDay][toShift][toHourNumber].indexOf(null)
            const personaRepetida = calendar[fromDay][toShift][toHourNumber].map(pers => pers === person.toLocaleLowerCase())
            if (!(personaRepetida.filter(p => p === true).length > 0)) {
                handleRemovePerson(fromDay, fromShift, fromHour, index, mover)
            }
            if (emptyIndex !== -1) {
                handleAddPerson(fromDay, toShift, toHourNumber, person, mover)
            } else {
                toast('warning', 'El horario de destino está completo.')
                handleAddPerson(fromDay, fromShift, fromHour, person)
            }
        } else {
            toast('warning', 'Hora inválida o el horario no existe en el calendario.')
            handleAddPerson(fromDay, fromShift, fromHour, person)
        }
    }

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            if (isRestricted) {
                setShowPaymentModal(true)
                return
            }
            if (selectedDay && selectedShift && selectedHour && usuario) {
                handleAddPerson(selectedDay, selectedShift, selectedHour, usuario)
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
        if (!calendar || !usuario) return []
        const userSchedule = []
        Object.keys(calendar).forEach(day =>
            Object.keys(calendar[day]).forEach(shift =>
                Object.keys(calendar[day][shift]).forEach(hour => {
                    if (calendar[day][shift][hour].includes(usuario.toLocaleLowerCase()))
                        userSchedule.push({ day, shift, hour })
                })
            )
        )
        return userSchedule
    }

    const dayClosed = selectedDay && isDayClosed(selectedDay)
    const horaRestringida = !!(selectedDay && selectedShift && selectedHour && isHourRestricted(selectedDay, selectedShift, selectedHour))

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
                                    return (
                                        <option key={hour} value={hour} disabled={restringida}>
                                            {hour}:00{restringida ? ' 🔒 no habilitado' : ''}
                                        </option>
                                    )
                                })
                                : <option disabled>No hay horas disponibles</option>
                            }
                        </select>
                    )}

                    {/* Inscribir */}
                    <button
                        className="cal-inscribir-btn"
                        disabled={!usuario || !selectedDay || !selectedShift || !selectedHour || isRestricted || horaRestringida}
                        onClick={() => {
                            if (isRestricted) {
                                setShowPaymentModal(true)
                                return
                            }
                            if (selectedDay && selectedShift && selectedHour && usuario) {
                                handleAddPerson(selectedDay, selectedShift, selectedHour, usuario)
                            }
                        }}
                        title={
                            isRestricted ? 'Debés abonar la cuota para inscribirte'
                                : horaRestringida ? 'No tenés habilitado este horario'
                                    : ''
                        }
                    >
                        {isRestricted || horaRestringida ? '🔒 Inscribirme' : 'Inscribirme'}
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
                                        usuario={usuario}
                                        selectedDay={selectedDay}
                                        selectedShift={selectedShift}
                                        onRemove={handleRemovePerson}
                                        onMove={handleMovePerson}
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