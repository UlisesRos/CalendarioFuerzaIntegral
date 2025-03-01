import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Box, Text, Heading, Image } from '@chakra-ui/react';
import pago from '../../img/metodo-de-pago.png';
import {PRECIOS, DESCUENTO} from '../../config/precios'
import 'animate.css'

function Pagos({ theme, userData, apiUrl }) {
    const [loading, setLoading] = useState(false);

    // PRECIOS ACTUALIZADOS
    const precioBase = PRECIOS[userData.diasentrenamiento] || 0;
    const precioFinal = userData.descuento ? precioBase - precioBase * DESCUENTO : precioBase;
    const precioMostrar = precioBase ? `$ ${precioFinal}` : "$ -";

    // Efecto para verificar si userData está disponible antes de renderizar
    useEffect(() => {
        if (!userData) {
            console.error("userData no está disponible");
        }
    }, [userData]);
    
    // Asegúrate de que userData esté presente antes de proceder
    const handlePayment = async () => {
        if (!userData) {
            console.error('No se pudo procesar el pago, falta la información del usuario.');
            return;
        }

        setLoading(true);

        try {
            const data = {
                name: userData.username,
                lastname: userData.userlastname,
                days: parseInt(userData.diasentrenamiento, 10),
                descuento: userData.descuento,
                userId: userData._id,
            };

            // Llamar al backend para crear la preferencia
            const response = await axios.post(`${apiUrl}/api/payments/create_preference`, data);
            
            // Redirigir al checkout de Mercado Pago
            window.location.href = response.data.init_point;
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Hubo un error al procesar el pago. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Evitar el renderizado si no hay datos del usuario
    if (!userData) {
        return <Text>Esperando datos del usuario...</Text>;
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={5} rowGap="20px" className='animate__animated animate__backInUp'>
            <Image src={pago} alt="Método de pago" />
            <Heading fontFamily='"Poppins", sans-serif;' textTransform="capitalize">
                ¡ Hola, {userData.username} !
            </Heading>
            <Text>
                En este sector vas a poder realizar el pago de tu cuota mensual por los {userData.diasentrenamiento} días de entrenamiento.
            </Text>
            {
                userData.descuento && (
                    <Text
                        color='#006400'
                        fontWeight='bold'
                        >
                        Tenes un 10% de descuento por ser {userData.descuento}
                    </Text>
                )
            }
            <Text fontWeight="bold">
                Importe a pagar: 
                {
                    precioMostrar
                }
            </Text>
            <Button
                size="lg"
                onClick={handlePayment}
                isLoading={loading}
                loadingText="Procesando..."
                backgroundColor={theme === 'light' ? 'white' : 'black'}
                color={theme === 'light' ? 'black' : 'white'}
                border="1px solid #80c687"
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                transition="all 0.3s ease"
                _hover={{
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    backgroundColor: '#80c687',
                    color: theme === 'light' ? 'white' : 'black'
                }}
            >
                Ir a Pagar
            </Button>
        </Box>
    );
}

export default Pagos;
