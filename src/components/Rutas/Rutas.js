import { Flex } from '@chakra-ui/react'
import Calendario from '../calendario/Calendario'
import Navbar from '../Navbar/Navbar'
import '../../css/nav/Navbar.css'
import Footer from '../footer/Footer'

function Rutas({toggleTheme, theme}) {

    return (
        <Flex
            flexDir='column'
            >
            <Navbar toggleTheme={toggleTheme} theme={theme} />
            <Calendario theme={theme}/>
            <Footer />
        </Flex>
    )
}

export default Rutas