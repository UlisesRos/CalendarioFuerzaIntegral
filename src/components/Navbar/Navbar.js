import { Flex } from '@chakra-ui/react'
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
            mb='40px'
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