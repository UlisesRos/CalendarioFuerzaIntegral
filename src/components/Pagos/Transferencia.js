import { Button, Flex, Heading, Link, Text, Box, Spinner, VStack, HStack } from '@chakra-ui/react'
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
            py={[4, 6, 8]}
            px={[2, 4, 6]}
            w='100%'
            >
            <Box
                w='100%'
                maxW={['100%', '550px', '600px']}
                >
                <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
                    <VStack
                        spacing={[3, 4, 5]}
                        align='center'
                        justify='center'
                        color='#80c687'
                        p={[3, 4, 5]}
                        >
                        <Heading
                            fontFamily='poppins'
                            fontSize={['xl', '2xl', '3xl']}
                            textAlign='center'
                            >
                                🏦 Datos para Transferir
                        </Heading>

                        {/* Datos de la cuenta */}
                        <VStack spacing={[2, 3, 3]} w='100%' align='start'>
                            <Box w='100%'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={['sm', 'md', 'md']}
                                    mb={1}
                                    >
                                    Alias
                                </Text>
                                <Box
                                    bg='gray.50'
                                    p={[2, 2.5, 3]}
                                    borderRadius='md'
                                    border='1px solid #80c687'
                                >
                                    <Text fontSize={['sm', 'md', 'md']} fontWeight='bold' color='#80c687'>
                                        fzabaseintegral    
                                    </Text>
                                </Box>
                            </Box>

                            <Box w='100%'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={['sm', 'md', 'md']}
                                    mb={1}
                                    >
                                    Nombre de la Cuenta
                                </Text>
                                <Box
                                    bg='gray.50'
                                    p={[2, 2.5, 3]}
                                    borderRadius='md'
                                    border='1px solid #80c687'
                                >
                                    <Text fontSize={['sm', 'md', 'md']} color='#80c687'>
                                        Manuel Mariano Martino 
                                    </Text>
                                </Box>
                            </Box>

                            <Box w='100%'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={['sm', 'md', 'md']}
                                    mb={1}
                                    >
                                    N° Cuenta
                                </Text>
                                <Box
                                    bg='gray.50'
                                    p={[2, 2.5, 3]}
                                    borderRadius='md'
                                    border='1px solid #80c687'
                                >
                                    <Text fontSize={['sm', 'md', 'md']} color='#80c687' fontFamily='monospace'>
                                        0000003100035185326089
                                    </Text>
                                </Box>
                            </Box>
                        </VStack>

                        {/* Información del pago */}
                        <HStack 
                            spacing={[2, 3, 4]} 
                            w='100%'
                            justify='center'
                            flexWrap={['wrap', 'wrap', 'nowrap']}
                        >
                            <Box textAlign='center' flex={1} minW='150px'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={['sm', 'md', 'md']}
                                    mb={1}
                                    >
                                    Importe a Pagar
                                </Text>
                                <Text fontSize={['lg', 'xl', '2xl']} fontWeight='bold' color='#80c687'>
                                    {precioMostrar}
                                </Text>
                            </Box>

                            <Box textAlign='center' flex={1} minW='150px'>
                                <Text
                                    fontWeight='bold'
                                    fontSize={['sm', 'md', 'md']}
                                    mb={1}
                                    >
                                    Días de Entrenamiento
                                </Text>
                                <Text fontSize={['lg', 'xl', '2xl']} fontWeight='bold' color='#80c687'>
                                    {userData.diasentrenamiento}
                                </Text>
                            </Box>
                        </HStack>

                        {/* Alerta importante */}
                        <Box
                            w='100%'
                            border='2px solid #ff6b6b'
                            borderRadius='md' 
                            p={[3, 3.5, 4]}
                            bg='red.50'
                            >
                            <VStack spacing={2} align='start'>
                                <Text
                                    color='red.600'
                                    fontWeight='bold'
                                    fontSize={['md', 'lg', 'lg']}
                                    >
                                    ⚠️ ¡Importante!
                                </Text>
                                <Text fontSize={['sm', 'md', 'md']} color='red.600'>
                                    Después de realizar la transferencia, <strong>envía el comprobante de pago a nuestro WhatsApp</strong> para confirmar tu transacción.
                                </Text>
                                <Link
                                    href={`https://api.whatsapp.com/send?phone=3416948109&text=Hola! Mi nombre es ${userData.username} ${userData.userlastname}. Te envio el comprobante de pago de este mes! Gracias!&nbspme&nbsppueden&nbspayudar?`}
                                    target='_blank'
                                    w='100%'
                                    >
                                    <Button
                                        size={['md', 'md', 'lg']}
                                        w='100%'
                                        backgroundColor='#25D366'
                                        color='white'
                                        fontWeight='bold'
                                        transition="all 0.3s ease"
                                        mt={2}
                                        _hover={{
                                            backgroundColor: '#1fa952',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
                                        }}
                                        >
                                        📲 Enviar Comprobante por WhatsApp
                                    </Button>
                                </Link>
                            </VStack>
                        </Box>
                    </VStack>
                </SpotlightCard>
            </Box>
        </Flex>
    )
}

export default Transferencia