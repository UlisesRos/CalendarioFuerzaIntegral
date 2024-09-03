import React from 'react'
import { Box, Image, Link, Text, Flex } from '@chakra-ui/react'
import avatar from '../../img/avatar.svg'
import facebook from '../../img/facebook.png'
import youtube from '../../img/youtub.png'
import '../../css/footer/RedesSociales.css'

function Footer() {
    return (
        <Box
            display='flex'
            flexDir='column'
            textAlign='center'
            marginBottom='10px'
            >
            <Box
                display='flex'
                columnGap='20px'
                margin='40px 0 20px 0'
                justifyContent='center'
                >
                    <Link
                        href='https://www.instagram.com/fuerza.integral/'
                        target='_blank'
                        >
                        <button class="button" >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            height="24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            class="w-6 h-6 text-gray-800 dark:text-white"
                        >
                            <path
                            clip-rule="evenodd"
                            d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                            fill-rule="evenodd"
                            fill="currentColor"
                            ></path>
                        </svg>
                        </button>
                    </Link>
                    <Link
                        href="https://api.whatsapp.com/send?phone=3416948109&text=Hola! Te hablo porque vi tu pagina web!. Gracias!&nbspme&nbsppueden&nbspayudar?"
                        target='_blank'
                        >
                        <button class="button" id='b1'>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            height="24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                            class="w-6 h-6 text-gray-800 dark:text-white"
                        >
                            <path
                            clip-rule="evenodd"
                            d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                            fill-rule="evenodd"
                            fill="currentColor"
                            ></path>
                            <path
                            d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
                            fill="currentColor"
                            ></path>
                        </svg>
                        </button>
                    </Link>
                    <Link
                        href='https://www.facebook.com/profile.php?id=100081675554626'
                        target='_blank'
                        >
                        <button class="button" id='b2'>
                        <Image src={facebook} h='25px' w='25px' />
                        </button>    
                    </Link>
                    <Link
                        href='https://www.youtube.com/channel/UCx50jLX2u6ODD9jOLcfqw9w'
                        target='_blank'
                        >
                        <button class="button" id='b3'>
                        <Image src={youtube} h='25px' w='25px' />
                        </button>
                    </Link>
            </Box>
            <Box
                display='flex'
                flexDir='column'
                alignItems='center'
                >
                <Text>
                    Hecho por
                </Text>
                <Link
                    href='https://ulisesros-desarrolloweb.vercel.app/'
                    target='_blank'
                    w='120px'
                    textAlign='center'
                    _hover={{
                        transform: 'scale(1.2)',
                        textDecor: 'underline'
                    }}
                    >
                    <Flex
                        alignItems='center'
                        justifyContent='center'
                        columnGap='4px'
                        >
                        <Image src={avatar} h='30px' w='30px'/>
                        <Text>Ulises Ros</Text>
                    </Flex>
                </Link>
            </Box>
        </Box>
    )
}

export default Footer