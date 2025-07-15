import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    useToast,
    Select
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

function EditUserButton({ user, onUserUpdated, theme, apiUrl }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: user.username,
        userlastname: user.userlastname,
        usertelefono: user.usertelefono,
        diasentrenamiento: user.diasentrenamiento,
        descuento: user.descuento,
        fechaPago: user.fechaPago
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            // Realiza la solicitud para actualizar el usuario
            await axios.put(`${apiUrl}/api/auth/userupdate/${user._id}`, formData);

            toast({
                title: "Usuario actualizado",
                description: "Los datos del usuario se han actualizado correctamente.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            onUserUpdated(); // Llama a la función para refrescar la lista de usuarios
            onClose();
        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            toast({
                title: "Error",
                description: "Hubo un problema al actualizar el usuario.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Button
                size='sm'
                backgroundColor={theme === 'light' ? 'white' : 'black'}
                color={theme === 'light' ? 'black' : 'white'}
                border='1px solid #80c687'
                boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                transition='all 0.3s ease'
                _hover={{
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    backgroundColor:'#80c687',
                    color: theme === 'light' ? 'white' : 'black'
                }}
                onClick={onOpen}>
                Editar
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Editar Usuario</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl mb={4}>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Apellido</FormLabel>
                            <Input
                                name="userlastname"
                                value={formData.userlastname}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Celular</FormLabel>
                            <Input
                                name="usertelefono"
                                value={formData.usertelefono}
                                onChange={handleInputChange}
                            />
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Días de entrenamiento</FormLabel>
                            <Select
                                name="diasentrenamiento"
                                type="number"
                                value={formData.diasentrenamiento}
                                onChange={handleInputChange}
                            >
                                <option value='2'>2 dias</option>
                                <option value='3'>3 dias</option>
                                <option value='4'>4 dias</option>
                                <option value='5'>5 dias</option>
                            </Select>
                        </FormControl>
                        
                        <FormControl mb={4}>
                            <FormLabel>Descuento</FormLabel>
                            <Select
                                name='descuento'
                                value={formData.descuento}
                                onChange={handleInputChange}
                                >   
                                <option value="">Sin descuento</option>
                                <option value='jubilado'>Jubilado</option>
                                <option value='estudiante'>Estudiante</option>
                                <option value='familia'>Grupo familiar (+2)</option>
                                <option value='deportista'>Deportista</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel>Fecha de Pago</FormLabel>
                            <Input
                                name="fechaPago"
                                value={formData.fechaPago}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            size='sm'
                            backgroundColor={theme === 'light' ? 'white' : 'black'}
                            color={theme === 'light' ? 'black' : 'white'}
                            border='1px solid #80c687'
                            boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            transition='all 0.3s ease'
                            _hover={{
                                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                backgroundColor:'#80c687',
                                color: theme === 'light' ? 'white' : 'black'
                            }}
                            mr={3} 
                            onClick={handleUpdate}
                            >
                            Guardar Cambios
                        </Button>
                        <Button 
                            size='sm'
                            backgroundColor={theme === 'light' ? 'white' : 'black'}
                            color={theme === 'light' ? 'black' : 'white'}
                            border='1px solid #80c687'
                            boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                            transition='all 0.3s ease'
                            _hover={{
                                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                transform: 'translateY(-2px)',
                                backgroundColor:'#80c687',
                                color: theme === 'light' ? 'white' : 'black'
                            }}
                            onClick={onClose}
                            >
                            Cancelar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditUserButton;
