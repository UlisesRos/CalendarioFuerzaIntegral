import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Flex, Heading, Text, Textarea, VStack, Spinner, useToast } from '@chakra-ui/react';
import ReactSelect from 'react-select';
import Swal from 'sweetalert2';
import axios from 'axios';

const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const TURNOS = ['mañana', 'tarde'];

// ─── Estilos globales ─────────────────────────────────────────────────────────
const restriccionesStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes panelIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .rh-panel  { animation: panelIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .rh-card   { animation: fadeSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }

    .rh-mode-btn {
        transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: 'Poppins', sans-serif;
        cursor: pointer;
        border-radius: 12px;
        padding: 14px 16px;
        text-align: left;
        border: 1px solid;
        width: 100%;
    }
    .rh-mode-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 22px rgba(0,0,0,0.12);
    }

    .rh-hour-btn {
        transition: all 0.2s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.76rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        padding: 6px 11px;
        border: 1px solid;
        min-width: 58px;
    }
    .rh-hour-btn:hover {
        transform: translateY(-1px);
    }

    .rh-mini-btn {
        transition: all 0.2s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.66rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 7px;
        padding: 4px 10px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: transparent;
        white-space: nowrap;
    }
    .rh-mini-btn:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
    }

    .rh-action-btn {
        transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        border-radius: 10px;
        padding: 11px 20px;
        border: 1px solid rgba(104, 211, 145, 0.5);
        background: rgba(104,211,145,0.12);
        color: #68D391;
        width: 100%;
    }
    .rh-action-btn:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 10px 28px rgba(0,0,0,0.15);
    }
    .rh-action-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .rh-action-btn.danger {
        background: transparent;
        border-color: rgba(252, 129, 129, 0.5);
        color: #FC8181;
    }
    .rh-action-btn.danger:hover:not(:disabled) {
        background: rgba(252, 129, 129, 0.1);
        border-color: #FC8181;
    }

    .rh-list-btn {
        transition: all 0.25s ease;
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 600;
        cursor: pointer;
        border-radius: 8px;
        padding: 6px 12px;
        border: 1px solid;
        background: transparent;
        white-space: nowrap;
    }
    .rh-list-btn:hover {
        transform: translateY(-1px);
    }

    .rh-check {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        line-height: 1.5;
    }
