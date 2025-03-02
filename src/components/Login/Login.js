import { Button, Text, Flex, FormControl, FormLabel, Stack, useToast, Input, Box, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ theme, apiUrl }) {
    const [formData, setFormData] = useState({
        useremail: '',
        userpassword: ''
    });
    const [loading, setLoading] = useState(false); // Estado para controlar el loading
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Activar el estado de loading

        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, formData);

            if (response.status === 200) {
                // Guardamos el token en localStorage
                localStorage.setItem('token', response.data.token);

                toast({
                    title: 'Inicio de Sesión exitoso.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });

                // Redirigir al usuario a la página protegida
                navigate('/home');
                window.location.reload();
            }
        } catch (error) {
            toast({
                title: 'Error al iniciar sesión',
                description: error.response?.data?.msg || 'Error en el servidor.',
                status: 'error',
                duration: 5000,
                isClosable: true
            });
        } finally {
            setLoading(false); // Desactivar el estado de loading
        }
    };

    return (
        <Flex
            alignItems='center'
            justifyContent='center'
            m='30px 0 20px 0'
        >
            <Box
                w={['90%', '70%', '60%']}
                h='auto'
                p='50px'
                borderRadius='20px'
                boxShadow="0px 10px 15px rgba(0, 0, 0, 0.2), 0px 4px 6px rgba(0, 0, 0, 0.1)"
                transition="box-shadow 0.3s ease"
                _hover={{
                    boxShadow: "0px 15px 20px rgba(0, 0, 0, 0.3), 0px 10px 15px rgba(0, 0, 0, 0.2)"
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        <FormControl
                            id='useremail'
                            isRequired
                        >
                            <FormLabel>Email</FormLabel>
                            <Input
                                value={formData.useremail}
                                onChange={handleChange}
                                type='text'
                                name='useremail'
                                placeholder='Ingresa tu email'
                                border='1px solid #80c687'
                            />
                        </FormControl>

                        <FormControl
                            id='userpassword'
                            isRequired
                        >
                            <FormLabel>Contraseña</FormLabel>
                            <Input
                                value={formData.userpassword}
                                onChange={handleChange}
                                type='password'
                                name='userpassword'
                                placeholder='Ingresa tu contraseña'
                                border='1px solid #80c687'
                            />
                        </FormControl>

                        <Link to={'/forgotpasswordform'}>
                            <Text
                                fontSize='sm'
                                _hover={{
                                    color: 'red'
                                }}
                            >
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </Link>

                        <Button
                            alignSelf='center'
                            type='submit'
                            backgroundColor={theme === 'light' ? 'white' : 'black'}
                            color={theme === 'light' ? 'black' : 'white'}
                            border='1px solid #80c687'
                            boxShadow='0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            transition='all 0.3s ease'
                            _hover={{
                                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                backgroundColor: '#80c687',
                                color: theme === 'light' ? 'white' : 'black'
                            }}
                            w='80%'
                            isLoading={loading}
                            spinner={<Spinner size='sm' />} 
                        >
                            {loading ? '' : 'Iniciar Sesión'}
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    );
}

export default Login;