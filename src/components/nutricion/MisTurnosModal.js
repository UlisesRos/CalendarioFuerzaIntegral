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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const MisTurnosModal = ({ isOpen, onClose, userEmail, apiUrl }) => {
    const [turnos, setTurnos] = useState([]);
    const [cargando, setCargando] = useState(true);

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
                        <VStack spacing={4} align="stretch" textTransform='capitalize'>
                            {turnos.map((t, index) => {
                                const fechaFormateada = format(parseISO(t.fecha), "EEEE d 'de' MMMM", { locale: es });

                                return (
                                <Text key={index}>
                                    <Text>
                                        📅 <strong>{fechaFormateada}</strong> a las 🕒 <strong>{t.hora} HS</strong> con <strong>{t.profe}</strong>
                                    </Text>

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
