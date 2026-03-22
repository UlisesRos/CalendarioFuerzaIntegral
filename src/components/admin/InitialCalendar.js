import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'
import axios from 'axios'
import ModalOcupados from './modalOcupados';

// ─── Estilos globales ─────────────────────────────────────────────────────────
const initialCalStyles = `
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

    .ic-header   { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .ic-controls { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
    .ic-day-title{ animation: slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .ic-hour-card{ animation: hourCardIn 0.45s cubic-bezier(0.22,1,0.36,1) both; }

    .ic-select {
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
        flex: 1;
    }
    .ic-select:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }

    .ic-primary-btn {
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
    .ic-primary-btn:hover:not(:disabled) {
        background: rgba(104,211,145,0.18);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .ic-primary-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .ic-inscribir-btn {
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
    .ic-inscribir-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }
    .ic-inscribir-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }

    .ic-reset-btn {
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
    }
    .ic-reset-btn:hover {
        background: rgba(252,129,129,0.12);
        border-color: #FC8181;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .ic-remove-btn {
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
    .ic-remove-btn:hover {
        background: rgba(252,129,129,0.1);
        border-color: #FC8181;
        transform: scale(1.05);
    }

    .ic-move-btn {
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
    .ic-move-btn:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
        transform: scale(1.05);
    }

    .ic-person-row {
        transition: background 0.2s ease;
        border-radius: 8px;
        padding: 6px 8px;
    }
    .ic-person-row:hover {
        background: rgba(104,211,145,0.05);
    }
`

