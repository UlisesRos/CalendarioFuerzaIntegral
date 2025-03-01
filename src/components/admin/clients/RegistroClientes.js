import { Spinner, Box, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Heading, Image, Text, useDisclosure, useToast, Button, Tooltip, Input, Flex, Select } from '@chakra-ui/react'
import pagado from '../../../img/pagado.png'
import nopago from '../../../img/nopago.png'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ClienteModal from './ClienteModal'
import EditUserButton from './EditUserButton'
import basura from '../../../img/basura.png'
import { PRECIOS, DESCUENTO } from '../../../config/precios'
import CountUp from '../clients/utils/CountUp'
import GradientText from '../clients/utils/GradientText'
import 'animate.css'
import ModalIngresos from './ModalIngresos'

function RegistroClientes({ theme, apiUrl }) {

    const [ isLoading, setIsLoading ] = useState(true)
    const [ userData, setUserData ] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [ clienteSeleccionado, setClienteSeleccionado ] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ filtroPago, setFiltroPago ] = useState('todos'); // Estado para el filtro de pago

    const toast = useToast()

    // Traer usuarios
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/auth/users`);
                setUserData(response.data)
            } catch (error) {
                console.error('Error fetching usuario', error)
            } finally {
                setIsLoading(false); 
            }
        }

        fetchUsuario()
    }, []);

    // Función para manejar el cambio en el input de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    // Función para manejar el cambio en el filtro de pago
    const handleFiltroPagoChange = (event) => {
        setFiltroPago(event.target.value);
    };

    // Filtrar los datos según el texto de búsqueda y el filtro de pago
    const filteredUsers = userData.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) ||
                            user.userlastname.toLowerCase().includes(searchTerm);
        
        if (filtroPago === 'todos') {
            return matchesSearch;
        } else if (filtroPago === 'pagados') {
            return matchesSearch && user.pago;
        } else if (filtroPago === 'no-pagados') {
            return matchesSearch && !user.pago;
        }
        return matchesSearch;
    });

    // Ver Modal con los datos del cliente
    const handleClienteClick = (cliente) => {
        setClienteSeleccionado(cliente);
        onOpen();
    };

    // Eliminar usuario
    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            try {
                await axios.delete(`${apiUrl}/api/auth/userdelete/${id}`);
                toast({
                    title: 'Exito',
                    description: 'Usuario Eliminado',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

                setUserData(userData.filter(user => user._id !== id));
            } catch (error) {
                console.error('Error eliminando usuario:', error);
                alert('Hubo un error al eliminar el usuario');
            }
        }
    };

    const handleMetodoPago = async (id, user) => {

        const nuevoMetodoPago = user.metodopago === 'MP' ? 'Efectivo/Transf' : 'MP';
        
        try {
            axios.put(`${apiUrl}/api/auth/userupdate/${id}`, { metodopago: nuevoMetodoPago })
            setUserData((prevUserData) =>
                prevUserData.map((u) =>
                    u._id === user._id ? { ...u, metodopago: nuevoMetodoPago } : u
                )
            );
            toast({
                title: 'Método de pago actualizado',
                description: `El método de pago se cambió a ${nuevoMetodoPago}`,
                status: 'success',
                duration: 5000,
                isClosable: true
            });
        } catch (error) {
            console.error('Error actualizando método de pago:', error);
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el método de pago',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        }
    }

    const handlePago = async (id, user) => {
        const nuevoPago = !user.pago;
        const currentDate = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDate = currentDate.toLocaleDateString('es-AR', options);
    
        // Preguntar al usuario si está seguro
        const confirmMessage = `¿Estás seguro de que quieres cambiar el estado de pago a ${nuevoPago ? 'Pagado' : 'No Pagado'}?`;
        const confirmed = window.confirm(confirmMessage);
    
        if (!confirmed) return;
    
        try {
            await axios.put(`${apiUrl}/api/auth/userupdate/${id}`, {
                pago: nuevoPago,
                fechaPago: nuevoPago ? formattedDate : null,
                metodopago: nuevoPago ? 'Efectivo/Transf' : null,
            });
    
            setUserData((prevUserData) =>
                prevUserData.map((u) =>
                    u._id === user._id
                        ? {
                            ...u,
                            pago: nuevoPago,
                            fechaPago: nuevoPago ? formattedDate : null,
                            metodopago: nuevoPago ? 'Efectivo/Transf' : null,
                        }
                        : u
                )
            );
    
            toast({
                title: 'Estado de pago actualizado',
                description: `El estado de pago ahora es ${nuevoPago ? 'Pagado' : 'No Pagado'}`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error actualizando estado de pago:', error);
            toast({
                title: 'Error',
                description: 'No se pudo actualizar el estado de pago',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // funcion para refrescar los usuarios
    const fetchUsuarios = async () => {
        const response = await axios.get(`${apiUrl}/api/auth/users`);
        setUserData(response.data);
    };

    // Calcular el total de montos a pagar para clientes que pagaron y no pagaron
    const calcularTotales = () => {
        let totalPagados = 0;
        let totalNoPagados = 0;

        filteredUsers.forEach(user => {
            const monto = PRECIOS[user.diasentrenamiento] || 0;
            const montoConDescuento = user.descuento ? monto - monto * DESCUENTO : monto;

            if (user.pago) {
                totalPagados += montoConDescuento;
            } else {
                totalNoPagados += montoConDescuento;
            }
        });

        return { totalPagados, totalNoPagados };
    };

    const { totalPagados, totalNoPagados } = calcularTotales();
    
    return (
        <Box
            display='flex'
            flexDir='column'
            alignItems='center'
            className='animate__animated animate__backInUp'
            >
            <Heading
                fontFamily='"Poppins", sans-serif;'
                textAlign='center'
                >
                Datos de Clientes
            </Heading>

            {
                isLoading ? (
                    <Flex
                        align='center'
                        justify='center'
                        h='300px'
                        >
                            <Spinner 
                                size='xl'
                                color='green.400'
                                />
                    </Flex>
                ) : (
                    <>
                        <Input
                            mt="20px"
                            placeholder="Buscar por nombre o apellido"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            w={['80%','60%',"50%"]}
                            mb="5px"
                            borderColor={theme === 'light' ? 'gray.400' : 'gray.600'}
                            focusBorderColor="green.400"
                        />
                        <Select
                            mt="20px"
                            placeholder="Filtrar por estado de pago"
                            value={filtroPago}
                            onChange={handleFiltroPagoChange}
                            w={['80%','60%',"50%"]}
                            mb="20px"
                            borderColor={theme === 'light' ? 'gray.400' : 'gray.600'}
                            focusBorderColor="green.400"
                        >
                            <option value="todos">Todos</option>
                            <option value="pagados">Pagados</option>
                            <option value="no-pagados">No Pagados</option>
                        </Select>
                        <Button 
                            onClick={() => setIsModalOpen(true)}
                            mb='20px'
                            backgroundColor={theme === 'light' ? 'white' : 'black'}
                            color={theme === 'light' ? 'black' : 'white'}
                            border='1px solid #80c687'
                            boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            transition='all 0.3s ease'
                            _hover={{
                                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                backgroundColor:'#80c687',
                                color: theme === 'light' ? 'white' : 'black'
                            }}
                            >
                            Ingresos Mensuales
                        </Button>   
                        <ModalIngresos isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} totalPagados={totalPagados} totalNoPagados={totalNoPagados} />
                        <GradientText
                            colors={theme === 'light' ? ["green, black, green, black, green"] : ["green, white, green, white, green"]}
                            animationSpeed={3}
                            showBorder={false}
                            className="custom-class"
                            >
                            <Box
                                display='flex'  
                                columnGap='8px'
                                alignItems='center'
                                justifyContent='center'
                                fontSize='1.2rem'
                                fontFamily='"Poppins", sans-serif'
                                >
                                <Text>
                                    Cantidad de Clientes: 
                                </Text>
                                <CountUp
                                    from={0}
                                    to={filtroPago === 'pagados' ?  filteredUsers.length : filteredUsers.length - 1}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text"
                                    />
                            </Box>
                        </GradientText>
                        <TableContainer 
                            mt='20px'
                            mb='20px'
                            w='99%'
                            >
                            <Table
                                variant='simple'
                                colorScheme='green'
                                >
                                <Thead>
                                    <Tr>
                                        <Th
                                            color={theme === 'light' ? 'black' : 'white'}
                                            textAlign='center'
                                            fontFamily='"Poppins", sans-serif'
                                            >
                                            N°
                                        </Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Nombre Completo</Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Cant. Dias Ent.</Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Monto a Pagar</Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Pago</Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Fecha de Pago</Th>
                                        <Th 
                                            textAlign='center'
                                            color={theme === 'light' ? 'black' : 'white'}
                                            fontFamily='"Poppins", sans-serif'
                                            >Metodo de Pago</Th>
                                        <Th>
                                            <Flex
                                                justify='center'
                                                >
                                                <Image src={basura} alt='usuario eliminado' w='45px'/>
                                            </Flex>
                                        </Th>
                                        <Th></Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {
                                        filteredUsers.map((user, index) => (
                                            <Tr key={user._id} display={user.role === 'admin' ? 'none' : ''}>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                >
                                                    { filtroPago === 'pagados' ? index + 1 : index} 
                                                </Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                    >
                                                        <Tooltip
                                                            label='Ver Usuario'
                                                            fontSize='sm'
                                                            >
                                                            <Text
                                                                as='button'
                                                                _hover={{
                                                                    transform: 'scale(1.1)'
                                                                }}
                                                                onClick={() => handleClienteClick(user)}
                                                                textTransform='capitalize'
                                                                >
                                                                {user.username} {user.userlastname}
                                                            </Text>

                                                        </Tooltip>
                                                    </Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                    >{user.diasentrenamiento} dias</Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={user.descuento ? '#006400' : theme === 'light' ? 'black' : 'white'}
                                                    fontWeight={user.descuento ? 'bold' : 'semibold'}
                                                    >
                                                        {
                                                            PRECIOS[user.diasentrenamiento]
                                                            ? `$ ${user.descuento 
                                                                ? (PRECIOS[user.diasentrenamiento] - PRECIOS[user.diasentrenamiento] * DESCUENTO).toLocaleString('es-ES') 
                                                                : (PRECIOS[user.diasentrenamiento]).toLocaleString('es-ES')}`
                                                            : "$ -"
                                                        }
                                                    </Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                    >
                                                        <Tooltip label={user.pago ? "Cambiar a No Pagado" : "Cambiar a Pagado"} fontSize="sm">
                                                            <Image
                                                                src={user.pago ? pagado : nopago} // Alternar entre las imágenes
                                                                alt="Estado de pago"
                                                                w="40px"
                                                                h="40px"
                                                                cursor="pointer"
                                                                onClick={() => handlePago(user._id, user)}
                                                                _hover={{
                                                                    transform: "scale(1.1)", // Efecto de hover para indicar interactividad
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                    >{user.pago ? user.fechaPago : '-'}</Td>
                                                <Td 
                                                    textAlign='center'
                                                    color={theme === 'light' ? 'black' : 'white'}
                                                    >
                                                    <Tooltip label={ user.metodopago === 'MP' ? "Cambiar a Efectivo/Transf" : 'MP'} fontSize="sm">
                                                        <Text
                                                            as="button"
                                                            _hover={{
                                                                transform: 'scale(1.1)',
                                                                textDecoration: 'underline',
                                                            }}
                                                            onClick={() => handleMetodoPago(user._id, user)}
                                                        >
                                                            {user.metodopago || 'MP'}
                                                        </Text>
                                                    </Tooltip>
                                                </Td>
                                                <Td>
                                                    <Button
                                                        size='sm'
                                                        backgroundColor={theme === 'light' ? 'white' : 'black'}
                                                        color={theme === 'light' ? 'black' : 'white'}
                                                        border='1px solid #80c687'
                                                        boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                                                        transition='all 0.3s ease'
                                                        _hover={{
                                                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                                            transform: 'translateY(-2px)',
                                                            backgroundColor:'red',
                                                            color: theme === 'light' ? 'white' : 'black'
                                                        }}
                                                        onClick={() => handleDelete(user._id)}
                                                        >
                                                        Eliminar
                                                    </Button>
                                                </Td>
                                                <Td>
                                                    <EditUserButton apiUrl={apiUrl} user={user} theme={theme} onUserUpdated={fetchUsuarios}/>
                                                </Td>
                                            </Tr>
                                        ))
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </>
                )
            }
            { clienteSeleccionado && (
                <ClienteModal isOpen={isOpen} onClose={onClose} clienteSeleccionado={clienteSeleccionado} theme={theme} />
            )}
        </Box>
    )
}

export default RegistroClientes