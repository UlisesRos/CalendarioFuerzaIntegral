import { Box, Text, Heading, Flex, Button, Image, Link } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import axios from "axios"
import TypingEffect from "./TypingEffect"

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Modal() {
    
    const [ visible, setVisible] = useState(true)
    const [ modalContent, setModalContent ] = useState({
        title: '',
        subtitle: '',
        link: '',
        image: '',
        description: ''
    });

    // Cargar los datos desde la base de Datos
    useEffect(() => {
        const fetchModalContent = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/get-modal-content`);
                setModalContent(response.data) // Actualizamos el estado con la base de datos
            } catch (error) {
                console.error('Error al cargar el contenido del modal', error);
            }
        };

        fetchModalContent()

    }, [])

    useEffect(() => {
        const sinModal = () => {
            if(modalContent.title === '' && modalContent.subtitle === '' & modalContent.link === '' && modalContent.image === '' && modalContent.description === ''){
                setVisible(false)
            } else {
                setVisible(true)
            }
        }

        sinModal()
    }, [modalContent.title, modalContent.subtitle, modalContent.link, modalContent.image, modalContent.description])
    
    const texto = modalContent.title
    
    const desaparecerModal = () => {
        setVisible(false)
    }

    return (
        <Box
            w={['90%','50%', '40%']}
            h='auto'
            position='absolute'
            margin={['180px 0 0 5%','180px 0 0 30%','120px 0 0 30%']} 
            zIndex='100'
            padding='20px 0 20px 0'
            bg='#80c687'
            display={visible === true ? 'block' : 'none'}
            borderRadius='10px'
            boxShadow='26px 21px 15px -3px rgba(0,0,0,0.2)'
            color='black'
            >
            <Flex
                flexDir='column'
                justifyContent='center'
                alignItems='center'
                rowGap='7px'
                >
                <Heading
                    fontWeight='bold'
                    >
                    <TypingEffect text={texto} speed={120} />
                </Heading>
                <Text
                    fontSize='1.3rem'
                    fontWeight='semi-bold'
                    textAlign='center'
                    >
                    {modalContent.subtitle}
                </Text>
                <Image src={modalContent.image} alt='llavero de fuerza integral' overflow='inherit' display={modalContent.image === '' ? 'none' : 'block'} />
                <Text
                    fontSize='1.1rem'
                    fontWeight='semi-bold'
                    textAlign='center'
                    >
                    {modalContent.description}
                </Text>
                <Link
                    href={modalContent.link}
                    target='_blank'
                    >
                    {modalContent.link}
                </Link>
                <Button
                    onClick={desaparecerModal}
                    backgroundColor='white'
                    color='black'
                    border='1px solid #80c687'
                    box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                    transition='all 0.3s ease'
                    _hover={{
                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                        color: 'black'
                    }}
                    >
                        OK
                </Button>
            </Flex>
        </Box>
    )
}

export default Modal