import { Box, Heading, Text, SimpleGrid, IconButton, VStack, Link, useBreakpointValue, Flex, Button } from "@chakra-ui/react";
import { FaInstagram } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const profes = [
    {
        nombre: "Julieta Martini",
        horarios: ["Martes 16:00 - 17:00", "Miércoles 17:00 - 18:00"],
        instagram: "https://www.instagram.com/licenciada.jm/",
    },
    {
        nombre: "Florencia Bertaña",
        horarios: ["Jueves 08:00 - 09:00"],
        instagram: "https://www.instagram.com/lic.florenciabertania/",
    },
];

const HomeNutricion = ({userData, theme}) => {
    const gridCols = useBreakpointValue({ base: 1, md: 2 });

    const navigate = useNavigate()

    return (
        <Box p={8}>
            <Heading mb={10} textAlign="center" size="2xl" color="green.600">
                NUTRICIÓN
            </Heading>

            <SimpleGrid columns={gridCols} spacing={6}>
                {profes.map((profe, index) => (
                <Box
                    key={index}
                    p={6}
                    borderWidth={1}
                    borderRadius="2xl"
                    boxShadow="md"
                    _hover={{ shadow: "xl", transform: "scale(1.02)" }}
                    transition="all 0.2s"
                >
                    <VStack align="start" spacing={4}>
                        <Heading size="md" color='green.600'>Lic. {profe.nombre}</Heading>
                        <Box>
                            {profe.horarios.map((h, idx) => (
                            <Text key={idx} fontSize="sm">
                                {h}
                            </Text>
                            ))}
                        </Box>
                        <Flex
                            mt={profe.nombre === 'Florencia Bertaña' ? '17px' : 0}
                            w='100%'
                            justifyContent='space-between'
                            direction={['column', 'column', 'row']}
                            >
                            <Link href={profe.instagram} isExternal>
                                Seguime en Instagram
                                <IconButton
                                aria-label="Instagram"
                                icon={<FaInstagram />}
                                variant="ghost"
                                colorScheme="pink"
                                fontSize="xl"
                                />
                            </Link>
                            <Button
                                onClick={() => navigate(`/nutricion?profe=${encodeURIComponent(profe.nombre)}`)}
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
                                >
                                {userData.role === 'admin' ? 'Ver Turnos' : 'Solicitar Turnos' }
                            </Button>
                        </Flex>
                    </VStack>
                </Box>
                ))}
            </SimpleGrid>
        </Box>
    );
    };

export default HomeNutricion;
