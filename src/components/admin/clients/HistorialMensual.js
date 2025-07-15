import { useEffect, useState } from 'react';
import axios from 'axios';
import 'animate.css';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  useToast,
  TableContainer,
  Button
} from '@chakra-ui/react';

// Componente para mostrar clientes con "ver más / ver menos"
const ClientesConToggle = ({ clientes }) => {
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const MAX_MOSTRAR = 3;

    const toggleMostrar = () => setMostrarTodos(!mostrarTodos);
    const clientesAMostrar = mostrarTodos ? clientes : clientes.slice(0, MAX_MOSTRAR);

    return (
        <Td textTransform="capitalize">
            {clientesAMostrar.map((cliente, index) => (
                <div key={index}>
                <ul>
                    <li>{cliente.nombre} {cliente.apellido}</li>
                </ul>
                </div>
            ))}
            {clientes.length > MAX_MOSTRAR && (
                <Button
                size="xs"
                variant="link"
                colorScheme="blue"
                mt={1}
                onClick={toggleMostrar}
                >
                {mostrarTodos ? 'Ver menos' : 'Ver más'}
                </Button>
            )}
        </Td>
    );
    };

    function HistorialMensual({ apiUrl }) {
        const [historial, setHistorial] = useState([]);
        const toast = useToast();

        useEffect(() => {
            const obtenerHistorial = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/historial`);
                setHistorial(response.data);
            } catch (error) {
                console.error('Error obteniendo el historial:', error);
                toast({
                title: 'Error',
                description: 'No se pudo obtener el historial mensual',
                status: 'error',
                duration: 5000,
                isClosable: true
                });
            }
            };

            obtenerHistorial();
    }, []);

    return (
        <Box className="animate__animated animate__backInUp" m={['0', '0', '0 20px 0 20px']}>
            <Heading textAlign="center" mb="20px" fontFamily="poppins">
                Historial Mensual
            </Heading>
            <TableContainer>
                <Table variant="simple" colorScheme="green">
                    <Thead>
                        <Tr>
                            <Th fontFamily="poppins">Mes</Th>
                            <Th fontFamily="poppins">Importe Ingresado</Th>
                            <Th fontFamily="poppins">Importe No Ingresado</Th>
                            <Th fontFamily="poppins">Cantidad de Clientes</Th>
                            <Th fontFamily="poppins">Clientes Activos</Th>
                            <Th fontFamily="poppins">Clientes Sin Pagar</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {historial.map((item) => (
                        <Tr key={item._id}>
                            <Td>{item.mes}</Td>
                            <Td color="green" fontWeight="bold">
                                $ {item.importeIngresado.toLocaleString('es-ES')}
                            </Td>
                            <Td color="red" fontWeight="bold">
                                $ {item.importeNoIngresado.toLocaleString('es-ES')}
                            </Td>
                            <Td>{item.cantidadClientes} 👤</Td>
                            <Td>{item.clientesActivos} ✅</Td>
                            <ClientesConToggle clientes={item.clientesSinPagar} />
                        </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default HistorialMensual;
