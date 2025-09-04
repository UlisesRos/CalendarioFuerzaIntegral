import { useEffect, useState } from 'react';
import {
    Box, Text, Button, useToast, Heading,
    Flex, Stack
} from '@chakra-ui/react';
import axios from 'axios';
import { format, isBefore, startOfMonth, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const AdminTurnosHistorial = ({ apiUrl }) => {
    const [turnos, setTurnos] = useState([]);
    const [filtroProfe, setFiltroProfe] = useState(null);
    const toast = useToast();
    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`${apiUrl}/api/nutricion`)
        .then((res) => {
            const todosLosTurnos = res.data;
            const fechaInicioMesAnterior = startOfMonth(subMonths(new Date(), 1));

            const turnosFiltrados = todosLosTurnos.filter((t) => {
                const turnoFecha = new Date(t.fecha);
                return turnoFecha >= fechaInicioMesAnterior;
            });

            const turnosParaEliminar = todosLosTurnos.filter((t) => {
                const turnoFecha = new Date(t.fecha);
                return isBefore(turnoFecha, fechaInicioMesAnterior);
            });

            if (turnosParaEliminar.length > 0) {
                axios.post(`${apiUrl}/api/nutricion/limpiar`, { turnos: turnosParaEliminar })
                    .then(() => console.log('Turnos antiguos eliminados'));
            }

            setTurnos(turnosFiltrados);
        })
        .catch((err) => console.error(err));
    }, []);

    const cancelarTurno = (fecha, hora) => {
        const confirmar = window.confirm('¿Deseas cancelar este turno?')

        if(confirmar){
            axios
                .delete(`${apiUrl}/api/nutricion/cancelar`, { data: { fecha, hora } })
                .then(() => {
                    toast({ title: 'Turno cancelado', status: 'info', duration: 3000 });
                    setTurnos(turnos.filter(t => t.fecha !== fecha || t.hora !== hora));
                })
                .catch(() => {
                    toast({ title: 'Error al cancelar turno', status: 'error', duration: 3000 });
                });
        }
    };

    const turnosMostrados = filtroProfe
        ? turnos.filter(t => t.profe === filtroProfe)
        : turnos;

    return (
        <Box p={[4, 6, 8]}>
            <Heading textAlign='center' size={['md', 'lg']} mb={6} fontFamily='poppins'>
                Historial de Turnos
            </Heading>

            {/* Botón volver */}
            <Flex justify='center' mb={6}>
                <Button onClick={() => navigate('/homenutricion')} colorScheme='green'>
                    Volver
                </Button>
            </Flex>

            {/* Filtros */}
            <Flex justify="center" gap={3} mb={8} flexWrap="wrap">
                <Button onClick={() => setFiltroProfe(null)} colorScheme={!filtroProfe ? 'green' : 'gray'}>
                    Todas
                </Button>
                <Button onClick={() => setFiltroProfe('Julieta Martini')} colorScheme={filtroProfe === 'Julieta Martini' ? 'green' : 'gray'}>
                    Julieta Martini
                </Button>
                <Button onClick={() => setFiltroProfe('Florencia Bertaña')} colorScheme={filtroProfe === 'Florencia Bertaña' ? 'green' : 'gray'}>
                    Florencia Bertaña
                </Button>
            </Flex>

            {/* Lista de turnos responsiva */}
            <Stack spacing={6}>
                {turnosMostrados.map((turno, index) => (
                    <Flex
                        key={index}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        direction={['column', 'column', 'row']}
                        justify="space-between"
                        gap={4}
                        w="100%"
                        maxW="800px"
                        mx="auto"
                    >
                        <Box textTransform='capitalize' flex="1">
                            <Text><strong>Fecha:</strong> {format(new Date(turno.fecha), "EEEE d 'de' MMMM yyyy", { locale: es })}</Text>
                            <Text><strong>Hora:</strong> {turno.hora}</Text>
                            <Text><strong>Nutricionista:</strong> {turno.profe}</Text>
                        </Box>
                        <Box flex="1">
                            <Text textTransform='capitalize'><strong>Usuario:</strong> {turno.usuario?.nombre}</Text>
                            <Text><strong>Email:</strong> {turno.usuario?.email}</Text>
                            <Text><strong>Celular:</strong> {turno.usuario?.celular}</Text>
                            <Button mt={2} size="sm" colorScheme="red" onClick={() => cancelarTurno(turno.fecha, turno.hora)} w={['100%', 'auto']}>
                                Cancelar turno
                            </Button>
                        </Box>
                    </Flex>
                ))}
            </Stack>
        </Box>
    );
};

export default AdminTurnosHistorial;

