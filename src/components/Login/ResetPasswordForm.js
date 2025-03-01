import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react';
import axios from 'axios';

const ResetPasswordForm = ({ theme, apiUrl }) => {
    const [searchParams] = useSearchParams(); // Capturar los parámetros de la URL
    const token = searchParams.get('token'); // Obtener el token de la URL

    const navegate = useNavigate()
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'Las contraseñas no coinciden',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, {
                newPassword,
            });

            toast({
                title: 'Éxito',
                description: response.data.msg,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });

            navegate('/login');
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.msg || 'Error al conectar con el servidor',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl id="newPassword" isRequired>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ingresa tu nueva contraseña"
                        />
                    </FormControl>
                    <FormControl id="confirmPassword" isRequired>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu nueva contraseña"
                        />
                    </FormControl>
                    <Button
                        type="submit"
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
                        width="full"
                        isLoading={isLoading}
                    >
                        Restablecer contraseña
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default ResetPasswordForm;