import { Button, Flex, Heading, Link, Text, Box, Spinner } from '@chakra-ui/react'
import SpotlightCard from './SpotlightCard';
import {PRECIOS, DESCUENTO} from '../../config/precios'

function Transferencia({theme, userData}) {

    if(!userData) {
        return (
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

     // PRECIOS ACTUALIZADOS
        const precioBase = PRECIOS[userData.diasentrenamiento] || 0;
        const precioFinal = userData.descuento ? precioBase - precioBase * DESCUENTO : precioBase;
        const precioMostrar = precioBase ? `$ ${precioFinal.toLocaleString('es-ES')}` : "$ -";


    return (
        <Flex
            align='center'
            justify='center'
            h='70vh'
            mt='50px'
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
                        >
                        <Heading
                            fontFamily='poppins'
                            fontSize='3xl'
                            textAlign='center'
                            >
                                Datos para Transferir
                        </Heading>
                        <Flex
                            flexDir='column'
                            align='center'
                            >
                            <Text
                                fontWeight='bold'
                                >
                                Alias
                            </Text>
                            <Text>
                                fzabaseintegral    
                            </Text> 
                        </Flex>
                        <Flex
                            flexDir='column'
                            align='center'
                            >
                            <Text
                                fontWeight='bold'
                                >
                                Nombre de la Cuenta
                            </Text>
                            <Text>
                                Manuel Mariano Martino 
                            </Text> 
                        </Flex> 
                        <Flex
                            flexDir='column'
                            align='center'
                            >
                            <Text
                                fontWeight='bold'
                                >
                                N° Cuenta
                            </Text>
                            <Text>
                                0000003100035185326089
                            </Text> 
                        </Flex>
                        <Flex
                            flexDir='column'
                            align='center'
                            >
                            <Text
                                fontWeight='bold'
                                >
                                Importe a Pagar
                            </Text>
                            <Text>
                                {precioMostrar}
                            </Text> 
                        </Flex>
                        <Flex
                            flexDir='column'
                            align='center'
                            >
                            <Text
                                fontWeight='bold'
                                >
                                Dias de entrenamiento
                            </Text>
                            <Text>
                                {userData.diasentrenamiento}
                            </Text> 
                        </Flex>
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