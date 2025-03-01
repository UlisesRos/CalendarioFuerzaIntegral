import { Button, Flex, Image } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import logo2 from '../../img/logoblack.png'
import SidebarMenu from './SidebarMenu'
import CircularText from './CircularText';

function Navbar({toggleTheme, theme, userData}) {
    //<Image src={logo2} alt='logo de fuerza integral' w='10rem' h='8rem' marginLeft={['0','20px','20px']} objectFit='cover' />
    return (
        <Flex
            flexDir={['column','row','row']}
            justify={['center','space-between','space-between']}
            alignItems='center'
            flexWrap='wrap'
            rowGap='15px'
            >
            <CircularText
                theme={theme}
                text="FUERZA*BASE*INTEGRAL*"
                onHover="speedUp"
                spinDuration={20}
                className="custom-class"
            />
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
                <label class="ui-switch">
                    <input type="checkbox" onClick={toggleTheme}/>
                    <div class="slider">
                        <div class="circle"></div>
                    </div>
                </label>
                <SidebarMenu theme={theme} userData={userData}/>
            </Flex>
        </Flex>
    )
}

export default Navbar