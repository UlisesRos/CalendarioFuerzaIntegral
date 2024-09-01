import { Flex } from '@chakra-ui/react'
import Calendario from '../calendario/Calendario'
import Navbar from '../Navbar/Navbar'
import '../../css/nav/Navbar.css'

function Rutas({toggleTheme, theme}) {

    return (
        <Flex
            flexDir='column'
            >
            <Navbar toggleTheme={toggleTheme} theme={theme} />
            <Calendario theme={theme}/>
        </Flex>
    )
}

export default Rutas