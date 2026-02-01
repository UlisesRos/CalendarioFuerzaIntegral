import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Flex, Spinner, Container } from '@chakra-ui/react';
import Pagos from './Pagos';
import Transferencia from './Transferencia';
import 'animate.css';

/**
 * Componente que integra las opciones de pago:
 * 1. Mercado Pago (automático)
 * 2. Transferencia bancaria (manual)
 */
function OpcionesPago({ theme, userData, apiUrl }) {
    const [selectedTab, setSelectedTab] = useState(0);

    if (!userData) {
        return (
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
        );
    }

    return (
        <Container 
            maxW={['100%', '100%', '90%', '1000px']}
            centerContent
            py={[4, 6, 8]}
            px={[2, 4, 6]}
            className='animate__animated animate__fadeIn'
        >
            <Box w='100%'>
                <Tabs 
                    index={selectedTab} 
                    onChange={setSelectedTab}
                    variant='soft-rounded'
                    colorScheme='green'
                    isFitted={['true', 'true', 'false']}
                >
                    <TabList 
                        mb={[4, 6, 8]}
                        gap={[0, 2, 3]}
                        flexWrap={['nowrap', 'nowrap', 'wrap']}
                        justifyContent={['stretch', 'stretch', 'center']}
                    >
                        <Tab 
                            _selected={{ 
                                bg: '#80c687', 
                                color: 'white',
                                boxShadow: '0 4px 8px rgba(128, 198, 135, 0.3)'
                            }}
                            fontWeight='bold'
                            fontSize={['sm', 'md', 'lg']}
                            py={[2, 3, 4]}
                            px={[2, 4, 6]}
                            borderRadius='md'
                            transition='all 0.3s ease'
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(128, 198, 135, 0.2)'
                            }}
                        >
                            💳 Mercado Pago
                        </Tab>
                        <Tab 
                            _selected={{ 
                                bg: '#80c687', 
                                color: 'white',
                                boxShadow: '0 4px 8px rgba(128, 198, 135, 0.3)'
                            }}
                            fontWeight='bold'
                            fontSize={['sm', 'md', 'lg']}
                            py={[2, 3, 4]}
                            px={[2, 4, 6]}
                            borderRadius='md'
                            transition='all 0.3s ease'
                            _hover={{
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 12px rgba(128, 198, 135, 0.2)'
                            }}
                        >
                            🏦 Transferencia
                        </Tab>
                    </TabList>

                    <TabPanels>
                        {/* TAB 1: MERCADO PAGO */}
                        <TabPanel p={[0, 2, 4]}>
                            <Flex 
                                justify='center' 
                                align='center'
                                w='100%'
                            >
                                <Box 
                                    w='100%' 
                                    maxW={['100%', '500px', '600px']}
                                    mx='auto'
                                >
                                    <Pagos 
                                        theme={theme} 
                                        userData={userData} 
                                        apiUrl={apiUrl} 
                                    />
                                </Box>
                            </Flex>
                        </TabPanel>

                        {/* TAB 2: TRANSFERENCIA */}
                        <TabPanel p={[0, 2, 4]}>
                            <Flex 
                                justify='center'
                                align='center'
                                w='100%'
                            >
                                <Box 
                                    w='100%' 
                                    maxW={['100%', '500px', '600px']}
                                    mx='auto'
                                >
                                    <Transferencia 
                                        theme={theme} 
                                        userData={userData} 
                                    />
                                </Box>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    );
}

export default OpcionesPago;
