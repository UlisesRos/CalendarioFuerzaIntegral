import React, { useState, useEffect } from 'react';
import '../../css/calendario/Calendario.css'
import '../../css/nav/Navbar.css'
import { Box, Button, Flex, FormLabel, Heading, Select, Text } from '@chakra-ui/react';
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'
import axios from 'axios'
import ModalOcupados from './modalOcupados';
import 'animate.css'

const InitialCalendar = ({ theme, apiUrl }) => {
    
    // Calendario que se guarda en MONGODB
    const [calendar, setCalendar] = useState('')
    const [ userData, setUserData ] = useState([])
    const [selectedUser, setSelectedUser] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/admincalendar`);
                setCalendar(response.data);
            } catch (error) {
                console.error('Error fetching calendar', error)
            }
        };
        
        fetchCalendar();
    }, [])

    // Traer usuarios
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/auth/users`);
                setUserData(response.data)
            } catch (error) {
                console.error('Error fetching usuario', error)
            }
        }

        fetchUsuario()
    }, [])
    
    //UseState para manejar las distintas cosas (nombre, dia, turno y hora)
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [selectedHour, setSelectedHour] = useState("");
    const [horariosOcupados, setHorariosOcupados] = useState([]);

    // Funcion para resetear el calendario al que estaba en el comienzo
    const handleResetCalendar = async () => {
        try {
            await axios.put(`${apiUrl}/api/admincalendar/reset`)
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
                title: "Calendario reiniciado correctamente"
            });
        } catch (error) {
            console.error('Error al reiniciarse el calendario', error)
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
                title: "Error al reiniciar el calendario"
            });
        }
    };

    const handleAddPerson = (day, shift, hour, selectedUser) => {
        setCalendar((prev) => {
            // Crear una copia profunda del estado previo
            const updated = JSON.parse(JSON.stringify(prev));
            const availableSlot = updated[day][shift][hour].indexOf(null);
            const personaRepetida = updated[day][shift][hour].map(pers => pers === selectedUser.toLocaleLowerCase())

            if(personaRepetida.filter(p => p === true).length > 0){
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
                    title: `Hola ${selectedUser}, ya estas registrado en este horario. Elije otro.`
                });
                return prev
            } else if (availableSlot !== -1) {
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
                day === 'sábado' ?
                Toast.fire({
                    icon: "success",
                    title: `Turno confirmado: ${day}, ${hour} hs`
                })
                : 
                Toast.fire({
                    icon: "success",
                    title: `Turno confirmado: ${day}, ${hour}:00 hs`
                })
                updated[day][shift][hour][availableSlot] = selectedUser.toLocaleLowerCase();
                axios.put(`${apiUrl}/api/admincalendar`, { day, shift, hour, updatedHour: updated[day][shift][hour] })
                return updated;
            } else {
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
                    title: "No hay espacios disponibles en este horario."
                })
                return prev;
            }
        });
    };
    const handleRemovePerson = (day, shift, hour, index) => {
        setCalendar((prev) => {
            const updated = { ...prev }
            const updatedHour = [ ...updated[day][shift][hour] ];
            updatedHour[index] = null;

            // Actualizar el estado con la hora modificada
            updated[day][shift][hour] = updatedHour;
    
            // Enviar solicitud PUT con datos correctos
            axios.put(`${apiUrl}/api/admincalendar/remove`, { 
                day, 
                shift, 
                hour, 
                index 
            })

            .then(() => {
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
                    title: "Usuario eliminado"
                });
                
            })
            .catch((err) => {
                console.error("Error removing person:", err.response?.data || err.message);
            });
    
            return updated;
        });
    };

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index];
        
        // Pedir al usuario que ingrese el turno de destino (mañana o tarde)
        const toShift = prompt("Ingresa el turno de destino (mañana o tarde):");
        if(toShift !== null){
            // Validar que el turno sea válido
        if (toShift.toLocaleLowerCase() !== "mañana" && toShift.toLocaleLowerCase() !== "tarde") {
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
                title: "Turno invalido. Por favor ingresa mañana o tarde."
            });
            return;
        }
        }
        
        // Pedir al usuario que ingrese la hora de destino
        const toHour = prompt("Ingresa la hora de destino (por ejemplo, 16):");
        
        // Convertir la hora ingresada a un número
        let toHourNumber = parseInt(toHour, 10);
    
        // Validar que toHourNumber sea un número válido y que exista en el turno seleccionado
        if (!isNaN(toHourNumber) && calendar[fromDay] && calendar[fromDay][toShift] && calendar[fromDay][toShift].hasOwnProperty(toHourNumber)) {
            
            const emptyIndex = calendar[fromDay][toShift][toHourNumber].indexOf(null);

            // Remover la persona de su horario actual
            const personaRepetida = calendar[fromDay][toShift][toHourNumber].map(pers => pers === person.toLocaleLowerCase())
            if(!(personaRepetida.filter(p => p === true).length > 0)){
                handleRemovePerson(fromDay, fromShift, fromHour, index);
            }
            if (emptyIndex !== -1) {
                // Mover a la persona al nuevo horario
                handleAddPerson(fromDay, toShift, toHourNumber, person);
            } else {
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
                    title: "El horario de destino esta completo."
                });
                // Si el horario de destino está completo, la persona se vuelve a añadir al horario original
                handleAddPerson(fromDay, fromShift, fromHour, person);
            }
        } else {
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
                title: "Hora inválida o el horario no existe en el calendario"
            });
            // Si la hora es inválida, la persona se vuelve a añadir al horario original
            handleAddPerson(fromDay, fromShift, fromHour, person);
        }
    };
    

    //Funcion para guardar los dias y horarios ocupados
    const getHorariosOcupados = (calendar, selectedUser) => {
        const ocupado = [];
        Object.keys(calendar).forEach(day => {
            Object.keys(calendar[day]).forEach(shift => {
                Object.keys(calendar[day][shift]).forEach(hour => {
                    calendar[day][shift][hour].forEach((user, index) => {
                        if(user === selectedUser.toLowerCase()){
                            ocupado.push({day, shift, hour});
                        };
                    });
                });
            });
        });
        return ocupado
    }

    const options = userData.map((usuario) => ({value: usuario._id, label: `${usuario.username} ${usuario.userlastname}`}));

    const handleSelectChange = (selectOption) => {
        setSelectedUser(selectOption.label);
        const ocupado = getHorariosOcupados(calendar, selectOption.label);
        setHorariosOcupados(ocupado);
    }

    return (
        <Box className='animate__animated animate__backInUp'>
            <Box
                margin='15px 0 0 0'
                textAlign='center'
                display='flex'
                flexDir='column'
                alignItems='center'
                >
                <Heading
                    fontFamily='"Poppins", sans-serif;'
                    fontSize={['1.6rem','2rem','2.3rem']}
                    >Seccion del Administrador <br />
                </Heading>
                <FormLabel
                    marginTop='15px'
                    textAlign='center'
                    >
                    Elije el usuario a modificar
                </FormLabel>
                <ReactSelect
                    className='selectUser'  
                    onChange={handleSelectChange} 
                    placeholder="nombre del usuario"
                    options={options}
                    isSearchable
                >
                </ReactSelect>
            </Box>
            {selectedUser && horariosOcupados.length > 0 && (
                <Box
                    mt='30px'
                    display='flex'
                    justifyContent='center'
                    >
                    <Button 
                        onClick={() => setIsModalOpen(true)} 
                        backgroundColor={theme === 'light' ? 'white' : 'black'}
                        color={theme === 'light' ? 'black' : 'white'}
                        border='1px solid #80c687'
                        boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        transition='all 0.3s ease'
                        _hover={{
                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            backgroundColor:'#80c687',
                            color: theme === 'light' ? 'white' : 'black'
                        }}>Ver Turnos Asignados</Button>
                    <ModalOcupados isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} horariosOcupados={horariosOcupados} />
                </Box>
            )}
            
            <Box
                margin='30px 0 30px 0px'
                textAlign='center'
                >
                <Flex
                    marginTop='20px'
                    columnGap={['0','30px','30px']}
                    rowGap={['10px','10px','0']}
                    justifyContent='center'
                    alignItems='center'
                    flexDir={['column', 'column', 'row']}
                    >
                    <Select w='250px' onChange={(e) => setSelectedDay(e.target.value)} value={selectedDay} border='1px solid #80c687'>
                    <option value="">Seleccionar Día</option>
                    {Object.keys(calendar).map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                    </Select>

                    {selectedDay && 
                        <Box
                            display='flex'
                            columnGap='30px'
                            flexDir={['column', 'column', 'row']}
                            rowGap={['10px','10px','0']}
                            >
                            {selectedDay === 'sábado' ? 
                            <Select w='250px' onChange={(e) => setSelectedShift(e.target.value)} value={selectedShift} border='1px solid #80c687'>
                                <option value="">Seleccionar Turno</option>
                                <option value="mañana">Mañana (09:30 - 11:30)</option>
                            </Select> :
                            <Select w='250px' onChange={(e) => setSelectedShift(e.target.value)} value={selectedShift} border='1px solid #80c687'>
                                <option value="">Seleccionar Turno</option>
                                <option value="mañana">Mañana (07:00 - 12:00)</option>
                                <option value="tarde">Tarde (13:00 - 20:00)</option>
                            </Select>
                            }

                            {selectedShift && 
                                <Select w='250px' onChange={(e) => setSelectedHour(e.target.value)} value={selectedHour} border='1px solid #80c687'>
                                    <option value="">Seleccionar Hora</option>
                                    {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                                        Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                            selectedDay === 'sábado' ? 
                                            <option key={hour} value={hour}>{hour.length === 3 ? hour[0] + ':' + hour.slice(1) : (hour).slice(0,2) + ':' + (hour).slice(2)}</option> :
                                            <option key={hour} value={hour}>{hour}:00</option>
                                        ))
                                        : <option value="">No hay horas disponibles</option>
                                    }
                                </Select>
                            }
                        </Box>
                    }
                    

                    <Button
                        backgroundColor={theme === 'light' ? 'white' : 'black'}
                        color={theme === 'light' ? 'black' : 'white'}
                        border='1px solid #80c687'
                        boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        transition='all 0.3s ease'
                        _hover={{
                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            backgroundColor:'#80c687',
                            color: theme === 'light' ? 'white' : 'black'
                        }}
                        onClick={() => {
                            if (selectedDay && selectedShift && selectedHour && selectedUser) {
                            handleAddPerson(selectedDay, selectedShift, selectedHour, selectedUser);
                            } else {
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
                                    icon: "info",
                                    title: "Selecciona un dia, un turno, una hora y proporciona tu nombre"
                                });
                            }
                        }}
                        disabled={!selectedUser || !selectedDay || !selectedShift || !selectedHour}
                    >
                    Inscribirme
                    </Button>
                </Flex>
                
            </Box>

            {selectedDay && selectedShift && (   
                <Box
                    display='flex'
                    flexDir='column'
                    alignItems='center'
                    rowGap='30px'
                    >
                    <Text
                        fontWeight='bold'
                        fontSize={['1.5rem','2rem','2rem']}
                        textTransform='capitalize'
                        textAlign='center'
                        className='animate__animated animate__fadeInLeftBig'
                        >{selectedDay} <br/> Turno {selectedShift === 'mañana' ? 'Mañana' : 'Tarde'}</Text>
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        flexDir={['column','column','row']}
                        columnGap='16px'
                        rowGap={['10px','10px','10px']}
                        w={['85%','85%','95%']}
                        flexWrap={['wrap','wrap','wrap']}
                        >
                        {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                            Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                <Flex className='animate__animated animate__backInUp' key={hour} flexDir='column' flex='0 0 calc(33.33% - 16px)' boxSizing='border-box' rowGap='5px' w={['95%','80%','300px']} alignItems='center' border='1px solid black' borderRadius='10px' padding='15px'>
                                    {selectedDay === 'sábado' ?
                                    <Text textDecor='underline' fontWeight='bold' fontSize='2rem' margin='0 20px 0 20px'>{hour.length === 3 ? hour[0] + ':' + hour.slice(1) : (hour).slice(0,2) + ':' + (hour).slice(2)}</Text> :
                                    <Text textDecor='underline' fontWeight='bold' fontSize='1.6rem' margin='0 20px 0 20px'>{hour}:00</Text>
                                }
                                    {calendar[selectedDay][selectedShift][hour].map((person, index) => (
                                        <Box key={index} w='85%' display='flex' flexDir='row' alignItems='center' justifyContent='space-around' paddingTop='5px' paddingBottom='5px'>
                                            <Button
                                                display={person ? 'flex' : 'none'}
                                                backgroundColor={theme === 'light' ? 'white' : 'black'}
                                                color='black'
                                                boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                                                transition='all 0.3s ease'
                                                border='1px solid #80c687'
                                                _hover={{
                                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    transform: 'translateY(-2px)',
                                                    backgroundColor:'red'
                                                }}
                                                fontSize='.9rem' w='auto' h='5vh' onClick={() => handleRemovePerson(selectedDay, selectedShift, hour, index)}>
                                                    🗑️
                                                </Button>
                                                <Text
                                                    textTransform='capitalize'
                                                    textDecor={selectedUser.toLocaleLowerCase() === person ? 'underline' : 'none'}
                                                    textAlign='center'
                                                    fontSize='0.9rem'
                                                    w='100%'
                                                    style={{fontWeight: 'bold', margin: '5px 0 10px 0'}} 
                                                    color={person ? 'auto' : 'green'}
                                                    >{person || "Disponible"}</Text>
                                            <Button
                                                display={person ? 'flex' : 'none'}
                                                backgroundColor={theme === 'light' ? 'white' : 'black'}
                                                color={theme === 'light' ? 'black' : 'white'}
                                                border='1px solid #80c687'
                                                boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                                                transition='all 0.3s ease'
                                                _hover={{
                                                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                                                    transform: 'translateY(-2px)',
                                                    backgroundColor:'#80c687',
                                                    color: theme === 'light' ? 'white' : 'black'
                                                }}
                                                fontSize='.8rem' w='32%' h='32px' onClick={() => {
                                                handleMovePerson(selectedDay, selectedShift, hour, index);
                                            }}>
                                                Mover
                                            </Button>
                                        </Box>
                                    ))}
                                </Flex>
                            )) 
                            : <Text marginLeft='50px'>No hay horarios disponibles para este turno.</Text>
                        }
                    </Flex>
                </Box>
                )
            }
            <Box
                margin='30px 0 20px 0'
                display='flex'
                alignItems='center'
                justifyContent='center'
                flexDir='column'
                rowGap='10px'
                >
                <Text
                    w='90%'
                    color='red'
                    textAlign='center'
                    >
                    Cuidado! Si apretas este boton todo lo que modificaste en este calendario se trasladara automaticamente al semanal
                </Text>
                <Button
                    backgroundColor={theme === 'light' ? 'white' : 'black'}
                    color={theme === 'light' ? 'black' : 'white'}
                    border='1px solid #80c687'
                    boxShadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                    transition='all 0.3s ease'
                    _hover={{
                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)',
                        backgroundColor:'#80c687',
                        color: theme === 'light' ? 'white' : 'black'
                    }} 
                    onClick={handleResetCalendar}
                    >
                    Resetear Calendario
                </Button>
            </Box>
        </Box>
    );
};

export default InitialCalendar;