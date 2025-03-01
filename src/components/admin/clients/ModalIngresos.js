import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Flex, Text } from "@chakra-ui/react"

const ModalIngresos = ({isOpen, onClose, totalPagados, totalNoPagados }) => {

    
        
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent w='80%'>
                    <ModalHeader
                        textAlign='center'
                        >
                        Ingresos Mensuales
                    </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex
                        flexDir='column'
                        >
                        <Text
                            color='green'
                            >
                            <strong>Importe Ingresado: </strong> $ {totalPagados.toLocaleString('es-ES')}
                        </Text>
                        <Text
                            color='red'
                            >
                            <strong>Importe NO Ingresado: </strong> $ {totalNoPagados.toLocaleString('es-ES')}
                        </Text>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='green' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ModalIngresos