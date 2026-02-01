import React, { useEffect } from 'react'
import usuarios from '../../img/usuarios.png'
import HistorialPagosUs from './HistorialPagosUs'
import 'animate.css'
import { Box, Flex, Card, CardHeader, CardBody, Heading, Text, Image, Spinner, Badge, Divider, Icon } from '@chakra-ui/react'
import { CheckCircleIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons'

function Perfil({ userData, theme }) {
    // Efecto para refrescar datos cuando el usuario paga (simular polling)
    useEffect(() => {
        // Si userData cambió y pago es true, marcar como actualizado
        if (userData?.pago) {
            console.log('✅ Estado de pago actualizado:', userData.pago);
        }
    }, [userData?.pago, userData?.fechaPago]);

    if(!userData){
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

    const getPagoStatus = () => {
        if (userData.pago) {
            return {
                color: 'green',
                icon: CheckCircleIcon,
                label: 'Pagado',
                fecha: userData.fechaPago,
                bg: 'green.50'
            };
        } else {
            return {
                color: 'red',
                icon: CloseIcon,
                label: 'No Pagado',
                fecha: '-',
                bg: 'red.50'
            };
        }
    };

    const pagoStatus = getPagoStatus();

    return (
        <Flex
            w='100%'
            justify='center'
            align='center'
            mt='50px'
            mb='50px'
            >
            <Card
                w={['85%','60%','60%']}
                boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'
                _hover={{ transform: 'scale(1.02)', transition: '0.3s' }}
                className='animate__animated animate__backInUp'
                >
                <CardHeader>
                    <Flex
                        align='center'
                        justify='center'
                        columnGap='10px'
                        >
                        <Image src={usuarios} alt='usuarios' w='45px' objectFit='cover' />
                        <Heading
                            fontFamily='poppins'
                            size="md"
                            textTransform='capitalize'
                            textAlign='center'
                            >
                            {userData.username}, {userData.userlastname}
                        </Heading>
                    </Flex>
                </CardHeader>
                
                <CardBody>
                    {/* Sección de información personal */}
                    <Box mb={4}>
                        <Text mb={2}><strong>📧 Email:</strong> {userData.useremail}</Text>
                        <Text mb={2}><strong>📱 Celular:</strong> {userData.usertelefono}</Text>
                        <Text mb={2}><strong>💪 Días de Entrenamiento:</strong> {userData.diasentrenamiento} días</Text>
                        <Text><strong>🗓️ Días Restantes:</strong> {userData.diasrestantes} días</Text>
                    </Box>

                    <Divider my={4} />

                    {/* Sección de estado de pago con mejor diseño */}
                    <Box
                        p={4}
                        bg={pagoStatus.bg}
                        borderRadius='md'
                        borderLeft='4px'
                        borderColor={pagoStatus.color}
                        mb={4}
                    >
                        <Flex align='center' columnGap={3} mb={2}>
                            <Icon as={pagoStatus.icon} w={6} h={6} color={`${pagoStatus.color}.500`} />
                            <Flex direction='column'>
                                <Heading size='sm' color={`${pagoStatus.color}.700`}>
                                    Mes Actual
                                </Heading>
                                <Badge 
                                    colorScheme={pagoStatus.color === 'green' ? 'green' : 'red'}
                                    fontSize='sm'
                                    w='fit-content'
                                    mt={1}
                                >
                                    {pagoStatus.label}
                                </Badge>
                            </Flex>
                        </Flex>
                        
                        {pagoStatus.fecha !== '-' && (
                            <Flex align='center' columnGap={2} mt={2} fontSize='sm' color='gray.600'>
                                <TimeIcon />
                                <Text>Última actualización: {pagoStatus.fecha}</Text>
                            </Flex>
                        )}

                        {userData.descuento && (
                            <Box mt={3} p={2} bg='white' borderRadius='sm' borderLeft='2px' borderColor='blue.500'>
                                <Text fontSize='sm' color='blue.700'>
                                    ✨ Descuento aplicado: 10% por ser {userData.descuento}
                                </Text>
                            </Box>
                        )}
                    </Box>

                    <Divider my={4} />

                    {/* Historial de pagos */}
                    <Box textAlign='center'>
                        <HistorialPagosUs userData={userData} theme={theme} />
                    </Box>
                </CardBody>
            </Card>
        </Flex>
    )
}

export default Perfil