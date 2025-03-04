import React from 'react'
import usuarios from '../../img/usuarios.png'
import HistorialPagosUs from './HistorialPagosUs'
import 'animate.css'
import { Box, Flex, Card, CardHeader, CardBody, Heading, Text, Image, Spinner } from '@chakra-ui/react'

function Perfil({ userData, theme }) {

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

    return (
        <Flex
            w='100%'
            h='50vh'
            justify='center'
            align='center'
            mt='50px'
            >
            <Card
                w={['85%','60%','60%']}
                boxShadow='0 4px 8px rgba(0, 0, 0, 0.2)'
                _hover={{ transform: 'scale(1.05)', transition: '0.3s' }}
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
                    <Text><strong>Email:</strong> {userData.useremail}</Text>
                    <Text><strong>Celular:</strong> {userData.usertelefono}</Text>
                    <Text><strong>Dias de Entrenamiento:</strong> {userData.diasentrenamiento} dias</Text>
                    <Text><strong>Dias de Restantes para entrenar:</strong> {userData.diasrestantes} dias</Text>
                    {userData.pago ? <Flex columnGap='5px'><strong>Mes Actual:</strong><Text color='green'> Pagado</Text> </Flex> : <Flex columnGap='5px'><strong>Mes Actual:</strong><Text color='red'> No Pagado</Text> </Flex>}
                    <Box
                        mt='10px'
                        textAlign='center'
                        >
                        <HistorialPagosUs userData={userData} theme={theme} />
                    </Box>
                </CardBody>
            </Card>
        </Flex>
    )
}

export default Perfil