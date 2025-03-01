import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Stack } from "@chakra-ui/react"
import HistorialPagos from "./HistorialPagos";

const ClienteModal = ({isOpen, onClose, clienteSeleccionado, theme}) => {
        
    const formatFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0'); // Asegura que sea de 2 dígitos
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes comienza desde 0
        const anio = fecha.getFullYear();
    
        return `${dia}-${mes}-${anio}`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent w='80%'>
                    <ModalHeader
                        textAlign='center'
                        >
                        Datos Personales
                    </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <Text
                            textTransform='capitalize'
                            >
                            <strong>Nombre:</strong> {clienteSeleccionado.username}, {clienteSeleccionado.userlastname}
                        </Text>
                        <Text>
                            <strong>Telefono:</strong> {clienteSeleccionado.usertelefono}
                        </Text>
                        <Text>
                            <strong>Email:</strong> {clienteSeleccionado.useremail}
                        </Text>
                        <Text>
                            <strong>Documento:</strong> {clienteSeleccionado.documento}
                        </Text>
                        <Text>
                            <strong>Fecha Ingreso:</strong> {formatFecha(clienteSeleccionado.created_at)} 
                        </Text>
                        {
                            clienteSeleccionado.descuento && (
                                <Text
                                    color='green'
                                    textTransform='capitalize'
                                    >
                                    <strong>Descuento:</strong> {clienteSeleccionado.descuento} 
                                </Text>
                            )
                        }
                        <HistorialPagos clienteSeleccionado={clienteSeleccionado} theme={theme} />
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ClienteModal