import { 
    Flex, Spinner, Box, Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Stack, useDisclosure, Select 
} from "@chakra-ui/react";
import { useState } from "react";

const HistorialPagos = ({ userData, theme }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [mesSeleccionado, setMesSeleccionado] = useState("");
    const [anioSeleccionado, setAnioSeleccionado] = useState("");

    if(!userData) {
        return(
            <Flex
                w='100%'
                h='70vh'
                align='center'
                justify='center'
                flexDir='column'
                rowGap='10px'
                >
                Cargando...
                <Spinner size='lg' color='green' />
            </Flex>
        )
    }

    const formatFecha = (fechaISO) => {
        const fecha = new Date(fechaISO);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();

        return `${dia}-${mes}-${anio}`;
    };

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Generar años desde 2025 hasta el año actual y futuros
    const anios = Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2025 + i);

    const handleMesChange = (e) => setMesSeleccionado(e.target.value);
    const handleAnioChange = (e) => setAnioSeleccionado(e.target.value);

    // Filtrar los pagos por mes y año
    const pagosFiltrados = userData.historialPagos.filter((pago) => {
        const fechaPago = new Date(pago.fecha);
        const mesPago = fechaPago.getMonth() + 1; 
        const anioPago = fechaPago.getFullYear();

        const cumpleMes = mesSeleccionado ? mesPago === parseInt(mesSeleccionado) : true;
        const cumpleAnio = anioSeleccionado ? anioPago === parseInt(anioSeleccionado) : true;

        return cumpleMes && cumpleAnio; 
    });

    return (
        <>
            <Button
                size="sm"
                backgroundColor={theme === "light" ? "white" : "black"}
                color={theme === "light" ? "black" : "white"}
                border="1px solid #80c687"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                transition="all 0.3s ease"
                _hover={{
                    boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-2px)",
                    backgroundColor: "#80c687",
                    color: theme === "light" ? "white" : "black",
                }}
                onClick={onOpen}
            >
                Historial de Pagos
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent w="80%">
                    <ModalHeader textAlign="center">Todos los pagos realizados</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            <Text textTransform="capitalize">
                                <strong>Nombre:</strong> {userData.username},{" "}
                                {userData.userlastname}
                            </Text>

                            <Select
                                placeholder="Filtrar por mes"
                                onChange={handleMesChange}
                                bg={theme === "light" ? "white" : "gray.700"}
                                color={theme === "light" ? "black" : "white"}
                                borderColor="#80c687"
                            >
                                {meses.map((mes, index) => (
                                    <option key={index} value={index + 1}>
                                        {mes}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                placeholder="Filtrar por año"
                                onChange={handleAnioChange}
                                bg={theme === "light" ? "white" : "gray.700"}
                                color={theme === "light" ? "black" : "white"}
                                borderColor="#80c687"
                            >
                                {anios.map((anio) => (
                                    <option key={anio} value={anio}>
                                        {anio}
                                    </option>
                                ))}
                            </Select>

                            {pagosFiltrados.map((c, i) => {
                                const mesPago = new Date(c.fecha).getMonth(); // Obtener el mes del pago
                                return (
                                    <Box
                                        key={i}
                                        mt="10px"
                                        textAlign="center"
                                        border="1px solid black"
                                        borderRadius="10px"
                                        pt="10px"
                                        pb="10px"
                                    >
                                        <Text fontWeight="bold">{meses[mesPago]}</Text>
                                        <Text textTransform="capitalize">
                                            <strong>Fecha:</strong> {formatFecha(c.fecha)}
                                        </Text>
                                        <Text textTransform="capitalize">
                                            <strong>Días de entrenamiento:</strong>{" "}
                                            {userData.diasentrenamiento}
                                        </Text>
                                        <Text textTransform="capitalize">
                                            <strong>Monto pagado:</strong> ${c.monto}
                                        </Text>
                                        <Text textTransform="capitalize">
                                            <strong>Método:</strong> {c.metodo}
                                        </Text>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default HistorialPagos;
