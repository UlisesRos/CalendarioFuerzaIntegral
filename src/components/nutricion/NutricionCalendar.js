import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  Grid,
  useToast,
  Flex,
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { addDays, startOfWeek, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom'
import MisTurnosModal from './MisTurnosModal';

const horariosPorDia = {
  Martes: ['16:00', '17:00'],
  Miércoles: ['17:00', '18:00'],
  Jueves: ['08:00', '09:00', '10:00'],
};

const diasPermitidos = [2, 3, 4]; // 2=Martes, 3=Miércoles, 4=Jueves

const NutricionCalendar = ({ userData, apiUrl }) => {
  const [turnos, setTurnos] = useState([]);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [profeFiltro, setProfeFiltro] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profe = params.get("profe");
    setProfeFiltro(profe);

    axios.get(`${apiUrl}/api/nutricion`)
      .then((res) => {
        const todos = res.data;
        const filtrados = profe ? todos.filter(t => t.profe === profe) : todos;
        setTurnos(filtrados);
      })
      .catch(console.error);
  }, []);

  const semanaInicio = startOfWeek(fechaActual, { weekStartsOn: 1 });
  const semanaActual = diasPermitidos.map((diaNum) =>
    addDays(semanaInicio, diaNum - 1)
  );

  const reservarTurno = (fecha, hora) => {
    const { username, useremail, userlastname, usertelefono } = userData;

    axios
      .post(`${apiUrl}/api/nutricion/reservar`, {
        fecha,
        hora,
        usuario: {
          nombre: `${username} ${userlastname}`,
          email: useremail,
          celular: usertelefono,
        },
      })
      .then(() => {
          toast({
            title: 'Turno reservado.',
            status: 'success',
            duration: 3000,
          });

          // Aseguramos que el nuevo turno también tenga la profe asignada
          const dayName = new Date(fecha).toLocaleDateString('es-ES', { weekday: 'long' });
          let profe = '';
          if (dayName === 'martes' || dayName === 'miércoles') {
            profe = 'Julieta Martini';
          } else if (dayName === 'jueves') {
            profe = 'Florencia Bertaña';
          }

          setTurnos([
            ...turnos,
            {
              fecha,
              hora,
              usuario: {
                nombre: `${username} ${userlastname}`,
                email: useremail,
                celular: usertelefono,
              },
              profe, 
            },
          ]);
        })
      .catch(() => {
        toast({
          title: 'Turno no disponible / Ya tienes un turno en ese horario.',
          status: 'error',
          duration: 3000,
        });
      });
  };

  const cancelarTurno = (fecha, hora) => {
    axios
      .delete(`${apiUrl}/api/nutricion/cancelar`, {
        data: { fecha, hora },
      })
      .then(() => {
        toast({
          title: 'Reserva cancelada.',
          status: 'info',
          duration: 3000,
        });

        setTurnos(turnos.filter((t) => t.fecha !== fecha || t.hora !== hora));
      })
      .catch(() => {
        toast({
          title: 'Error al cancelar turno.',
          status: 'error',
          duration: 3000,
        });
      });
  };

  const getReserva = (fecha, hora) => {
    return turnos.find((t) => t.fecha === fecha && t.hora === hora);
  };

  const irSemanaAnterior = () => {
    setFechaActual(addDays(fechaActual, -7));
  };

  const irSemanaSiguiente = () => {
    setFechaActual(addDays(fechaActual, 7));
  };

  return (
    <Box p={4}>
      <Flex justifyContent='center' mb={4}>
        <Button
          display={userData.role === 'admin' ? 'block' : 'none'}
          colorScheme="green"
          onClick={() => navigate('/admin/historial')}
        >
          Ver Historial de Turnos
        </Button>
        <Box display={userData.role === 'admin' ? 'none' : 'block'}>
          <Button colorScheme="green" onClick={onOpen}>
            Ver Mis Turnos
          </Button>
          <MisTurnosModal isOpen={isOpen} onClose={onClose} userEmail={userData.useremail} apiUrl={apiUrl} />
        </Box>
      </Flex>

      <Flex justify="space-between" align="center" mb={4}>
        <IconButton
          colorScheme='green'
          icon={<ChevronLeftIcon />}
          onClick={irSemanaAnterior}
          aria-label="Semana anterior"
        />
        <Text fontSize={['18px', '2xl']} fontWeight="bold" textAlign='center'>
          Semana del {format(semanaInicio, "d 'de' MMMM yyyy", { locale: es })}
        </Text>
        <IconButton
          colorScheme='green'
          icon={<ChevronRightIcon />}
          onClick={irSemanaSiguiente}
          aria-label="Semana siguiente"
        />
      </Flex>

      {semanaActual.map((fecha) => {
        const diaNombre = format(fecha, 'EEEE', { locale: es });
        const diaCapitalizado = diaNombre.charAt(0).toUpperCase() + diaNombre.slice(1);
        const fechaStr = format(fecha, 'yyyy-MM-dd');
        const horas = horariosPorDia[diaCapitalizado];
        if (!horas) return null;

        const nutricionista =
          diaCapitalizado === 'Martes' || diaCapitalizado === 'Miércoles'
            ? 'Julieta Martini'
            : diaCapitalizado === 'Jueves'
            ? 'Florencia Bertaña'
            : null;

        if (profeFiltro && profeFiltro !== nutricionista) return null;

        return (
          <Box key={fechaStr} mb={6}>
            <Text fontWeight="bold" mb={1}>
              {diaCapitalizado} {format(fecha, "d 'de' MMMM", { locale: es })}
            </Text>
            <Text fontWeight='bold' mb={2} color='green.700' textDecor='underline'>
              {nutricionista && `Nutricionista ${nutricionista}`}
            </Text>
            <Grid templateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={3}>
              {horas.map((hora) => {
                const reserva = getReserva(fechaStr, hora);
                const reservado = !!reserva;
                const nombreUsuario = reserva?.usuario?.nombre || '';

                let label;
                if (reservado) {
                  label = (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold">{hora}</Text>
                      {userData.role === 'admin' || (userData.role === 'user' && userData.username + " " + userData.userlastname === nombreUsuario) ? (
                        <Text fontSize="xs" color="white" whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis' maxW={['100px', '150px', '150px']}>🔒 {nombreUsuario}</Text>
                      ) : (
                        <Text fontSize="xs" color="white" fontWeight="bold">🔒 Reservado</Text>
                      )}
                    </Box>
                  );
                } else {
                  label = hora;
                }

                const handleClick = () => {
                  if (reservado) {
                    if (userData.role === 'admin' || (userData.role === 'user' && userData.username + " " + userData.userlastname === nombreUsuario)) {
                      const confirmar = window.confirm(
                        `¿Cancelar reserva de ${nombreUsuario} el ${hora}?`
                      );
                      if (confirmar) cancelarTurno(fechaStr, hora);
                    }
                  } else {
                    reservarTurno(fechaStr, hora);
                  }
                };

                return (
                  <Button
                    key={hora}
                    colorScheme={reservado ? 'red' : 'green'}
                    onClick={handleClick}
                    textTransform="capitalize"
                    title={reservado ? `Reservado por: ${nombreUsuario}` : 'Disponible'}
                  >
                    {label}
                  </Button>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </Box>
  );
};

export default NutricionCalendar;

