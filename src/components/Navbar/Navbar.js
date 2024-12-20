import { Button, Flex, Image, Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo2 from '../../img/logoblack.png'

function Navbar({toggleTheme, theme}) {
    return (
        <Flex
            justify={['center','space-between','space-between']}
            alignItems='center'
            flexWrap='wrap'
            >
            <Image src={logo2} alt='logo de fuerza integral' w='10rem' h='8rem' marginLeft={['0','20px','20px']} objectFit='cover' />
            <Box
                as='a'
                href='https://www.youtube.com/watch?v=WZNvY6FMGKE'
                target='_blank'
                marginBottom='12px'
                marginTop='12px'
                >
                <Button
                    marginLeft={[0,'50px','70px']}
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
                    ¿Como uso el calendario?
                </Button>
            </Box>
            <Flex
                marginRight={['0','20px','20px']}
                alignItems='center'
                columnGap='25px'
                >
                <Link
                    to='/rutinas'
                    >
                    <Button
                        display='none'
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
                        Rutinas
                    </Button>
                </Link>
                <Link
                    to='/admin'
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
                        Admin
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
    )
}

export default Navbar