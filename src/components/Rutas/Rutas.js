import { Flex } from '@chakra-ui/react'
import Calendario from '../calendario/Calendario'
import Navbar from '../Navbar/Navbar'
import '../../css/nav/Navbar.css'
import Footer from '../footer/Footer'
import Modal from '../modal/Modal'

function Rutas({toggleTheme, theme, adminCalendar}) {

    return (
        <Flex
            flexDir='column'
            >
            <Modal theme={theme} />
            <Navbar toggleTheme={toggleTheme} theme={theme} />
            <Calendario theme={theme} adminCalendar={adminCalendar}/>
            <Footer />
        </Flex>
    )
}

export default Rutas