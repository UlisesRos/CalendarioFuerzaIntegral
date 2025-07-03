import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Image,
  useToast,
  VStack,
  Text,
  Flex,
  Spinner
} from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import { Link, useNavigate } from 'react-router-dom';
import menu from '../../img/menuuno.png';
import ProtectedRegisterButton from '../Registro/ProtectedRegisterButton';

function SidebarMenu({ theme, userData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const navigate = useNavigate();
  const toast = useToast();

  // Verifico si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos
        if (decoded.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          // Token expirado
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Manejar click de cerrar Sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    toast({
      title: 'Sesión Cerrada',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    navigate('/login');
  };

  // Función para desplazarse al footer
  const scrollToFooter = (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto
    onClose(); // Cerrar el menú

    // Usar un timeout para asegurar que el menú se cierre antes de desplazarse
    setTimeout(() => {
      const footer = document.getElementById('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth' }); // Desplazamiento suave
      } else {
        console.error('Footer no encontrado'); 
      }
    }, 300);
  };

  return (
    <Box>
      <Image _hover={{cursor: 'pointer', transform: 'scale(1.1)'}} onClick={onOpen} src={menu} alt="Menu desplegable" w="50px" h="50px" m="3px" />

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menú de Navegación</DrawerHeader>

          <DrawerBody>
            {isAuthenticated ? 
              !userData ? (
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
              ) :
              (
              userData ? (
                userData.role === 'admin' ? (
                  <VStack align="start" spacing={4}>
                    <Link to="/" onClick={onClose}>
                      Home
                    </Link>
                    <Link to="/calendario" onClick={onClose}>
                      Calendario
                    </Link>
                    <Link to='/homenutricion' onClick={onClose}>
                      Nutrición
                    </Link>
                    <Link to="/seccionadmin" onClick={onClose}>
                      Admin
                    </Link>
                  </VStack>
                ) : (
                  <VStack align="start" spacing={4}>
                    <Link to="/" onClick={onClose}>
                      Home
                    </Link>
                    <Link to="/calendario" onClick={onClose}>
                      Calendario
                    </Link>
                    <Link to="/pagos" onClick={onClose}>
                      Pagos
                    </Link>
                    <Link to="/perfil" onClick={onClose}>
                      Perfil
                    </Link>
                    <Link to='/homenutricion' onClick={onClose}>
                      Nutrición
                    </Link>
                    <Text as='button' onClick={scrollToFooter} variant="link" color={theme === 'light' ? '#1A202C' : '#EEEFF1'} >
                      Contactanos
                    </Text>
                  </VStack>
                )
              ) : (
                <></>
              )
            ) : (
              <VStack align="start" spacing={4}>
                <Link to="/" onClick={onClose}>
                  Home
                </Link>
                <Text as='button' onClick={scrollToFooter} variant="link" color={theme === 'light' ? '#1A202C' : '#EEEFF1'} >
                  Contactanos
                </Text>
              </VStack>
            )}
          </DrawerBody>

          <DrawerFooter
            display="flex"
            justifyContent={['center', 'space-between', 'space-between']}
            columnGap={['15px', '0px', '0px']}
            rowGap={['10px', '0px', '0px']}
            flexWrap="wrap"
          >
            <Link to="/login" onClick={onClose}>
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  backgroundColor={theme === 'light' ? 'white' : 'black'}
                  color={theme === 'light' ? 'black' : 'white'}
                  border="1px solid #80c687"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    backgroundColor: '#80c687',
                    color: theme === 'light' ? 'white' : 'black',
                  }}
                >
                  Cerrar Sesión
                </Button>
              ) : (
                <Button
                  backgroundColor={theme === 'light' ? 'white' : 'black'}
                  color={theme === 'light' ? 'black' : 'white'}
                  border="1px solid #80c687"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                  transition="all 0.3s ease"
                  _hover={{
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    backgroundColor: '#80c687',
                    color: theme === 'light' ? 'white' : 'black',
                  }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Link>
            <Box display={isAuthenticated ? 'none' : 'block'}>
              <ProtectedRegisterButton onClose1={onClose} theme={theme} />
            </Box>
            <Button
              onClick={onClose}
              backgroundColor={theme === 'light' ? 'white' : 'black'}
              color={theme === 'light' ? 'black' : 'white'}
              border="1px solid #80c687"
              boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                transform: 'translateY(-2px)',
                backgroundColor: '#80c687',
                color: theme === 'light' ? 'white' : 'black',
              }}
            >
              Cerrar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default SidebarMenu;