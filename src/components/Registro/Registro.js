import { Button, Flex, FormControl, FormLabel, Stack, useToast, Input, Box, Select } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Registro({ theme, apiUrl }) {

    // Manejo del formulario
    const [ formData, setFormData ] = useState({
        username: '',
        userlastname: '',
        useremail: '',
        userpassword: '',
        userpasswordc: '',
        diasentrenamiento: '',
        usertelefono: '',
        documento: '',
        descuento: ''
    });

    // Notificaciones
    const toast = useToast();
    const navegate = useNavigate()

    // Traer los datos del input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/api/auth/register`, formData);

            if(response.status === 201) {
                toast({
                    title: 'Registro Exitoso',
                    description: 'Ahora puedes iniciar sesion',
                    status: 'success',
                    duration: 5000,
                    isClosable: true
                });
                navegate('/login')
            }


        } catch (error) {
            
            if(error.response) {
                // Respuestas de error del Back
                toast({
                    title: 'Error al registrarse',
                    description: error.response.data.msg || 'Hubo un problema al registrarse',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            } else if(error.request) {
                toast({
                    title: 'Error en la conexion',
                    description: 'No se pudo conectar al servidor',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                });
            } else {
                toast({
                    title: 'Error.',
                    description: 'Hubo un problema con la solicitud.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }
    
    return (
        <Flex
            alignItems='center'
            justifyContent='center'
            m='30px 0 20px 0'
            >
            <Box
                w={['90%','70%','60%']}
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
                            id='username'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Nombre
                            </FormLabel>
                            <Input
                                value={(formData.username).toLowerCase()}
                                onChange={handleChange}
                                type='text'
                                name='username'
                                placeholder='Ingresa tu Nombre'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <FormControl
                            id='userlastname'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Apellido
                            </FormLabel>
                            <Input
                                value={formData.userlastname.toLowerCase()}
                                onChange={handleChange}
                                type='text'
                                name='userlastname'
                                placeholder='Ingresa tu Apellido'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <FormControl
                            id='useremail'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Email
                            </FormLabel>
                            <Input
                                value={formData.useremail.toLowerCase()}
                                onChange={handleChange}
                                type='email'
                                name='useremail'
                                placeholder='Ingresa tu Email'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <FormControl
                            id='documento'
                            isRequired
                            >
                            <FormLabel
                                >
                                Documento
                            </FormLabel>
                            <Input
                                value={formData.documento}
                                onChange={handleChange}
                                type='number'
                                name='documento'
                                placeholder='Ingresa tu Documento'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <FormControl
                            id='usertelefono'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Celular
                            </FormLabel>
                            <Input
                                value={formData.usertelefono}
                                onChange={handleChange}
                                type='number'
                                name='usertelefono'
                                placeholder='341xxxxxxx'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <FormControl
                            id='diasentrenamiento'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Cantidad de Dias a Entrenar
                            </FormLabel>
                            <Select
                                value={formData.diasentrenamiento}
                                onChange={handleChange}
                                name='diasentrenamiento'
                                placeholder='Selecciona la cantidad de dias'
                                border='1px solid #80c687' 
                                >
                                    <option value='2'>2 dias</option>
                                    <option value='3'>3 dias</option>
                                    <option value='4'>4 dias</option>
                                    <option value='5'>5 dias</option>
                                </Select>
                        </FormControl>

                        <FormControl
                            id='descuento'
                            >
                            <FormLabel
                                
                                >
                                Descuento
                            </FormLabel>
                            <Select
                                value={formData.descuento}
                                onChange={handleChange}
                                name='descuento'
                                placeholder='Selecciona si posees un descuento'
                                border='1px solid #80c687' 
                                >
                                    <option value='jubilado'>Jubilado</option>
                                    <option value='estudiante'>Estudiante</option>
                                    <option value='familia'>Grupo familiar (+2)</option>
                                    <option value='deportista'>Deportista</option>
                                </Select>
                        </FormControl>

                        <FormControl
                            id='userpassword'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Contraseña
                            </FormLabel>
                            <Input
                                value={formData.userpassword}
                                onChange={handleChange}
                                type='password'
                                name='userpassword'
                                placeholder='Ingresa tu Contraseña'
                                border='1px solid #80c687' 
                                />
                        </FormControl>
                        <FormControl
                            id='userpasswordc'
                            isRequired
                            >
                            <FormLabel
                                
                                >
                                Nuevamente tu Contraseña
                            </FormLabel>
                            <Input
                                value={formData.userpasswordc}
                                onChange={handleChange}
                                type='password'
                                name='userpasswordc'
                                placeholder='Vuelve a ingresar tu Contraseña'
                                border='1px solid #80c687' 
                                />
                        </FormControl>

                        <Button
                            alignSelf='center'
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
                            w='80%'
                            >
                            Registrarse
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Flex>
    )
}

export default Registro