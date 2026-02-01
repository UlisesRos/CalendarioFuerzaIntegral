import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, Button, VStack } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

const PaymentSuccess = ({ userData, apiUrl }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const monto = searchParams.get('monto');
    const metodo = searchParams.get('metodo');
    const userId = userData?._id;

    useEffect(() => {
        const registrarPago = async () => {
            try {
                if (!userId || !monto || !metodo) {
                    throw new Error('Faltan datos necesarios para registrar el pago (userId, monto, metodo)');
                }

                // Validar que monto sea un número válido
                const montoNumerico = parseFloat(monto);
                if (isNaN(montoNumerico) || montoNumerico <= 0) {
                    throw new Error('Monto inválido');
                }

                console.log('📝 Registrando pago:', { userId, monto: montoNumerico, metodo });

                const response = await axios.post(`${apiUrl}/api/payments/registrarpago`, {
                    userId,
                    monto: montoNumerico,
                    metodo,
                }, {
                    timeout: 10000 // Timeout de 10 segundos
                });

                console.log('✅ Pago registrado:', response.data);
                setSuccess(true);
                setLoading(false);

                // Redirige después de 3 segundos
                setTimeout(() => {
                    navigate('/');
                }, 3000);

            } catch (error) {
                console.error('❌ Error al registrar el pago:', error.message);
                
                // Si es error de red, mostrar mensaje específico
                if (error.code === 'ECONNABORTED') {
                    setError('Error de conexión. Por favor, intenta nuevamente.');
                } else if (error.response?.status === 400) {
                    setError(error.response.data.error || 'Datos inválidos');
                } else if (error.response?.status === 404) {
                    setError('Usuario no encontrado');
                } else if (error.response?.status === 500) {
                    setError('Error del servidor. Por favor, contacta con soporte.');
                } else {
                    setError(error.message || 'Error desconocido al registrar el pago');
                }
                
                setLoading(false);
            }
        };

        if (userId && monto && metodo) {
            registrarPago();
        } else {
            setError('Faltan datos necesarios para registrar el pago');
            setLoading(false);
        }
    }, [userId, monto, metodo, navigate, apiUrl]);

    return (
        <Box 
            textAlign="center" 
            mt={10} 
            p={6}
            maxW="md"
            mx="auto"
            borderRadius="lg"
            boxShadow="lg"
        >
            {loading ? (
                <VStack spacing={4}>
                    <Spinner size="xl" color="#80c687" thickness="4px" />
                    <Text fontSize="lg" fontWeight="bold">
                        Registrando tu pago...
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        Por favor, no cierres esta ventana
                    </Text>
                </VStack>
            ) : error ? (
                <VStack spacing={4}>
                    <WarningIcon w={12} h={12} color="red.500" />
                    <Heading size="md" color="red.600">
                        Error al registrar el pago
                    </Heading>
                    <Alert status="error" borderRadius="md">
                        <AlertIcon />
                        {error}
                    </Alert>
                    <Text fontSize="sm" color="gray.600">
                        Monto: ${monto} - Método: {metodo}
                    </Text>
                    <Button 
                        colorScheme="red" 
                        onClick={() => navigate('/')}
                        mt={4}
                    >
                        Volver al inicio
                    </Button>
                </VStack>
            ) : success ? (
                <VStack spacing={4}>
                    <CheckCircleIcon w={16} h={16} color="green.500" />
                    <Heading size="lg" color="green.600">
                        ¡Pago Exitoso!
                    </Heading>
                    <Text fontSize="md">
                        Gracias por tu pago. Hemos registrado tu transacción correctamente.
                    </Text>
                    <Text fontSize="sm" color="gray.600" fontWeight="bold">
                        Monto: ${monto} - Método: {metodo}
                    </Text>
                    <Box
                        p={3}
                        bg="green.50"
                        borderRadius="md"
                        borderLeft="4px"
                        borderColor="green.500"
                    >
                        <Text fontSize="sm">
                            Tu estado de pago se actualizará en breve.
                        </Text>
                    </Box>
                    <Text fontSize="xs" color="gray.500">
                        Serás redirigido a la página principal en unos segundos...
                    </Text>
                </VStack>
            ) : null}
        </Box>
    );
};

export default PaymentSuccess;
