import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Heading, Text, Spinner, Alert, AlertIcon } from '@chakra-ui/react';

const PaymentSuccess = ({ userData, apiUrl }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const monto = searchParams.get('monto');
    const metodo = searchParams.get('metodo');
    const userId = userData?._id;

    useEffect(() => {
        const registrarPago = async () => {
            try {
                if (!userId || !monto || !metodo) {
                    throw new Error('Faltan datos necesarios para registrar el pago');
                }

                const response = await axios.post(`${apiUrl}/api/payments/registrarpago`, {
                    userId,
                    monto: parseFloat(monto), // Asegúrate de que el monto sea un número
                    metodo,
                });

                console.log('Pago registrado:', response.data);
                setLoading(false);
                setTimeout(() => {
                    navigate('/'); // Redirige al usuario a la página principal después de 3 segundos
                }, 3000);
            } catch (error) {
                console.error('Error al registrar el pago:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (userId && monto && metodo) {
            registrarPago();
        } else {
            setError('Faltan datos necesarios para registrar el pago');
            setLoading(false);
        }
    }, [userId, monto, metodo, navigate]);

    return (
        <Box textAlign="center" mt={10}>
            {loading ? (
                <>
                    <Spinner size="xl" />
                    <Text mt={4}>Registrando tu pago...</Text>
                </>
            ) : error ? (
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            ) : (
                <>
                    <Heading>¡Pago Exitoso!</Heading>
                    <Text>Gracias por tu pago. Hemos registrado tu transacción.</Text>
                    <Text>Serás redirigido a la página principal en unos segundos...</Text>
                </>
            )}
        </Box>
    );
};

export default PaymentSuccess;
