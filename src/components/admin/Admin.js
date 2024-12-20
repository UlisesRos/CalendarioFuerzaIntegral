import { Flex, Image, Box, Button, Text, Input } from '@chakra-ui/react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../img/logoblack.png'
import { useState } from 'react'
import Swal from 'sweetalert2'

function Admin({theme, setIsAuthenticated}) {

    const [codigo, setCodigo] = useState('')
    const navigate = useNavigate()
    const codigoCorrecto = process.env.REACT_APP_CLAVE

    // Funcion para autenticar el admnin y guardar la session en el local storage
    const handleCodigoButton = () => {
        if(codigo === codigoCorrecto) {
            setIsAuthenticated(true)
            localStorage.setItem('adminAuthenticated', 'true')
            navigate('/initialcalendar')
        } else {
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: "CLAVE INCORRECTA."
            });
            setCodigo('')
        }
    }
    
    // Funcion para que la tecla entrar funcione con el ENTER
    const handleEnter = (e) => {
        if(e.key === 'Enter'){
            handleCodigoButton()
        }
    }

    return (
        <Box>
            <Flex
                justify='space-between'
                alignItems='center'
                >
                <Image src={logo} alt='logo de fuerza integral' w='8rem' h='8rem' marginLeft={['0','20px','20px']} objectFit='cover' />
                <Link
                    to='/'
                    >
                    <Button
                        marginRight='20px'
                        backgroundColor={theme === 'light' ? 'white' : 'black'}
                        color={theme === 'light' ? 'black' : 'white'}
                        border='1px solid #80c687'
                        box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        transition='all 0.3s ease'
                        _hover={{
                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            backgroundColor:'#80c687',
                            color: theme === 'light' ? 'white' : 'black'
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
                        <Input 
                            type='password'
                            placeholder='clave' 
                            w='200px' 
                            textAlign='center' 
                            border='1px solid #80c687' 
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                            onKeyDown={handleEnter}
                            />
                            <Button
                                type='submit'
                                backgroundColor={theme === 'light' ? 'white' : 'black'}
                                color={theme === 'light' ? 'black' : 'white'}
                                border='1px solid #80c687'
                                box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                                transition='all 0.3s ease'
                                _hover={{
                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                    transform: 'translateY(-2px)',
                                    backgroundColor:'#80c687',
                                    color: theme === 'light' ? 'white' : 'black'
                                }}
                                onClick={handleCodigoButton}
                                >
                                Entrar
                            </Button>
                </Flex>
            </Flex>
        </Box>
    )
}

export default Admin