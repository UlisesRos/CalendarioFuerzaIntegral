import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Flex } from "@chakra-ui/react"

const ModalTurnos = ({isOpen, onClose, getUserSchedule }) => {
        
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent w='80%'>
                    <ModalHeader
                        textAlign='center'
                        >
                        Horarios Inscriptos
                    </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Flex
                    flexDir='column'
                    rowGap='10px'
                    justify='center'
                    align='center'
                    >
                    {getUserSchedule().length > 0 ? (
                        getUserSchedule().map((schedule) => (
                            <Flex
                                w={['100%', '80%', '80%']}
                                p='15px'
                                border='1px solid #80c687'
                                flexDir='column'
                                borderRadius='10px'
                                justify='center'
                                align='center'
                                >
                                <Text
                                    textTransform='capitalize'
                                    >
                                    <strong>Dia: </strong>{schedule.day}
                                </Text>
                                <Text
                                    textTransform='capitalize'
                                    >
                                    <strong>Turno: </strong>{schedule.shift}
                                </Text>
                                    <Text textTransform='capitalize'><strong>Hora: </strong>{schedule.hour}:00</Text>
                            </Flex>
                        ))
                    ) : (
                        <Text fontSize="1rem" color="gray.500">No tienes turnos registrados.</Text>
                    )}
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

export default ModalTurnos