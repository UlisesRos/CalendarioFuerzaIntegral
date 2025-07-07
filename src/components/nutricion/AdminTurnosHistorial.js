import { useEffect, useState } from 'react';
import {
    Box, Text, Button, useToast, Heading,
    Flex
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
        const confirmar = window.confirm(
            '¿Deseas cancelar este turno?'
        )

        if(confirmar){
            axios
                .delete(`${apiUrl}/api/nutricion/cancelar`, { data: { fecha, hora } })
                .then(() => {
                    toast({ title: 'Turno cancelado', status: 'info', duration: 3000 });
                    setTurnos(turnos.filter(t => t.fecha !== fecha || t.hora !== hora));
                    setTimeout(() => {
                        window.location.reload()
                    }, 300);
                })
                .catch(() => {
                    toast({ title: 'Error al cancelar turno', status: 'error', duration: 3000 });
                });
        }
    };

    // Aplicar filtro
    const turnosMostrados = filtroProfe
        ? turnos.filter(t => t.profe === filtroProfe)
        : turnos;

    return (
        <Box p={6}>
            <Heading textAlign='center' size="lg" mb={4} fontFamily='poppins'>Historial de Turnos</Heading>
            <Flex
                justify='center'
                mb='15px'
                >
                <Button
                    onClick={() => navigate('/homenutricion')}
                    colorScheme='green'
                    >
                    Volver
                </Button>
            </Flex>
            {/* Filtro por profe */}
            <Flex justify="center" gap={4} mb={6} flexWrap="wrap">
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

            <Flex
                flexDirection={['column', 'column', 'row']}
                flexWrap='wrap'
                columnGap='20px'
                justifyContent='center'
                alignContent='center'
            >
                {turnosMostrados.map((turno, index) => (
                <Flex key={index} mb={4} p={4} borderWidth="1px" flexDirection='row' borderRadius="md" w={['100%', '70%', '45%']} columnGap='30px' justifyContent='center'>
                    <Box textTransform='capitalize'>
                        <Text><strong>Fecha:</strong> {format(new Date(turno.fecha), "EEEE d 'de' MMMM yyyy", { locale: es })}</Text>
                        <Text><strong>Hora:</strong> {turno.hora}</Text>
                        <Text><strong>Nutricionista:</strong> {turno.profe}</Text>
                    </Box>
                    <Box>
                        <Text textTransform='capitalize'><strong>Usuario:</strong> {turno.usuario?.nombre}</Text>
                        <Text><strong>Email:</strong> {turno.usuario?.email}</Text>
                        <Text><strong>Celular:</strong> {turno.usuario?.celular}</Text>
                        <Button mt={2} size="sm" colorScheme="red" onClick={() => cancelarTurno(turno.fecha, turno.hora)}>
                            Cancelar turno
                        </Button>
                    </Box>
                </Flex>
                ))}
            </Flex>
        </Box>
    );
};

export default AdminTurnosHistorial;
