import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Flex, Heading, Select, Text, Textarea, VStack,
    Spinner, HStack, Tag, TagLabel, TagCloseButton, useToast
} from '@chakra-ui/react';
import axios from 'axios';

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const TURNOS = ['mañana', 'tarde'];
const HORAS_MAÑANA = [5, 6, 7, 8, 9, 10, 11, 12];
const HORAS_TARDE = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
const SABADO_MAÑANA = [5, 6, 7, 8, 9, 10, 11, 12];

// ─── Estilos globales ─────────────────────────────────────────────────────────
const gestionStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes panelIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .gh-tab-btn {
        transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        letter-spacing: 0.04em;
        cursor: pointer;
        border-radius: 10px;
        padding: 8px 16px;
        border: 1px solid rgba(104, 211, 145, 0.35);
        white-space: nowrap;
    }
    .gh-tab-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.12);
    }
    .gh-tab-btn.active {
        background: #68D391;
        color: #1a202c;
        border-color: #68D391;
        font-weight: 600;
    }

    .gh-panel {
        animation: panelIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .gh-hour-btn {
        transition: all 0.2s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        padding: 6px 12px;
        border: 1px solid rgba(104, 211, 145, 0.4);
    }
    .gh-hour-btn:hover {
        transform: translateY(-1px);
        border-color: #68D391;
    }
    .gh-hour-btn.selected {
        background: #68D391;
        color: #1a202c;
        border-color: #68D391;
    }

    .gh-action-btn {
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 20px;
        border: 1px solid rgba(104, 211, 145, 0.5);
        width: 100%;
    }
    .gh-action-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(0,0,0,0.15);
    }
    .gh-action-btn.danger {
        background: transparent;
        border-color: rgba(252, 129, 129, 0.5);
        color: #FC8181;
    }
    .gh-action-btn.danger:hover {
        background: rgba(252, 129, 129, 0.1);
        border-color: #FC8181;
    }

    .gh-cierre-card {
        animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .gh-cierre-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .gh-reopen-btn {
        transition: all 0.25s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.7rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        border-radius: 8px;
        padding: 6px 14px;
        border: 1px solid rgba(104, 211, 145, 0.5);
        color: #68D391;
        background: transparent;
        white-space: nowrap;
    }
    .gh-reopen-btn:hover {
        background: rgba(104, 211, 145, 0.1);
        border-color: #68D391;
        transform: translateY(-1px);
    }
`

// ─── Componentes auxiliares ───────────────────────────────────────────────────
function SectionLabel({ children }) {
    return (
        <Flex alignItems="center" gap="10px" mb="14px">
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

function StyledSelect({ placeholder, value, onChange, children, theme }) {
    const isDark = theme === 'dark'
    return (
        <Select
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            fontFamily='"Poppins", sans-serif'
            fontSize="0.85rem"
            bg={isDark ? 'rgba(255,255,255,0.04)' : 'white'}
            color={isDark ? 'white' : 'gray.700'}
            border="1px solid"
            borderColor="rgba(104, 211, 145, 0.35)"
            borderRadius="10px"
            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #68D391' }}
            _hover={{ borderColor: 'green.400' }}
            transition="all 0.2s"
        >
            {children}
        </Select>
    )
}

function StyledTextarea({ placeholder, value, onChange, theme }) {
    const isDark = theme === 'dark'
    return (
        <Textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            fontFamily='"Poppins", sans-serif'
            fontSize="0.85rem"
            bg={isDark ? 'rgba(255,255,255,0.04)' : 'white'}
            color={isDark ? 'white' : 'gray.700'}
            border="1px solid"
            borderColor="rgba(104, 211, 145, 0.35)"
            borderRadius="10px"
            resize="none"
            rows={2}
            _focus={{ borderColor: 'green.400', boxShadow: '0 0 0 1px #68D391' }}
            _hover={{ borderColor: 'green.400' }}
            transition="all 0.2s"
        />
    )
}

function AlertBanner({ type, title, description }) {
    const isWarning = type === 'warning'
    const color = isWarning ? 'amber' : 'red'
    const bg = isWarning ? 'rgba(251, 191, 36, 0.08)' : 'rgba(252, 129, 129, 0.08)'
    const borderColor = isWarning ? 'rgba(251, 191, 36, 0.35)' : 'rgba(252, 129, 129, 0.35)'
    const titleColor = isWarning ? '#F59E0B' : '#FC8181'

    return (
        <Box
            bg={bg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="10px"
            p="14px 16px"
            mb="20px"
        >
            <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.78rem"
                fontWeight="600"
                color={titleColor}
                mb="4px"
                letterSpacing="0.04em"
            >
                {title}
            </Text>
            <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.78rem"
                color="gray.500"
                lineHeight="1.6"
            >
                {description}
            </Text>
        </Box>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
const GestionHorarios = ({ theme, apiUrl }) => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('close-day');
    const [closedSchedules, setClosedSchedules] = useState([]);
    const [adminCalendar, setAdminCalendar] = useState(null);
    const [loading, setLoading] = useState(true);

    const [closeDayDay, setCloseDayDay] = useState('');
    const [closeDayReason, setCloseDayReason] = useState('');
    const [closeHourDay, setCloseHourDay] = useState('');
    const [closeHourShift, setCloseHourShift] = useState('');
    const [closeHourReason, setCloseHourReason] = useState('');
    const [selectedHours, setSelectedHours] = useState([]);
    const [addHourDay, setAddHourDay] = useState('');
    const [addHourShift, setAddHourShift] = useState('');
    const [addHourValue, setAddHourValue] = useState('');
    const [removeHourDay, setRemoveHourDay] = useState('');
    const [removeHourShift, setRemoveHourShift] = useState('');
    const [removeHourValue, setRemoveHourValue] = useState('');

    const isDark = theme === 'dark'

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [csRes, calRes] = await Promise.all([
                axios.get(`${apiUrl}/api/closed-schedules`),
                axios.get(`${apiUrl}/api/admincalendar`)
            ]);
            setClosedSchedules(csRes.data);
            setAdminCalendar(calRes.data);
        } catch (error) {
            console.error('Error loading data', error);
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const showToast = (title, description, status) => {
        toast({ title, description, status, duration: 4000, isClosable: true, position: 'top-right' });
    };

    const handleCloseDay = async () => {
        if (!closeDayDay) return showToast('Error', 'Seleccioná un día', 'warning');
        try {
            await axios.post(`${apiUrl}/api/closed-schedules`, {
                day: closeDayDay, closedDay: true, closedHours: [], reason: closeDayReason
            });
            showToast('¡Éxito!', `${closeDayDay} marcado como cerrado`, 'success');
            setCloseDayDay(''); setCloseDayReason(''); fetchData();
        } catch (err) {
            showToast('Error', err.response?.data?.error || 'No se pudo cerrar el día', 'error');
        }
    };

    const getAvailableHours = () => {
        if (!closeHourDay || !closeHourShift) return [];
        if (closeHourDay === 'sábado') return SABADO_MAÑANA;
        return closeHourShift === 'mañana' ? HORAS_MAÑANA : HORAS_TARDE;
    };

    const toggleHour = (hour) => {
        const key = `${closeHourShift}.${hour}`;
        setSelectedHours(prev => prev.includes(key) ? prev.filter(h => h !== key) : [...prev, key]);
    };

    const handleCloseHours = async () => {
        if (!closeHourDay || selectedHours.length === 0)
            return showToast('Error', 'Seleccioná un día y al menos un horario', 'warning');
        try {
            await axios.post(`${apiUrl}/api/closed-schedules`, {
                day: closeHourDay, closedDay: false, closedHours: selectedHours, reason: closeHourReason
            });
            showToast('¡Éxito!', `Horarios cerrados en ${closeHourDay}`, 'success');
            setCloseHourDay(''); setCloseHourShift(''); setCloseHourReason(''); setSelectedHours([]); fetchData();
        } catch (err) {
            showToast('Error', err.response?.data?.error || 'No se pudo cerrar los horarios', 'error');
        }
    };

    const handleAddHour = async () => {
        if (!addHourDay || !addHourShift || !addHourValue)
            return showToast('Error', 'Completá todos los campos', 'warning');
        const hourNum = parseInt(addHourValue, 10);
        if (isNaN(hourNum) || hourNum < 0 || hourNum > 23)
            return showToast('Error', 'La hora debe ser un número entre 0 y 23', 'warning');
        try {
            await axios.post(`${apiUrl}/api/schedule/add-hour`, { day: addHourDay, shift: addHourShift, hour: hourNum });
            showToast('¡Éxito!', `Hora ${hourNum}:00 agregada permanentemente`, 'success');
            setAddHourDay(''); setAddHourShift(''); setAddHourValue(''); fetchData();
        } catch (err) {
            showToast('Error', err.response?.data?.error || 'No se pudo agregar la hora', 'error');
        }
    };

    const getExistingHours = () => {
        if (!removeHourDay || !removeHourShift || !adminCalendar) return [];
        const dayData = adminCalendar[removeHourDay];
        if (!dayData || !dayData[removeHourShift]) return [];
        return Object.keys(dayData[removeHourShift]);
    };

    const getAllHoursForShift = (day, shift) => {
        if (!shift) return [];
        return shift === 'mañana' ? HORAS_MAÑANA : HORAS_TARDE;
    };

    const getExistingHoursFor = (day, shift) => {
        if (!day || !shift || !adminCalendar) return [];
        const dayData = adminCalendar[day];
        if (!dayData || !dayData[shift]) return [];
        return Object.keys(dayData[shift]);
    };

    const getNewAvailableHours = () => {
        if (!addHourDay || !addHourShift || !adminCalendar) return [];
        const existing = getExistingHoursFor(addHourDay, addHourShift);
        return getAllHoursForShift(addHourDay, addHourShift).filter(h => !existing.includes(String(h)));
    };

    const handleRemoveHour = async () => {
        if (!removeHourDay || !removeHourShift || !removeHourValue)
            return showToast('Error', 'Completá todos los campos', 'warning');
        try {
            await axios.delete(`${apiUrl}/api/schedule/remove-hour`, {
                data: { day: removeHourDay, shift: removeHourShift, hour: removeHourValue }
            });
            showToast('¡Éxito!', `Hora ${removeHourValue}:00 eliminada`, 'success');
            setRemoveHourDay(''); setRemoveHourShift(''); setRemoveHourValue(''); fetchData();
        } catch (err) {
            showToast('Error', err.response?.data?.error || 'No se pudo eliminar la hora', 'error');
        }
    };

    const handleReopen = async (id, day) => {
        try {
            await axios.delete(`${apiUrl}/api/closed-schedules/${id}`);
            showToast('¡Reabierto!', `${day} fue reabierto correctamente`, 'success');
            fetchData();
        } catch (err) {
            showToast('Error', 'No se pudo reabrir el horario', 'error');
        }
    };

    const TABS = [
        { id: 'close-day', label: 'Cerrar Día', icon: '🔒' },
        { id: 'close-hours', label: 'Cerrar Horas', icon: '⏰' },
        { id: 'add-hour', label: 'Agregar Hora', icon: '＋' },
        { id: 'remove-hour', label: 'Eliminar Hora', icon: '🗑' },
    ]

    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'

    return (
        <Box maxW="860px" mx="auto" px={['16px', '24px', '32px']} py={['32px', '52px']}>
            <style>{gestionStyles}</style>

            {/* ── Header ── */}
            <Box mb={['28px', '40px']}>
                <Flex alignItems="center" gap="12px" mb="12px">
                    <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
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
                    Gestión de Horarios
                </Heading>
            </Box>

            {/* ── Tabs ── */}
            <Flex flexWrap="wrap" gap="8px" mb={['20px', '28px']}>
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        className={`gh-tab-btn${activeTab === tab.id ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            background: activeTab === tab.id
                                ? '#68D391'
                                : isDark ? 'rgba(255,255,255,0.04)' : 'white',
                            color: activeTab === tab.id
                                ? '#1a202c'
                                : isDark ? 'rgba(255,255,255,0.8)' : '#4A5568',
                        }}
                    >
                        <span style={{ marginRight: '6px' }}>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </Flex>

            {/* ── Panel activo ── */}
            <Box
                className="gh-panel"
                key={activeTab}
                bg={panelBg}
                border="1px solid"
                borderColor={panelBorder}
                borderRadius="16px"
                p={['20px', '28px', '32px']}
                mb="40px"
            >

                {/* CERRAR DÍA */}
                {activeTab === 'close-day' && (
                    <VStack align="stretch" spacing="16px">
                        <SectionLabel>Cerrar día completo</SectionLabel>
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.82rem" color="gray.500" lineHeight="1.6" mt="-8px">
                            El gimnasio estará cerrado todo ese día. Los usuarios verán un aviso de "Cerrado".
                        </Text>
                        <StyledSelect placeholder="Seleccionar día" value={closeDayDay} onChange={e => setCloseDayDay(e.target.value)} theme={theme}>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                        </StyledSelect>
                        <StyledTextarea placeholder="Motivo (opcional): Feriado, Mantenimiento..." value={closeDayReason} onChange={e => setCloseDayReason(e.target.value)} theme={theme} />
                        <button className="gh-action-btn"
                            style={{ background: 'rgba(104,211,145,0.12)', color: '#68D391' }}
                            onClick={handleCloseDay}
                        >
                            Cerrar día completo
                        </button>
                    </VStack>
                )}

                {/* CERRAR HORARIOS */}
                {activeTab === 'close-hours' && (
                    <VStack align="stretch" spacing="16px">
                        <SectionLabel>Cerrar horarios específicos</SectionLabel>
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.82rem" color="gray.500" lineHeight="1.6" mt="-8px">
                            Seleccioná el día, turno y las horas a cerrar. El resto del día permanecerá abierto.
                        </Text>
                        <StyledSelect placeholder="Seleccionar día" value={closeHourDay} onChange={e => { setCloseHourDay(e.target.value); setCloseHourShift(''); setSelectedHours([]); }} theme={theme}>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                        </StyledSelect>
                        {closeHourDay && (
                            <StyledSelect placeholder="Seleccionar turno" value={closeHourShift} onChange={e => { setCloseHourShift(e.target.value); setSelectedHours([]); }} theme={theme}>
                                <option value="mañana">Mañana</option>
                                <option value="tarde">Tarde</option>
                            </StyledSelect>
                        )}
                        {closeHourShift && (
                            <Box>
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.78rem" color="gray.500" mb="10px" letterSpacing="0.06em" textTransform="uppercase">
                                    Horas a cerrar
                                </Text>
                                <Flex flexWrap="wrap" gap="8px">
                                    {getAvailableHours().map(h => {
                                        const key = `${closeHourShift}.${h}`
                                        const isSelected = selectedHours.includes(key)
                                        return (
                                            <button
                                                key={h}
                                                className={`gh-hour-btn${isSelected ? ' selected' : ''}`}
                                                onClick={() => toggleHour(h)}
                                                style={{
                                                    background: isSelected
                                                        ? '#68D391'
                                                        : isDark ? 'rgba(255,255,255,0.04)' : 'white',
                                                    color: isSelected
                                                        ? '#1a202c'
                                                        : isDark ? 'rgba(255,255,255,0.7)' : '#4A5568',
                                                }}
                                            >
                                                {h}:00
                                            </button>
                                        )
                                    })}
                                </Flex>
                                {selectedHours.length > 0 && (
                                    <HStack mt="12px" flexWrap="wrap" spacing="1">
                                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.72rem" color="gray.400">Seleccionadas:</Text>
                                        {selectedHours.map(h => (
                                            <Tag key={h} colorScheme="green" size="sm" borderRadius="full">
                                                <TagLabel>{h.split('.')[1]}:00</TagLabel>
                                                <TagCloseButton onClick={() => setSelectedHours(prev => prev.filter(x => x !== h))} />
                                            </Tag>
                                        ))}
                                    </HStack>
                                )}
                            </Box>
                        )}
                        <StyledTextarea placeholder="Motivo (opcional)" value={closeHourReason} onChange={e => setCloseHourReason(e.target.value)} theme={theme} />
                        <button className="gh-action-btn"
                            style={{ background: 'rgba(104,211,145,0.12)', color: '#68D391' }}
                            onClick={handleCloseHours}
                        >
                            Cerrar horarios seleccionados
                        </button>
                    </VStack>
                )}

                {/* AGREGAR HORA */}
                {activeTab === 'add-hour' && (
                    <VStack align="stretch" spacing="16px">
                        <SectionLabel>Agregar hora permanentemente</SectionLabel>
                        <AlertBanner
                            type="warning"
                            title="Cambio permanente"
                            description="Esta hora se agregará al calendario base y al semanal activo. La eliminación deberá hacerse manualmente."
                        />
                        <StyledSelect placeholder="Seleccionar día" value={addHourDay} onChange={e => { setAddHourDay(e.target.value); setAddHourShift(''); }} theme={theme}>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                        </StyledSelect>
                        {addHourDay && (
                            <StyledSelect placeholder="Seleccionar turno" value={addHourShift} onChange={e => setAddHourShift(e.target.value)} theme={theme}>
                                <option value="mañana">Mañana</option>
                                <option value="tarde">Tarde</option>
                            </StyledSelect>
                        )}
                        {addHourShift && (
                            <Box>
                                {getNewAvailableHours().length === 0 ? (
                                    <Text fontFamily='"Poppins", sans-serif' fontSize="0.82rem" color="orange.400" lineHeight="1.6">
                                        Todos los horarios del turno {addHourShift} ya existen en {addHourDay}. Podés ingresar un número de hora personalizado abajo.
                                    </Text>
                                ) : (
                                    <StyledSelect placeholder="Horarios disponibles para agregar" value={addHourValue} onChange={e => setAddHourValue(e.target.value)} theme={theme}>
                                        {getNewAvailableHours().map(h => (
                                            <option key={h} value={h}>{h}:00</option>
                                        ))}
                                    </StyledSelect>
                                )}
                            </Box>
                        )}
                        <button className="gh-action-btn"
                            style={{ background: 'rgba(104,211,145,0.12)', color: '#68D391' }}
                            onClick={handleAddHour}
                        >
                            Agregar hora
                        </button>
                    </VStack>
                )}

                {/* ELIMINAR HORA */}
                {activeTab === 'remove-hour' && (
                    <VStack align="stretch" spacing="16px">
                        <SectionLabel>Eliminar hora permanentemente</SectionLabel>
                        <AlertBanner
                            type="error"
                            title="¡Cuidado! Cambio permanente"
                            description="Esta acción elimina el horario del calendario base y del semanal. Si hay personas inscriptas en ese horario, serán removidas también."
                        />
                        <StyledSelect placeholder="Seleccionar día" value={removeHourDay} onChange={e => { setRemoveHourDay(e.target.value); setRemoveHourShift(''); setRemoveHourValue(''); }} theme={theme}>
                            {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                        </StyledSelect>
                        {removeHourDay && (
                            <StyledSelect placeholder="Seleccionar turno" value={removeHourShift} onChange={e => { setRemoveHourShift(e.target.value); setRemoveHourValue(''); }} theme={theme}>
                                <option value="mañana">Mañana</option>
                                <option value="tarde">Tarde</option>
                            </StyledSelect>
                        )}
                        {removeHourShift && (
                            <StyledSelect placeholder="Seleccionar hora a eliminar" value={removeHourValue} onChange={e => setRemoveHourValue(e.target.value)} theme={theme}>
                                {getExistingHours().map(h => (
                                    <option key={h} value={h}>{h}:00</option>
                                ))}
                            </StyledSelect>
                        )}
                        <button className="gh-action-btn danger" onClick={handleRemoveHour}>
                            Eliminar hora permanentemente
                        </button>
                    </VStack>
                )}
            </Box>

            {/* ── Cierres activos ── */}
            <Box>
                <Flex alignItems="center" gap="12px" mb={['16px', '22px']}>
                    <Box w="28px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Cierres activos
                    </Text>
                </Flex>

                {loading ? (
                    <Flex justify="center" py="40px">
                        <Spinner color="green.400" size="lg" thickness="3px" />
                    </Flex>
                ) : closedSchedules.length === 0 ? (
                    <Box
                        bg={panelBg}
                        border="1px solid"
                        borderColor={panelBorder}
                        borderRadius="14px"
                        p="28px"
                        textAlign="center"
                    >
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                            No hay cierres activos en este momento.
                        </Text>
                    </Box>
                ) : (
                    <VStack align="stretch" spacing="10px">
                        {closedSchedules.map((cs, i) => (
                            <Box
                                key={cs.id}
                                className="gh-cierre-card"
                                bg={panelBg}
                                border="1px solid"
                                borderColor={panelBorder}
                                borderRadius="14px"
                                p={['16px', '20px']}
                                style={{ animationDelay: `${i * 0.06}s` }}
                            >
                                <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap="12px">
                                    <Box flex="1">
                                        <Flex alignItems="center" gap="10px" mb="6px" flexWrap="wrap">
                                            <Text
                                                fontFamily='"Playfair Display", serif'
                                                fontSize={['1rem', '1.1rem']}
                                                fontWeight="700"
                                                color={isDark ? 'white' : 'gray.800'}
                                                textTransform="capitalize"
                                            >
                                                {cs.day}
                                            </Text>
                                            <Box
                                                px="10px" py="3px"
                                                borderRadius="full"
                                                bg={cs.closedDay ? 'rgba(252,129,129,0.12)' : 'rgba(251,191,36,0.12)'}
                                                border="1px solid"
                                                borderColor={cs.closedDay ? 'rgba(252,129,129,0.4)' : 'rgba(251,191,36,0.4)'}
                                            >
                                                <Text
                                                    fontFamily='"Poppins", sans-serif'
                                                    fontSize="0.65rem"
                                                    fontWeight="600"
                                                    letterSpacing="0.1em"
                                                    textTransform="uppercase"
                                                    color={cs.closedDay ? '#FC8181' : '#F59E0B'}
                                                >
                                                    {cs.closedDay ? 'Día cerrado' : 'Horas cerradas'}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        {cs.reason && (
                                            <Text fontFamily='"Poppins", sans-serif' fontSize="0.78rem" color="gray.500" mb="6px">
                                                {cs.reason}
                                            </Text>
                                        )}
                                        {!cs.closedDay && cs.closedHours?.length > 0 && (
                                            <HStack flexWrap="wrap" spacing="6px" mt="4px">
                                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.7rem" color="gray.400">Horas:</Text>
                                                {cs.closedHours.map(h => (
                                                    <Tag key={h} size="sm" borderRadius="full" colorScheme="orange">
                                                        <TagLabel>{h.split('.')[1]}:00 ({h.split('.')[0]})</TagLabel>
                                                    </Tag>
                                                ))}
                                            </HStack>
                                        )}
                                    </Box>
                                    <button className="gh-reopen-btn" onClick={() => handleReopen(cs.id, cs.day)}>
                                        ✓ Reabrir
                                    </button>
                                </Flex>
                            </Box>
                        ))}
                    </VStack>
                )}
            </Box>
        </Box>
    );
};

export default GestionHorarios;