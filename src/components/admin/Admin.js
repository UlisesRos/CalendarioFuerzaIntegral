import { Flex, Image, Box, Button, Text, Input } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo from '../../img/logofuerza.png'

function Admin({theme}) {
    return (
        <Box>
            <Flex
                justify='space-between'
                alignItems='center'
                >
                <Image src={logo} alt='logo de fuerza integral' w='13rem' h='7rem' marginLeft='20px'/>
                <Link
                    to='/'
                    >
                    <Button
                        marginRight={['0','20px','20px']}
                        backgroundColor={theme == 'light' ? 'white' : 'black'}
                        color={theme == 'light' ? 'black' : 'white'}
                        border='1px solid #80c687'
                        box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        transition='all 0.3s ease'
                        _hover={{
                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            backgroundColor:'#80c687',
                            color: theme == 'light' ? 'white' : 'black'
                        }}
                        >
                        Volver
                    </Button>
                </Link>
            </Flex>
            <Flex
                justifyContent='center'
                alignItems='center'
                h='70vh'
                >
                <Flex
                    w='300px'
                    h='200px'
                    border='1px solid black'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    rowGap='20px'
                    borderRadius='10px'
                    boxShadow= '0 4px 8px rgba(0, 0, 0, 0.5)'
                    >
                        <Text>
                            Escribir la clave
                        </Text>
                        <Input placeholder='clave' w='200px' textAlign='center' border='1px solid #80c687' />
                        <Button
                            type='submit'
                            backgroundColor={theme == 'light' ? 'white' : 'black'}
                            color={theme == 'light' ? 'black' : 'white'}
                            border='1px solid #80c687'
                            box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            transition='all 0.3s ease'
                            _hover={{
                                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                backgroundColor:'#80c687',
                                color: theme == 'light' ? 'white' : 'black'
                            }}  
                            >
                            Entrar
                        </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Admin