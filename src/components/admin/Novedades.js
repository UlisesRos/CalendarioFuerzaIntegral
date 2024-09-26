import { Box, Button, Heading, Input, Textarea, Image, Flex } from "@chakra-ui/react"
import logo from '../../img/logofuerza.png'
import { useState } from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Novedades({toggleTheme, theme}) {

    const [ title, setTitle ] = useState('')
    const [ subtitle, setSubTitle ] = useState('')
    const [ description, setDescription ] = useState('')
    const [ image, setImage] = useState('')
    const [ link, setLink ] = useState('')

    const handleSave = async () => {
        const modalData = {
            title,
            subtitle,
            link,
            image,
            description,
        };

        try {
            await axios.post(`${apiUrl}/api/save-modal-content`, modalData);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                color: 'black',
                didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "success",
                title: 'Modal de novedades creado con exito!'
            });
        } catch (error) {
            console.error('Error al guardar los datos del modal', error)
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                color: 'black',
                didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "error",
                title: `Error al guardar los datos del modal`
            });
        }

        setTitle('')
        setSubTitle('')
        setLink('')
        setImage('')
        setDescription('')
    }

    const handleReset = async () => {
        const modalData = {
            title: '',
            subtitle: '',
            link: '',
            image: '',
            description: '',
        };

        try {
            await axios.post(`http://localhost:5000/api/save-modal-content`, modalData);
            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                color: 'black',
                didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
                }
            });
            Toast.fire({
                icon: "warning",
                title: `El modal de novedades ha sido quitado!`
            });
        } catch (error) {
            console.error('Error al guardar los datos del modal', error)
        }
    }

    return (
        <Box>
            <Flex
                justify={['center','space-between','space-between']}
                alignItems='center'
                flexWrap='wrap'
                >
                <Image src={logo} alt='logo de fuerza integral' w='13rem' h='7rem' marginLeft='20px'/>
                <Flex
                    marginRight={['0','20px','20px']}
                    justifyContent='center'
                    rowGap='15px'
                    alignItems='center'
                    columnGap='25px'
                    wrap='wrap'
                    >
                        <Link
                            to='/'
                            >
                            <Button
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
                                Volver
                            </Button>
                        </Link>

                    <div class="toggle-switch">
                        <label class="switch-label">
                            <input type="checkbox" class="checkbox" onClick={toggleTheme}/>
                            <span class="slider"></span>
                        </label>
                    </div>  
                </Flex>
            </Flex>
            <Box
                display='flex'
                flexDir='column'
                alignItems='center'
                rowGap='20px'
                >
                <Heading
                    mt='20px'
                    fontFamily='poppins'
                    textAlign='center'
                    >
                    Ingresa las nuevas novedades
                </Heading>
                <Input
                    value={title}
                    placeholder="Introduce el titulo"
                    onChange={(e) => setTitle(e.target.value)}   
                    w={['80%', '60%', '60%']}
                    border='1px solid #80c687'
                    isRequired
                    />
                <Input
                    value={subtitle}
                    placeholder="Introduce el sub titulo"
                    onChange={(e) => setSubTitle(e.target.value)}
                    w={['80%', '60%', '60%']}
                    border='1px solid #80c687'
                    />
                <Input
                    value={link}
                    placeholder="Introduce el link de la web"
                    onChange={(e) => setLink(e.target.value)}
                    w={['80%', '60%', '60%']}
                    border='1px solid #80c687'
                    />
                <Input
                    value={image}
                    placeholder="Introduce el link de la imagen"
                    onChange={(e) => setImage(e.target.value)}
                    w={['80%', '60%', '60%']}
                    border='1px solid #80c687'
                    />
                <Textarea
                    value={description}
                    placeholder="Introduce la descripcion"
                    onChange={(e) => setDescription(e.target.value)}
                    w={['80%', '60%', '60%']}
                    border='1px solid #80c687'
                    />
                <Button
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
                    onClick={handleSave}
                    >
                    Guardar Novedades
                </Button>
                <Button
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
                    onClick={handleReset}
                    >
                    Sin novedades
                </Button>
            </Box>
        </Box>
    )
}

export default Novedades