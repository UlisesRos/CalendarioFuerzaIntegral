import { Flex } from '@chakra-ui/react'
import '../../css/nav/Navbar.css'
import Modal from '../modal/Modal'
import Home from '../home/Home'

function Rutas({toggleTheme, theme, apiUrl}) {

    return (
        <Flex
            flexDir='column'
            >
            <Modal theme={theme} apiUrl={apiUrl} />
            <Home />
        </Flex>
    )
}

export default Rutas