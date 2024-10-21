import { Box, Button, Flex, Link, Image } from '@chakra-ui/react'
import logo from '../../img/logofuerza.png'
import Rutina from './Rutina'


function BoxRutinas({toggleTheme, theme}) {
    return (
        <Box>
            <Flex
                justify={['center','space-between','space-between']}
                alignItems='center'
                flexWrap='wrap'
                >
                <Image src={logo} alt='logo de fuerza integral' w='13rem' h='7rem' marginLeft='20px'/>
                <Flex
                    marginRight={['0','20px','20px']}
                    justifyContent='center'
                    rowGap='15px'
                    alignItems='center'
                    columnGap='25px'
                    wrap='wrap'
                    >
                        <Link
                            href='/'
                            >
                            <Button
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

                    <div class="toggle-switch">
                        <label class="switch-label">
                            <input type="checkbox" class="checkbox" onClick={toggleTheme}/>
                            <span class="slider"></span>
                        </label>
                    </div>  
                </Flex>
            </Flex>
            <Flex
                justifyContent='center'
                alignItems='center'
                h='auto'
                mt='20px'
                >
                <Rutina />
            </Flex>
        </Box>
    )
}

export default BoxRutinas