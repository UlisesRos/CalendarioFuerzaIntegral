import React, { useState } from 'react';
import { Tabs, TabPanels, TabPanel, Box, Flex, Spinner, Container } from '@chakra-ui/react';
import Transferencia from './Transferencia';
import 'animate.css';

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
                    <TabPanels>
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