// ─── react-select custom styles ───────────────────────────────────────────────
const buildSelectStyles = (isDark) => ({
    control: (base, state) => ({
        ...base,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '0.85rem',
        borderRadius: '10px',
        border: state.isFocused
            ? '1px solid #68D391'
            : '1px solid rgba(104,211,145,0.35)',
        boxShadow: state.isFocused ? '0 0 0 1px #68D391' : 'none',
        background: isDark ? 'rgba(255,255,255,0.04)' : 'white',
        color: isDark ? 'rgba(255,255,255,0.85)' : '#2D3748',
        minWidth: '260px',
        transition: 'all 0.2s ease',
        '&:hover': { borderColor: '#68D391' },
        cursor: 'pointer',
    }),
    menu: (base) => ({
        ...base,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '0.85rem',
        borderRadius: '10px',
        background: isDark ? '#1a202c' : 'white',
        border: '1px solid rgba(104,211,145,0.25)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        overflow: 'hidden',
    }),
    option: (base, state) => ({
        ...base,
        background: state.isSelected
            ? 'rgba(104,211,145,0.2)'
            : state.isFocused
                ? 'rgba(104,211,145,0.08)'
                : 'transparent',
        color: state.isSelected
            ? '#68D391'
            : isDark ? 'rgba(255,255,255,0.85)' : '#2D3748',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
    }),
    placeholder: (base) => ({
        ...base,
        color: 'rgba(160,174,192,0.8)',
        fontSize: '0.83rem',
    }),
    singleValue: (base) => ({
        ...base,
        color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748',
        textTransform: 'capitalize',
    }),
    input: (base) => ({
        ...base,
        color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748',
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({
        ...base,
        color: '#68D391',
        '&:hover': { color: '#4FBF72' },
    }),
})

// ─── HourCard ─────────────────────────────────────────────────────────────────
function HourCard({ hour, people, selectedUser, selectedDay, selectedShift, onRemove, onMove, theme, delay }) {
    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.35)' : '#A0AEC0'

    const filledCount = people.filter(p => p !== null).length
    const totalSlots = people.length
    const occupancy = Math.round((filledCount / totalSlots) * 100)
    const isUserHere = selectedUser && people.includes(selectedUser.toLowerCase())

    return (
        <Box
            className="ic-hour-card"
            style={{ animationDelay: `${delay}s` }}
            bg={panelBg}
            border="1px solid"
            borderColor={isUserHere ? 'rgba(104,211,145,0.5)' : borderC}
            borderRadius="14px"
            p="16px 18px"
            w={['100%', '48%', 'calc(33.33% - 12px)']}
            flexShrink={0}
        >
            {/* Header */}
            <Flex justifyContent="space-between" alignItems="center" mb="12px">
                <Flex alignItems="baseline" gap="4px">
                    <Text
                        fontFamily='"Playfair Display", serif'
                        fontSize="1.6rem"
                        fontWeight="900"
                        color="#68D391"
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
                    <Box
                        mt="3px" w="48px" h="3px"
                        bg={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                        borderRadius="full" overflow="hidden"
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
            </Flex>

            {/* Divider */}
            <Box h="1px" bg={borderC} mb="10px" />

            {/* Lista de personas */}
            <Box display="flex" flexDir="column" gap="2px">
                {people.map((person, index) => {
                    const isSelected = selectedUser && selectedUser.toLowerCase() === person
                    return (
                        <Box
                            key={index}
                            className="ic-person-row"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            gap="8px"
                        >
                            <Flex alignItems="center" gap="8px" flex="1" minW={0}>
                                <Box
                                    w="6px" h="6px"
                                    borderRadius="full"
                                    flexShrink={0}
                                    bg={person
                                        ? (isSelected ? '#68D391' : (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)'))
                                        : 'transparent'}
                                    border={!person ? '1px dashed' : 'none'}
                                    borderColor={textMuted}
                                />
                                <Text
                                    fontFamily='"Poppins", sans-serif'
                                    fontSize="0.82rem"
                                    fontWeight={isSelected ? '600' : '400'}
                                    color={person ? (isSelected ? '#68D391' : textMain) : textMuted}
                                    textTransform="capitalize"
                                    noOfLines={1}
                                    flex="1"
                                    fontStyle={!person ? 'italic' : 'normal'}
                                >
                                    {person || 'Disponible'}
                                </Text>
                            </Flex>

                            {/* Acciones — visibles para cualquier persona ocupada (admin) */}
                            {person && (
                                <Flex gap="4px" flexShrink={0}>
                                    <button
                                        className="ic-move-btn"
                                        onClick={() => onMove(selectedDay, selectedShift, hour, index)}
                                    >
                                        Mover
                                    </button>
                                    <button
                                        className="ic-remove-btn"
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
        </Box>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
const InitialCalendar = ({ theme, apiUrl }) => {
    const [calendar, setCalendar] = useState('')
    const [userData, setUserData] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDay, setSelectedDay] = useState('')
    const [selectedShift, setSelectedShift] = useState('')
    const [selectedHour, setSelectedHour] = useState('')
    const [horariosOcupados, setHorariosOcupados] = useState([])

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'
    const selectBg = isDark ? '#1a202c' : 'white'
    const selectColor = isDark ? 'rgba(255,255,255,0.85)' : '#2D3748'

    useEffect(() => {
        axios.get(`${apiUrl}/api/admincalendar`)
            .then(r => setCalendar(r.data))
            .catch(e => console.error('Error fetching calendar', e))
        axios.get(`${apiUrl}/api/auth/users`)
            .then(r => setUserData(r.data))
            .catch(e => console.error('Error fetching users', e))
    }, [])

    const toast = (icon, title) => Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false,
        timer: 3000, timerProgressBar: true, color: 'black',
        didOpen: (t) => { t.onmouseenter = Swal.stopTimer; t.onmouseleave = Swal.resumeTimer }
    }).fire({ icon, title })

    const handleResetCalendar = async () => {
        try {
            await axios.put(`${apiUrl}/api/admincalendar/reset`)
            toast('success', 'Calendario reiniciado correctamente')
        } catch {
            toast('error', 'Error al reiniciar el calendario')
        }
    }

    const handleAddPerson = (day, shift, hour, user) => {
        setCalendar(prev => {
            const updated = JSON.parse(JSON.stringify(prev))
            const availableSlot = updated[day][shift][hour].indexOf(null)
            const repetido = updated[day][shift][hour].some(p => p === user.toLowerCase())
            if (repetido) {
                toast('warning', `${user} ya está registrado en este horario.`)
                return prev
            } else if (availableSlot !== -1) {
                toast('success', `Turno confirmado: ${day}, ${hour}:00 hs`)
                updated[day][shift][hour][availableSlot] = user.toLowerCase()
                axios.put(`${apiUrl}/api/admincalendar`, { day, shift, hour, updatedHour: updated[day][shift][hour] })
                return updated
            } else {
                toast('error', 'No hay espacios disponibles en este horario.')
                return prev
            }
        })
    }

    const handleRemovePerson = (day, shift, hour, index) => {
        setCalendar(prev => {
            const updated = { ...prev }
            const updatedHour = [...updated[day][shift][hour]]
            updatedHour[index] = null
            updated[day][shift][hour] = updatedHour
            axios.put(`${apiUrl}/api/admincalendar/remove`, { day, shift, hour, index })
                .then(() => toast('error', 'Usuario eliminado'))
                .catch(err => console.error('Error removing person:', err.response?.data || err.message))
            return updated
        })
    }

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index]
        const toShift = prompt('Ingresá el turno de destino (mañana o tarde):')
        if (toShift !== null) {
            if (toShift.toLowerCase() !== 'mañana' && toShift.toLowerCase() !== 'tarde') {
                toast('error', 'Turno inválido. Por favor ingresá mañana o tarde.')
                return
            }
        }
        const toHour = prompt('Ingresá la hora de destino (por ejemplo, 16):')
        const toHourNumber = parseInt(toHour, 10)
        if (!isNaN(toHourNumber) && calendar[fromDay]?.[toShift]?.hasOwnProperty(toHourNumber)) {
            const emptyIndex = calendar[fromDay][toShift][toHourNumber].indexOf(null)
            const repetido = calendar[fromDay][toShift][toHourNumber].some(p => p === person.toLowerCase())
            if (!repetido) handleRemovePerson(fromDay, fromShift, fromHour, index)
            if (emptyIndex !== -1) {
                handleAddPerson(fromDay, toShift, toHourNumber, person)
            } else {
                toast('warning', 'El horario de destino está completo.')
                handleAddPerson(fromDay, fromShift, fromHour, person)
            }
        } else {
            toast('warning', 'Hora inválida o el horario no existe en el calendario.')
            handleAddPerson(fromDay, fromShift, fromHour, person)
        }
    }

    const getHorariosOcupados = (cal, user) => {
        const ocupado = []
        Object.keys(cal).forEach(day =>
            Object.keys(cal[day]).forEach(shift =>
                Object.keys(cal[day][shift]).forEach(hour => {
                    if (cal[day][shift][hour].includes(user.toLowerCase()))
                        ocupado.push({ day, shift, hour })
                })
            )
        )
        return ocupado
    }

    const options = userData.map(u => ({
        value: u._id,
        label: `${u.username} ${u.userlastname}`
    }))

    const handleSelectChange = (opt) => {
        setSelectedUser(opt.label)
        setHorariosOcupados(getHorariosOcupados(calendar, opt.label))
    }

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['28px', '44px']}
        >
            <style>{initialCalStyles}</style>

            {/* ── Header ── */}
            <Box className="ic-header" w="100%" maxW="960px" mb={['24px', '36px']}>
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
                    Editar Calendario
                </Heading>
                <Text
                    mt="6px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                >
                    Seleccioná un usuario y modificá sus turnos
                </Text>
            </Box>

            {/* ── Selector de usuario ── */}
            <Box
                className="ic-controls"
                w="100%" maxW="960px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['18px', '24px', '28px']}
                mb={['20px', '28px']}
            >
                <Flex alignItems="center" gap="10px" mb="16px">
                    <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color={textMuted}
                    >
                        Usuario a modificar
                    </Text>
                </Flex>

                <Flex
                    gap={['10px', '14px']}
                    flexDir={['column', 'row']}
                    alignItems={['stretch', 'center']}
                    flexWrap="wrap"
                >
                    <Box flex="1" minW="240px">
                        <ReactSelect
                            onChange={handleSelectChange}
                            placeholder="Buscar usuario..."
                            options={options}
                            isSearchable
                            styles={buildSelectStyles(isDark)}
                        />
                    </Box>

                    {selectedUser && horariosOcupados.length > 0 && (
                        <>
                            <button
                                className="ic-primary-btn"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ver turnos asignados
                            </button>
                            <ModalOcupados
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                horariosOcupados={horariosOcupados}
                            />
                        </>
                    )}
                </Flex>
            </Box>

            {/* ── Selects día / turno / hora + inscribir ── */}
            <Box
                w="100%" maxW="960px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['18px', '24px', '28px']}
                mb={['24px', '32px']}
            >
                <Flex alignItems="center" gap="10px" mb="16px">
                    <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color={textMuted}
                    >
                        Seleccionar turno
                    </Text>
                </Flex>

                <Flex
                    gap={['10px', '12px']}
                    flexDir={['column', 'column', 'row']}
                    alignItems={['stretch', 'stretch', 'center']}
                    flexWrap="wrap"
                >
                    {/* Día */}
                    <select
                        className="ic-select"
                        value={selectedDay}
                        onChange={e => { setSelectedDay(e.target.value); setSelectedShift(''); setSelectedHour('') }}
                        style={{ background: selectBg, color: selectColor }}
                    >
                        <option value="">Seleccionar día</option>
                        {calendar && Object.keys(calendar).map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>

                    {/* Turno */}
                    {selectedDay && (
                        <select
                            className="ic-select"
                            value={selectedShift}
                            onChange={e => { setSelectedShift(e.target.value); setSelectedHour('') }}
                            style={{ background: selectBg, color: selectColor }}
                        >
                            <option value="">Seleccionar turno</option>
                            <option value="mañana">Mañana</option>
                            {selectedDay !== 'sábado' && <option value="tarde">Tarde</option>}
                        </select>
                    )}

                    {/* Hora */}
                    {selectedShift && (
                        <select
                            className="ic-select"
                            value={selectedHour}
                            onChange={e => setSelectedHour(e.target.value)}
                            style={{ background: selectBg, color: selectColor }}
                        >
                            <option value="">Seleccionar hora</option>
                            {calendar[selectedDay]?.[selectedShift]
                                ? Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                    <option key={hour} value={hour}>{hour}:00</option>
                                ))
                                : <option disabled>No hay horas disponibles</option>
                            }
                        </select>
                    )}

                    <button
                        className="ic-inscribir-btn"
                        disabled={!selectedUser || !selectedDay || !selectedShift || !selectedHour}
                        onClick={() => {
                            if (selectedDay && selectedShift && selectedHour && selectedUser) {
                                handleAddPerson(selectedDay, selectedShift, selectedHour, selectedUser)
                            } else {
                                toast('info', 'Seleccioná un usuario, día, turno y hora.')
                            }
                        }}
                    >
                        Inscribir usuario
                    </button>
                </Flex>
            </Box>

            {/* ── Vista del día seleccionado ── */}
            {selectedDay && selectedShift && (
                <Box w="100%" maxW="960px">
                    <Flex alignItems="center" gap="12px" mb={['20px', '28px']}>
                        <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
                        <Text
                            className="ic-day-title"
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

                    <Flex flexWrap="wrap" gap={['10px', '12px', '14px']} justifyContent={['center', 'flex-start']} mb="40px">
                        {calendar[selectedDay]?.[selectedShift]
                            ? Object.keys(calendar[selectedDay][selectedShift]).map((hour, i) => (
                                <HourCard
                                    key={hour}
                                    hour={hour}
                                    people={calendar[selectedDay][selectedShift][hour]}
                                    selectedUser={selectedUser}
                                    selectedDay={selectedDay}
                                    selectedShift={selectedShift}
                                    onRemove={handleRemovePerson}
                                    onMove={handleMovePerson}
                                    theme={theme}
                                    delay={i * 0.05}
                                />
                            ))
                            : (
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color={textMuted}>
                                    No hay horarios disponibles para este turno.
                                </Text>
                            )
                        }
                    </Flex>
                </Box>
            )}

            {/* ── Reset calendario ── */}
            <Box
                w="100%" maxW="960px"
                bg="rgba(252,129,129,0.04)"
                border="1px solid rgba(252,129,129,0.2)"
                borderRadius="16px"
                p={['18px', '24px']}
            >
                <Flex alignItems="center" gap="10px" mb="12px">
                    <Box w="20px" h="2px" bg="#FC8181" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.2em"
                        textTransform="uppercase"
                        color="#FC8181"
                    >
                        Zona de peligro
                    </Text>
                </Flex>
                <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.82rem"
                    color={textMuted}
                    lineHeight="1.65"
                    mb="16px"
                >
                    Al resetear el calendario, todo lo modificado se trasladará automáticamente al calendario semanal. Esta acción no se puede deshacer.
                </Text>
                <button className="ic-reset-btn" onClick={handleResetCalendar}>
                    Resetear calendario
                </button>
            </Box>
        </Box>
    )
}

export default InitialCalendar;