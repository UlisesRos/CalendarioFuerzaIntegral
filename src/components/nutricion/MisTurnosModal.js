// MisTurnosModal.jsx
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const MisTurnosModal = ({ isOpen, onClose, userEmail, apiUrl }) => {
    const [turnos, setTurnos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const toast = useToast()

    useEffect(() => {
        const fetchTurnos = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/nutricion/mis-turnos`, {
            params: { email: userEmail },
            });
            setTurnos(res.data);
        } catch (err) {
            console.error('Error al cargar los turnos del usuario', err);
        } finally {
            setCargando(false);
        }
        };

        if (isOpen) {
        fetchTurnos();
        }
    }, [isOpen, userEmail]);

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

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalOverlay />
            <ModalContent w='90%'>
                <ModalHeader>Mis Turnos</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {cargando ? (
                        <Spinner />
                    ) : turnos.length === 0 ? (
                        <Text>No tenés turnos reservados.</Text>
                    ) : (
                        <VStack spacing={4} align="stretch" textTransform='uppercase'>
                            {turnos.map((t, index) => {
                                const fechaFormateada = format(parseISO(t.fecha), "EEEE d 'de' MMMM", { locale: es });

                                return (
                                    <Text key={index} border='1px solid black' p={2} borderRadius='md' textAlign='center'>
                                        <Text>
                                            📅 <strong>{fechaFormateada}</strong> a las 🕒 <strong>{t.hora} HS</strong> con <strong>{t.profe}</strong>
                                        </Text>
                                        <Button mt={2} size="sm" colorScheme="red" onClick={() => cancelarTurno(t.fecha, t.hora)}>
                                            Cancelar turno
                                        </Button>

                                    </Text>
                                );
                            })}
                        </VStack>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='red' onClick={onClose}>Cerrar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default MisTurnosModal;
