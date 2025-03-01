import { Button, Flex, Heading, Link, Text, Box } from '@chakra-ui/react'
import SpotlightCard from './SpotlightCard';
import {PRECIOS, DESCUENTO} from '../../config/precios'

function Transferencia({theme, userData}) {

     // PRECIOS ACTUALIZADOS
        const precioBase = PRECIOS[userData.diasentrenamiento] || 0;
        const precioFinal = userData.descuento ? precioBase - precioBase * DESCUENTO : precioBase;
        const precioMostrar = precioBase ? `$ ${precioFinal.toLocaleString('es-ES')}` : "$ -";

    return (
        <Flex
            align='center'
            justify='center'
            h='70vh'
            >
            <Box
                w={['90%', '80%', '50%']}
                >

                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                    <Flex
                        flexDir='column'
                        align='center'
                        justify='center'
                        color='#80c687'
                        rowGap='10px'
                        padding='20px'
                        >
                        <Heading
                            fontFamily='poppins'
                            fontSize='3xl'
                            >
                                Datos para Transferir
                        </Heading>
                        <Text>
                            <strong>Alias:</strong> fzabaseintegral
                        </Text>
                        <Text>  
                            <strong>Nombre de la Cuenta:</strong> Manuel Mariano Martino
                        </Text>
                        <Text>  
                            <strong>N° Cuenta:</strong> 0000003100035185326089
                        </Text>
                        <Text>
                            <strong>Importe a pagar:</strong> {precioMostrar}
                        </Text>
                        <Text>
                            <strong>Dias de entrenamiento:</strong> {userData.diasentrenamiento}
                        </Text>
                        <Flex
                            flexDir='column'
                            align='center'
                            justify='center'
                            rowGap='2px'
                            border='1px solid #80c687'
                            borderRadius='10px' 
                            p='10px'
                            >                            
                            <Text
                                color='red'
                                >
                                <strong>¡Importante!</strong>
                            </Text>
                            <Text>
                                Enviar comprobante de pago a nuestro WhatsApp
                            </Text>
                            <Link
                                mt='10px'
                                href={`https://api.whatsapp.com/send?phone=3416948109&text=Hola! Mi nombre es ${userData.username} ${userData.userlastname}. Te envio el comprobante de pago de este mes! Gracias!&nbspme&nbsppueden&nbspayudar?`}
                                target='_blank'
                                >
                                <Button
                                    size='sm'
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
                                    Enviar Comprobante
                                </Button>
                            </Link>
                        </Flex>
                    </Flex>
                </SpotlightCard>
            </Box>
        </Flex>
    )
}

export default Transferencia