`;

// ─── react-select styles ──────────────────────────────────────────────────────
const buildSelectStyles = (isDark) => ({
    control: (base, state) => ({
        ...base,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '0.85rem',
        borderRadius: '10px',
        border: state.isFocused ? '1px solid #68D391' : '1px solid rgba(104,211,145,0.35)',
        boxShadow: state.isFocused ? '0 0 0 1px #68D391' : 'none',
        background: isDark ? 'rgba(255,255,255,0.04)' : 'white',
        color: isDark ? 'rgba(255,255,255,0.85)' : '#2D3748',
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
        zIndex: 9999,
    }),
    // El menú se renderiza en un portal sobre el body para que no lo tape
    // ninguna tarjeta de la página (las animaciones crean contextos de apilamiento)
    menuPortal: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        background: isDark ? '#1a202c' : 'white',
        borderRadius: '10px',
        maxHeight: '260px',
    }),
    option: (base, state) => ({
        ...base,
        background: state.isSelected
            ? 'rgba(104,211,145,0.2)'
            : state.isFocused
                ? 'rgba(104,211,145,0.08)'
                : 'transparent',
        color: state.isSelected ? '#68D391' : isDark ? 'rgba(255,255,255,0.85)' : '#2D3748',
        cursor: 'pointer',
        textTransform: 'capitalize',
        transition: 'background 0.15s ease',
    }),
    placeholder: (base) => ({ ...base, color: 'rgba(160,174,192,0.8)', fontSize: '0.83rem' }),
    singleValue: (base) => ({
        ...base,
        color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748',
        textTransform: 'capitalize',
    }),
    input: (base) => ({ ...base, color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748' }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (base) => ({ ...base, color: '#68D391' }),
});

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
    );
}

function StepBadge({ numero }) {
    return (
        <Flex
            w="22px"
            h="22px"
            borderRadius="full"
            bg="rgba(104,211,145,0.15)"
            border="1px solid rgba(104,211,145,0.45)"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
        >
            <Text fontFamily='"Poppins", sans-serif' fontSize="0.68rem" fontWeight="700" color="#68D391">
                {numero}
            </Text>
        </Flex>
    );
}

// ─── Componente principal ─────────────────────────────────────────────────────
const RestriccionesHorarios = ({ theme, apiUrl }) => {
    const toast = useToast();
    const isDark = theme === 'dark';

    const [usuarios, setUsuarios] = useState([]);
    const [calendarioBase, setCalendarioBase] = useState(null);
    const [restricciones, setRestricciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [mode, setMode] = useState('allow');
    const [slots, setSlots] = useState([]);
    const [reason, setReason] = useState('');
    const [limpiarTurnos, setLimpiarTurnos] = useState(true);
    const [restriccionActual, setRestriccionActual] = useState(null);

    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white';
    const panelBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)';
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748';

    const showToast = useCallback((title, description, status) => {
        toast({ title, description, status, duration: 4500, isClosable: true, position: 'top-right' });
    }, [toast]);

    // ── Carga inicial ────────────────────────────────────────────────────────
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [usersRes, baseRes, semanalRes, restRes] = await Promise.all([
                axios.get(`${apiUrl}/api/auth/users`),
                axios.get(`${apiUrl}/api/admincalendar`),
                axios.get(`${apiUrl}/api/calendar`),
                axios.get(`${apiUrl}/api/schedule-restrictions`),
            ]);

            setUsuarios((usersRes.data || []).filter((u) => u.role !== 'admin'));
            setCalendarioBase({ base: baseRes.data, semanal: semanalRes.data });
            setRestricciones(restRes.data || []);
        } catch (error) {
            console.error('Error cargando los datos', error);
            showToast('Error', 'No se pudieron cargar los datos. Probá recargar la página.', 'error');
        } finally {
            setLoading(false);
        }
    }, [apiUrl, showToast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Horarios reales del gimnasio (base + semanal, sin duplicados) ────────
    const horariosPorDia = useMemo(() => {
        const resultado = {};
        if (!calendarioBase) return resultado;

        DIAS.forEach((day) => {
            resultado[day] = {};
            TURNOS.forEach((shift) => {
                const horas = new Set();
                [calendarioBase.base, calendarioBase.semanal].forEach((cal) => {
                    const data = cal?.[day]?.[shift];
                    if (data && typeof data === 'object') {
                        Object.keys(data).forEach((h) => {
                            if (Array.isArray(data[h])) horas.add(Number(h));
                        });
                    }
                });
                const ordenadas = [...horas].filter((h) => !isNaN(h)).sort((a, b) => a - b);
                if (ordenadas.length > 0) resultado[day][shift] = ordenadas;
            });
        });

        return resultado;
    }, [calendarioBase]);

    const todosLosSlots = useMemo(() => {
        const lista = [];
        DIAS.forEach((day) => {
            TURNOS.forEach((shift) => {
                (horariosPorDia[day]?.[shift] || []).forEach((hour) => {
                    lista.push(`${day}.${shift}.${hour}`);
                });
            });
        });
        return lista;
    }, [horariosPorDia]);

    // ── Selección de usuario ─────────────────────────────────────────────────
    const opcionesUsuarios = useMemo(() => (
        usuarios
            .map((u) => ({
                value: u._id,
                label: `${u.username || ''} ${u.userlastname || ''}`.trim(),
                documento: u.documento,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
    ), [usuarios]);

    const cargarRestriccionDe = async (userId) => {
        try {
            const { data } = await axios.get(`${apiUrl}/api/schedule-restrictions/user/${userId}`);
            if (data) {
                setRestriccionActual(data);
                setMode(data.mode || 'allow');
                setSlots(Array.isArray(data.slots) ? data.slots : []);
                setReason(data.reason || '');
            } else {
                setRestriccionActual(null);
                setMode('allow');
                setSlots([]);
                setReason('');
            }
        } catch (error) {
            console.error('Error obteniendo la restricción del usuario', error);
            setRestriccionActual(null);
            setMode('allow');
            setSlots([]);
            setReason('');
        }
    };

    const handleSelectUser = (opcion) => {
        setSelectedUser(opcion);
        if (opcion?.value) cargarRestriccionDe(opcion.value);
    };

    // ── Manejo de horarios seleccionados ─────────────────────────────────────
    const toggleSlot = (day, shift, hour) => {
        const key = `${day}.${shift}.${hour}`;
        setSlots((prev) => (prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]));
    };

    const slotsDelDia = (day) => {
        const lista = [];
        TURNOS.forEach((shift) => {
            (horariosPorDia[day]?.[shift] || []).forEach((hour) => lista.push(`${day}.${shift}.${hour}`));
        });
        return lista;
    };

    const toggleDia = (day) => {
        const delDia = slotsDelDia(day);
        const todosPuestos = delDia.length > 0 && delDia.every((s) => slots.includes(s));
        setSlots((prev) => (
            todosPuestos
                ? prev.filter((s) => !delDia.includes(s))
                : [...new Set([...prev, ...delDia])]
        ));
    };

    const toggleTurnoCompleto = (day, shift) => {
        const delTurno = (horariosPorDia[day]?.[shift] || []).map((hour) => `${day}.${shift}.${hour}`);
        const todosPuestos = delTurno.length > 0 && delTurno.every((s) => slots.includes(s));
        setSlots((prev) => (
            todosPuestos
                ? prev.filter((s) => !delTurno.includes(s))
                : [...new Set([...prev, ...delTurno])]
        ));
    };

    // ── Resumen de la configuración ──────────────────────────────────────────
    const resumen = useMemo(() => {
        const total = todosLosSlots.length;
        const elegidos = slots.filter((s) => todosLosSlots.includes(s)).length;
        const permitidos = mode === 'allow' ? elegidos : total - elegidos;
        return { total, elegidos, permitidos, prohibidos: total - permitidos };
    }, [slots, mode, todosLosSlots]);

    // ── Guardar / eliminar ───────────────────────────────────────────────────
    const handleGuardar = async () => {
        if (!selectedUser) return showToast('Falta el usuario', 'Elegí a quién querés restringirle los horarios.', 'warning');
        if (slots.length === 0) return showToast('Faltan horarios', 'Seleccioná al menos un horario.', 'warning');

        if (mode === 'allow' && resumen.permitidos === 0) {
            return showToast('Configuración inválida', 'Con esta configuración el usuario no podría anotarse en ningún horario.', 'warning');
        }

        try {
            setGuardando(true);
            const { data } = await axios.post(`${apiUrl}/api/schedule-restrictions`, {
                userId: selectedUser.value,
                mode,
                slots,
                reason,
                activo: true,
                limpiarTurnos,
            });

            const liberados = data.turnosLiberados || [];
            showToast(
                '¡Restricción guardada!',
                liberados.length > 0
                    ? `${selectedUser.label} fue removido de ${liberados.length} turno(s) que ya no tiene permitidos.`
                    : `Los horarios de ${selectedUser.label} quedaron actualizados.`,
                'success'
            );

            setRestriccionActual(data.data);
            fetchData();
        } catch (error) {
            showToast('Error', error.response?.data?.error || 'No se pudo guardar la restricción.', 'error');
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (id, nombre) => {
        const confirmacion = await Swal.fire({
            title: '¿Quitar la restricción?',
            text: `${nombre} va a poder anotarse en cualquier horario del calendario.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, quitar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#68D391',
            cancelButtonColor: '#A0AEC0',
        });
        if (!confirmacion.isConfirmed) return;

        try {
            await axios.delete(`${apiUrl}/api/schedule-restrictions/${id}`);
            showToast('Restricción eliminada', `${nombre} ya no tiene horarios restringidos.`, 'success');

            if (restriccionActual?.id === id) {
                setRestriccionActual(null);
                setSlots([]);
                setReason('');
                setMode('allow');
            }
            fetchData();
        } catch (error) {
            showToast('Error', error.response?.data?.error || 'No se pudo eliminar la restricción.', 'error');
        }
    };

    const handleToggleActivo = async (restriccion) => {
        try {
            const { data } = await axios.patch(`${apiUrl}/api/schedule-restrictions/${restriccion.id}/toggle`);
            showToast('Listo', data.message, 'success');
            if (restriccionActual?.id === restriccion.id) setRestriccionActual(data.data);
            fetchData();
        } catch (error) {
            showToast('Error', error.response?.data?.error || 'No se pudo cambiar el estado.', 'error');
        }
    };

    const handleEditar = (restriccion) => {
        const nombre = `${restriccion.user?.username || ''} ${restriccion.user?.userlastname || ''}`.trim();
        setSelectedUser({ value: restriccion.user?._id, label: nombre });
        setRestriccionActual(restriccion);
        setMode(restriccion.mode || 'allow');
        setSlots(Array.isArray(restriccion.slots) ? restriccion.slots : []);
        setReason(restriccion.reason || '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ── Colores según el modo elegido ────────────────────────────────────────
    const colorSeleccion = mode === 'allow' ? '#68D391' : '#FC8181';
    const bgSeleccion = mode === 'allow' ? 'rgba(104,211,145,0.16)' : 'rgba(252,129,129,0.16)';

    if (loading) {
        return (
            <Flex w="100%" h="60vh" align="center" justify="center" flexDir="column" gap="12px">
                <Spinner size="lg" color="green.400" thickness="3px" />
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                    Cargando usuarios y horarios...
                </Text>
            </Flex>
        );
    }

    return (
        <Box maxW="920px" mx="auto" px={['16px', '24px', '32px']} py={['32px', '52px']}>
            <style>{restriccionesStyles}</style>

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
                    Restricción de Horarios
                </Heading>
                <Text
                    mt="10px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize={['0.8rem', '0.86rem']}
                    color="gray.500"
                    lineHeight="1.6"
                    maxW="640px"
                >
                    Elegí un usuario y definí en qué horarios puede o no puede anotarse. Ideal para promociones
                    de horarios específicos o para limitar el acceso a determinados turnos.
                </Text>
            </Box>

            {/* ── Formulario ── */}
            <Box
                className="rh-panel"
                bg={panelBg}
                border="1px solid"
                borderColor={panelBorder}
                borderRadius="16px"
                p={['20px', '28px', '32px']}
                mb="40px"
            >
                {/* PASO 1 — Usuario */}
                <Flex alignItems="center" gap="10px" mb="14px">
                    <StepBadge numero="1" />
                    <Text fontFamily='"Poppins", sans-serif' fontSize="0.8rem" fontWeight="600" color={textMain}>
                        Elegí el usuario
                    </Text>
                </Flex>
                <ReactSelect
                    options={opcionesUsuarios}
                    value={selectedUser}
                    onChange={handleSelectUser}
                    placeholder="Buscar por nombre y apellido..."
                    noOptionsMessage={() => 'No se encontró ningún usuario'}
                    styles={buildSelectStyles(isDark)}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuShouldScrollIntoView={false}
                    isSearchable
                />

                {restriccionActual && (
                    <Box
                        mt="12px"
                        bg="rgba(251,191,36,0.08)"
                        border="1px solid rgba(251,191,36,0.35)"
                        borderRadius="10px"
                        p="12px 14px"
                    >
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.76rem" color="#F59E0B" lineHeight="1.6">
                            Este usuario ya tiene una restricción cargada
                            {restriccionActual.activo === false ? ' (pausada)' : ''}. Los cambios que guardes la reemplazan.
                        </Text>
                    </Box>
                )}

                {selectedUser && (
                    <>
                        {/* PASO 2 — Tipo de restricción */}
                        <Box mt="28px">
                            <Flex alignItems="center" gap="10px" mb="14px">
                                <StepBadge numero="2" />
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.8rem" fontWeight="600" color={textMain}>
                                    ¿Qué querés hacer?
                                </Text>
                            </Flex>

                            <Flex gap="12px" flexDir={['column', 'row']}>
                                <button
                                    className="rh-mode-btn"
                                    onClick={() => setMode('allow')}
                                    style={{
                                        borderColor: mode === 'allow' ? '#68D391' : 'rgba(160,174,192,0.3)',
                                        background: mode === 'allow' ? 'rgba(104,211,145,0.1)' : 'transparent',
                                    }}
                                >
                                    <Text fontSize="0.84rem" fontWeight="700" color={mode === 'allow' ? '#68D391' : textMain} mb="4px">
                                        ✅ Sólo estos horarios
                                    </Text>
                                    <Text fontSize="0.72rem" color="gray.500" lineHeight="1.5">
                                        El usuario únicamente se puede anotar en los horarios que marques. El resto le queda bloqueado.
                                    </Text>
                                </button>

                                <button
                                    className="rh-mode-btn"
                                    onClick={() => setMode('block')}
                                    style={{
                                        borderColor: mode === 'block' ? '#FC8181' : 'rgba(160,174,192,0.3)',
                                        background: mode === 'block' ? 'rgba(252,129,129,0.1)' : 'transparent',
                                    }}
                                >
                                    <Text fontSize="0.84rem" fontWeight="700" color={mode === 'block' ? '#FC8181' : textMain} mb="4px">
                                        🚫 Bloquear estos horarios
                                    </Text>
                                    <Text fontSize="0.72rem" color="gray.500" lineHeight="1.5">
                                        El usuario se puede anotar en todos los horarios menos en los que marques.
                                    </Text>
                                </button>
                            </Flex>
                        </Box>

                        {/* PASO 3 — Horarios */}
                        <Box mt="28px">
                            <Flex alignItems="center" gap="10px" mb="6px" flexWrap="wrap">
                                <StepBadge numero="3" />
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.8rem" fontWeight="600" color={textMain}>
                                    {mode === 'allow' ? 'Marcá los horarios permitidos' : 'Marcá los horarios bloqueados'}
                                </Text>
                            </Flex>
                            <Flex gap="8px" mb="16px" flexWrap="wrap" ml={['0', '32px']}>
                                <button className="rh-mini-btn" onClick={() => setSlots(todosLosSlots)}>
                                    Marcar todo
                                </button>
                                <button className="rh-mini-btn" onClick={() => setSlots([])}>
                                    Limpiar todo
                                </button>
                            </Flex>

                            <VStack align="stretch" spacing="12px">
                                {DIAS.map((day) => {
                                    const turnosDelDia = TURNOS.filter((t) => (horariosPorDia[day]?.[t] || []).length > 0);
                                    if (turnosDelDia.length === 0) return null;

                                    const delDia = slotsDelDia(day);
                                    const marcadosDelDia = delDia.filter((s) => slots.includes(s)).length;

                                    return (
                                        <Box
                                            key={day}
                                            border="1px solid"
                                            borderColor={panelBorder}
                                            borderRadius="12px"
                                            p={['12px', '16px']}
                                            bg={isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'}
                                        >
                                            <Flex justifyContent="space-between" alignItems="center" mb="12px" flexWrap="wrap" gap="8px">
                                                <Flex alignItems="baseline" gap="8px">
                                                    <Text
                                                        fontFamily='"Playfair Display", serif'
                                                        fontSize="1.05rem"
                                                        fontWeight="700"
                                                        color={isDark ? 'white' : 'gray.800'}
                                                        textTransform="capitalize"
                                                    >
                                                        {day}
                                                    </Text>
                                                    {marcadosDelDia > 0 && (
                                                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.68rem" color={colorSeleccion}>
                                                            {marcadosDelDia} marcado{marcadosDelDia > 1 ? 's' : ''}
                                                        </Text>
                                                    )}
                                                </Flex>
                                                <button className="rh-mini-btn" onClick={() => toggleDia(day)}>
                                                    {marcadosDelDia === delDia.length ? 'Desmarcar día' : 'Todo el día'}
                                                </button>
                                            </Flex>

                                            {turnosDelDia.map((shift) => (
                                                <Box key={shift} mb="10px">
                                                    <Flex alignItems="center" gap="10px" mb="8px">
                                                        <Text
                                                            fontFamily='"Poppins", sans-serif'
                                                            fontSize="0.68rem"
                                                            letterSpacing="0.12em"
                                                            textTransform="uppercase"
                                                            color="gray.500"
                                                        >
                                                            {shift}
                                                        </Text>
                                                        <button className="rh-mini-btn" onClick={() => toggleTurnoCompleto(day, shift)}>
                                                            Turno completo
                                                        </button>
                                                    </Flex>

                                                    <Flex flexWrap="wrap" gap="8px">
                                                        {(horariosPorDia[day]?.[shift] || []).map((hour) => {
                                                            const key = `${day}.${shift}.${hour}`;
                                                            const marcado = slots.includes(key);
                                                            return (
                                                                <button
                                                                    key={key}
                                                                    className="rh-hour-btn"
                                                                    onClick={() => toggleSlot(day, shift, hour)}
                                                                    style={{
                                                                        background: marcado ? bgSeleccion : isDark ? 'rgba(255,255,255,0.04)' : 'white',
                                                                        color: marcado ? colorSeleccion : isDark ? 'rgba(255,255,255,0.7)' : '#4A5568',
                                                                        borderColor: marcado ? colorSeleccion : 'rgba(160,174,192,0.35)',
                                                                        fontWeight: marcado ? 700 : 500,
                                                                    }}
                                                                >
                                                                    {hour}:00
                                                                </button>
                                                            );
                                                        })}
                                                    </Flex>
                                                </Box>
                                            ))}
                                        </Box>
                                    );
                                })}
                            </VStack>
                        </Box>

                        {/* PASO 4 — Motivo y opciones */}
                        <Box mt="28px">
                            <Flex alignItems="center" gap="10px" mb="14px">
                                <StepBadge numero="4" />
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.8rem" fontWeight="600" color={textMain}>
                                    Motivo y confirmación
                                </Text>
                            </Flex>

                            <Textarea
                                placeholder="Motivo (opcional): Promo turno mañana, plan reducido, etc. El usuario lo va a ver en su calendario."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
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
                            />

                            <Box
                                as="label"
                                className="rh-check"
                                mt="14px"
                                display="flex"
                                color={isDark ? 'rgba(255,255,255,0.75)' : '#4A5568'}
                            >
                                <input
                                    type="checkbox"
                                    checked={limpiarTurnos}
                                    onChange={(e) => setLimpiarTurnos(e.target.checked)}
                                    style={{ accentColor: '#68D391', width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                <span>
                                    Sacar al usuario de los turnos que ya tenía reservados y ahora le quedan prohibidos
                                </span>
                            </Box>

                            {/* Resumen */}
                            <Box
                                mt="18px"
                                bg={isDark ? 'rgba(104,211,145,0.06)' : 'rgba(104,211,145,0.07)'}
                                border="1px solid rgba(104,211,145,0.3)"
                                borderRadius="12px"
                                p="14px 16px"
                            >
                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.78rem" color={textMain} lineHeight="1.7">
                                    <Text as="span" textTransform="capitalize" fontWeight="700">{selectedUser.label}</Text>
                                    {' '}va a poder anotarse en{' '}
                                    <Text as="span" fontWeight="700" color="#68D391">{resumen.permitidos}</Text>
                                    {' '}de los {resumen.total} horarios del gimnasio
                                    {resumen.prohibidos > 0 && (
                                        <>
                                            {' ('}
                                            <Text as="span" fontWeight="700" color="#FC8181">{resumen.prohibidos}</Text>
                                            {' bloqueados)'}
                                        </>
                                    )}.
                                </Text>
                            </Box>

                            <Flex gap="10px" mt="18px" flexDir={['column', 'row']}>
                                <button className="rh-action-btn" onClick={handleGuardar} disabled={guardando}>
                                    {guardando ? 'Guardando...' : 'Guardar restricción'}
                                </button>
                                {restriccionActual && (
                                    <button
                                        className="rh-action-btn danger"
                                        onClick={() => handleEliminar(restriccionActual.id, selectedUser.label)}
                                        disabled={guardando}
                                    >
                                        Quitar restricción
                                    </button>
                                )}
                            </Flex>
                        </Box>
                    </>
                )}
            </Box>

            {/* ── Restricciones activas ── */}
            <Box>
                <SectionLabel>Usuarios con horarios restringidos</SectionLabel>

                {restricciones.length === 0 ? (
                    <Box
                        bg={panelBg}
                        border="1px solid"
                        borderColor={panelBorder}
                        borderRadius="14px"
                        p="28px"
                        textAlign="center"
                    >
                        <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">
                            Todavía no hay usuarios con restricciones. Todos pueden anotarse en cualquier horario.
                        </Text>
                    </Box>
                ) : (
                    <VStack align="stretch" spacing="10px">
                        {restricciones.map((r, i) => {
                            const nombre = `${r.user?.username || ''} ${r.user?.userlastname || ''}`.trim() || 'Usuario eliminado';
                            const esAllow = r.mode === 'allow';
                            const pausada = r.activo === false;

                            return (
                                <Box
                                    key={r.id}
                                    className="rh-card"
                                    bg={panelBg}
                                    border="1px solid"
                                    borderColor={panelBorder}
                                    borderRadius="14px"
                                    p={['16px', '20px']}
                                    style={{ animationDelay: `${i * 0.05}s` }}
                                    opacity={pausada ? 0.65 : 1}
                                >
                                    <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap="12px">
                                        <Box flex="1" minW="220px">
                                            <Flex alignItems="center" gap="10px" mb="8px" flexWrap="wrap">
                                                <Text
                                                    fontFamily='"Playfair Display", serif'
                                                    fontSize={['1rem', '1.1rem']}
                                                    fontWeight="700"
                                                    color={isDark ? 'white' : 'gray.800'}
                                                    textTransform="capitalize"
                                                >
                                                    {nombre}
                                                </Text>
                                                <Box
                                                    px="10px"
                                                    py="3px"
                                                    borderRadius="full"
                                                    bg={esAllow ? 'rgba(104,211,145,0.12)' : 'rgba(252,129,129,0.12)'}
                                                    border="1px solid"
                                                    borderColor={esAllow ? 'rgba(104,211,145,0.4)' : 'rgba(252,129,129,0.4)'}
                                                >
                                                    <Text
                                                        fontFamily='"Poppins", sans-serif'
                                                        fontSize="0.63rem"
                                                        fontWeight="600"
                                                        letterSpacing="0.08em"
                                                        textTransform="uppercase"
                                                        color={esAllow ? '#68D391' : '#FC8181'}
                                                    >
                                                        {esAllow ? 'Sólo estos horarios' : 'Horarios bloqueados'}
                                                    </Text>
                                                </Box>
                                                {pausada && (
                                                    <Box px="10px" py="3px" borderRadius="full" bg="rgba(160,174,192,0.15)" border="1px solid rgba(160,174,192,0.4)">
                                                        <Text
                                                            fontFamily='"Poppins", sans-serif'
                                                            fontSize="0.63rem"
                                                            fontWeight="600"
                                                            letterSpacing="0.08em"
                                                            textTransform="uppercase"
                                                            color="gray.400"
                                                        >
                                                            Pausada
                                                        </Text>
                                                    </Box>
                                                )}
                                            </Flex>

                                            {r.reason && (
                                                <Text fontFamily='"Poppins", sans-serif' fontSize="0.76rem" color="gray.500" mb="8px">
                                                    {r.reason}
                                                </Text>
                                            )}

                                            <Flex flexWrap="wrap" gap="6px">
                                                {(r.slots || []).slice(0, 14).map((slot) => {
                                                    const [d, s, h] = slot.split('.');
                                                    return (
                                                        <Box
                                                            key={slot}
                                                            px="8px"
                                                            py="2px"
                                                            borderRadius="6px"
                                                            bg={esAllow ? 'rgba(104,211,145,0.1)' : 'rgba(252,129,129,0.1)'}
                                                            border="1px solid"
                                                            borderColor={esAllow ? 'rgba(104,211,145,0.3)' : 'rgba(252,129,129,0.3)'}
                                                        >
                                                            <Text
                                                                fontFamily='"Poppins", sans-serif'
                                                                fontSize="0.66rem"
                                                                color={esAllow ? '#68D391' : '#FC8181'}
                                                                textTransform="capitalize"
                                                            >
                                                                {d.slice(0, 3)} {h}:00 ({s})
                                                            </Text>
                                                        </Box>
                                                    );
                                                })}
                                                {(r.slots || []).length > 14 && (
                                                    <Text fontFamily='"Poppins", sans-serif' fontSize="0.66rem" color="gray.400" alignSelf="center">
                                                        +{r.slots.length - 14} más
                                                    </Text>
                                                )}
                                            </Flex>
                                        </Box>

                                        <Flex gap="8px" flexWrap="wrap">
                                            <button
                                                className="rh-list-btn"
                                                onClick={() => handleEditar(r)}
                                                style={{ borderColor: 'rgba(104,211,145,0.5)', color: '#68D391' }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="rh-list-btn"
                                                onClick={() => handleToggleActivo(r)}
                                                style={{ borderColor: 'rgba(160,174,192,0.5)', color: '#A0AEC0' }}
                                            >
                                                {pausada ? 'Activar' : 'Pausar'}
                                            </button>
                                            <button
                                                className="rh-list-btn"
                                                onClick={() => handleEliminar(r.id, nombre)}
                                                style={{ borderColor: 'rgba(252,129,129,0.5)', color: '#FC8181' }}
                                            >
                                                Quitar
                                            </button>
                                        </Flex>
                                    </Flex>
                                </Box>
                            );
                        })}
                    </VStack>
                )}
            </Box>
        </Box>
    );
};

export default RestriccionesHorarios;
