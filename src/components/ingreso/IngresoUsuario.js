import React, { useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    Input,
    Text,
    FormControl,
    FormLabel,
    useToast,
    VStack,
    Heading,
} from "@chakra-ui/react";

const IngresoUsuario = ({ theme, apiUrl }) => {
    const [documento, setDocumento] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [diasRestantes, setDiasRestantes] = useState(0);
    const [diasEntrenamiento, setDiasEntrenamiento] = useState(0);
    const [username, setUsername] = useState('');
    const [userlastname, setUserlastname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const verificarCliente = async () => {
        if (!documento.trim()) {
            toast({
                title: "Error",
                description: "Por favor, ingresa un número de documento.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/api/ingresousuario`, { documento });

            if (response.data.yaIngresadoHoy) {
                setMensaje("Ya has ingresado hoy.");
                toast({
                    title: "Error",
                    description: "Ya has ingresado hoy.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                setMensaje(response.data.msg);
                setDiasRestantes(response.data.diasRestantes);
                setDiasEntrenamiento(response.data.diasEntrenamiento);
                setUsername(response.data.username);
                setUserlastname(response.data.userlastname);

                toast({
                    title: "Verificación exitosa",
                    description: 'Puedes ingresar al gimnasio',
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });

                setDocumento("");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.msg || "Ocurrió un error al verificar el cliente.";
            setMensaje(errorMessage);
            setUsername(error.response?.data?.username || '');
            setUserlastname(error.response?.data?.userlastname || '');

            toast({
                title: "Verificación Fallida",
                description: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            verificarCliente();
        }
    }

    return (
        <Box p={5} boxShadow="md" borderRadius="md" maxWidth="500px" margin="auto">
            <Heading as="h2" size="lg" textAlign="center" mb={6} fontFamily='poppins'>
                Ingreso Usuario
            </Heading>

            <VStack spacing={4}>
                <FormControl>
                    <FormLabel htmlFor="numeroDocumento">Número de Documento</FormLabel>
                    <Input
                        onKeyDown={handleEnter}
                        id="documento"
                        type="text"
                        value={documento}
                        onChange={(e) => setDocumento(e.target.value)}
                        placeholder="Ingrese su número de documento"
                    />
                </FormControl>

                <Button
                    onClick={verificarCliente}
                    width="full"
                    backgroundColor={theme === 'light' ? 'white' : 'black'}
                    color={theme === 'light' ? 'black' : 'white'}
                    border='1px solid #80c687'
                    boxShadow='0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                    transition='all 0.3s ease'
                    _hover={{
                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                        backgroundColor: '#80c687',
                        color: theme === 'light' ? 'white' : 'black'
                    }}
                    isLoading={isLoading}
                    loadingText="Verificando..."
                >
                    Verificar
                </Button>

                <Heading
                    as='h2'
                    fontFamily='poppins'
                    fontWeight='bold'
                    fontSize='lg'
                    textTransform='capitalize'
                >
                    ¡Bienvenido/a {username}, {userlastname}!
                </Heading>

                {mensaje && (
                    <Text color={mensaje !== 'Verificación exitosa' ? 'red' : 'green'} textAlign="center">
                        {mensaje}
                    </Text>
                )}

                {diasRestantes > 0 && diasEntrenamiento > 0 && (
                    <Box mt={4} p={4} borderWidth={1} borderRadius="md" backgroundColor={theme === 'light' ? "gray.100" : 'black'} >
                        <Text fontSize="lg" fontWeight="bold">Días Restantes:</Text>
                        <Text fontSize="lg">{diasRestantes}</Text>

                        <Text fontSize="lg" fontWeight="bold" mt={2}>Días de Entrenamiento:</Text>
                        <Text>{diasEntrenamiento}</Text>
                    </Box>
                )}

            </VStack>
        </Box>
    );
};

export default IngresoUsuario;