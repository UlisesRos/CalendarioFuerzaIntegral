import React, { useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Input,
    useDisclosure,
    Text,
    InputGroup,
    InputRightElement,
    IconButton
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const ProtectedRegisterButton = ({ theme, onClose1 }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const correctCode = process.env.REACT_APP_PROTECTED_CODE

    const accessDuration = 1000 * 60 * 15;
    const handleVerifyCode = () => {

        if (code === correctCode) {

        localStorage.setItem("accessGranted", "true");
        setError("");
        onClose(); // Cierra el modal
        onClose1()
        navigate("/registro"); // Redirige a la página de registro
        } else {
        setError("Código incorrecto. Inténtalo nuevamente.");
        }
    };

    setTimeout(() => {
        localStorage.removeItem("accessGranted");
        console.log('codigo removido')
    }, accessDuration);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleVerifyCode();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
        <Button
            onClick={onOpen}
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
            Registrarme
        </Button>

        <Modal  isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Protección con código</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text mb={2}>Ingresa el código para acceder al registro:</Text>
                <InputGroup>
                    <Input
                        onKeyDown={handleKeyPress}
                        placeholder="Código"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        />
                        <InputRightElement>
                            <IconButton
                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                onClick={togglePasswordVisibility}
                                variant="ghost"
                                size="sm"
                            />
                        </InputRightElement>
                    </InputGroup>  
                    {error && (
                    <Text color="red.500" fontSize="sm" mt={2}>
                        {error}
                    </Text>
                    )}
            </ModalBody>
            <ModalFooter>
                <Button
                    type="submit"
                    mr='10px'
                    onClick={handleVerifyCode}
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
                Verificar
                </Button>
                <Button
                    onClick={onClose}
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
                Cancelar
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    );
    };

export default ProtectedRegisterButton;
