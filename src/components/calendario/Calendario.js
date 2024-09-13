import React, { useState, useEffect } from 'react';
import '../../css/calendario/Calendario.css'
import { Box, Button, Flex, FormLabel, Heading, Select, Text } from '@chakra-ui/react';
import ReactSelect from 'react-select'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io('/')
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Calendario = ({ theme }) => {

    // Calendario que se guarda en MONGODB
    const [calendar, setCalendar] = useState('')
    
    // Ejecutar el render para que no tenga inactividad
    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await axios.get(`${apiUrl}`)
                console.log('Solicitud silenciosa exitosa!', response.data)

            } catch (error) {
                console.error('Error al ejecutar el render', error)
            }
        }

        fetchCalendar()
    }, [])

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/calendar`);
                setCalendar(response.data);
            } catch (error) {
                console.error('Error fetching calendar', error)
            }
        };
        
        fetchCalendar();

        // Escuchar el evento de actualizacion del calendario desde el servidor
        socket.on('updateCalendar', (updateCalendar) => {
            setCalendar(updateCalendar);
        });

        return () => {
            socket.off('updateCalendar');
        }
    }, [])

    //UseState para manejar las distintas cosas (nombre, dia, turno y hora)
    const [name, setName] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [selectedHour, setSelectedHour] = useState("");
    
    const handleAddPerson = (day, shift, hour, name, mover) => {
        setCalendar((prev) => {
            // Crear una copia profunda del estado previo
            const updated = JSON.parse(JSON.stringify(prev));
            const availableSlot = updated[day][shift][hour].indexOf(null);
            const personaRepetida = updated[day][shift][hour].map(pers => pers === name.toLocaleLowerCase())

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
                    title: `Hola ${name}, ya estas registrado en este horario. Elije otro.`
                });
                return prev
            } else if (availableSlot !== -1) {
                if(mover){
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
                        title: 'Usuario movido a otro horario.'
                    });
                    updated[day][shift][hour][availableSlot] = name.toLocaleLowerCase();
                    setName(""); // Limpia el campo de entrada
                    axios.put(`${apiUrl}/api/calendar`, { day, shift, hour, updatedHour: updated[day][shift][hour] })
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
                    updated[day][shift][hour][availableSlot] = name.toLocaleLowerCase();
                    setName(""); // Limpia el campo de entrada
                    axios.put(`${apiUrl}/api/calendar`, { day, shift, hour, updatedHour: updated[day][shift][hour] })
                    return updated;
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
                    icon: "error",
                    title: "No hay espacios disponibles en este horario."
                })
                return prev;
            }
        });
    };

    const handleRemovePerson = (day, shift, hour, index, mover) => {
        setCalendar((prev) => {
            const updated = { ...prev }
            const updatedHour = [ ...updated[day][shift][hour] ];
            updatedHour[index] = null;

            // Actualizar el estado con la hora modificada
            updated[day][shift][hour] = updatedHour;
    
            // Enviar solicitud PUT con datos correctos
            axios.put(`${apiUrl}/api/calendar/remove`, { 
                day, 
                shift, 
                hour, 
                index 
            })

            .then(() => {
                if(!mover){
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
                }

            })
            .catch((err) => {
                console.error("Error removing person:", err.response?.data || err.message);
            });
    
            return updated;
        });
    };

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index];
        const mover = true
    
        // Pedir al usuario que ingrese el turno de destino (mañana o tarde)
        const toShift = prompt("Ingresa el turno de destino (mañana o tarde):").toLocaleLowerCase();
        
        // Validar que el turno sea válido
        if (toShift !== "mañana" && toShift !== "tarde") {
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
                handleRemovePerson(fromDay, fromShift, fromHour, index, mover);
            }
            if (emptyIndex !== -1) {
                // Mover a la persona al nuevo horario
                handleAddPerson(fromDay, toShift, toHourNumber, person, mover);
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

    // Obtener todos los usuarios del calendario para el select
    const usuariosCalendar = (calendar) => {
        const userSet = new Set();

        Object.values(calendar).forEach(day => {
            Object.values(day).forEach(shift => {
                Object.values(shift).forEach(hour => {
                    hour.forEach(user => userSet.add(user))
                })
            })
        });

        return Array.from(userSet)
    }

    const user = usuariosCalendar(calendar)
    const options = user.map((usuarios) => ({value: usuarios, label: usuarios}));

    const handleSelectChange = (selectOption) => {
        setName(selectOption ? selectOption.value : '')
    }

    return (
        <Box>
            <Box
                display='flex'
                flexDir='column'
                alignItems='center'
                margin='15px 0 0 0'
                textAlign='center'
                >
                <FormLabel
                    textAlign='center'
                    >
                    Elije tu nombre
                </FormLabel>
                <ReactSelect
                    className='selectUser'
                    value={options.find(option => option.value === name)} 
                    onChange={handleSelectChange} 
                    placeholder="nombre del usuario"
                    options={options}
                    isSearchable
                >
                </ReactSelect>
            </Box>
            
            <Box
                margin='30px 0 30px 0px'
                textAlign='center'
                >
                <Heading
                    fontFamily='"Poppins", sans-serif;'
                    fontSize={['1.6rem','2rem','2.3rem']}
                    >Selecciona un día y una hora para inscribirte</Heading>
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
                        <option key={day} value={day} >{ day }</option>
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
                                <option value="mañana">Mañana (08:00 - 11:00)</option>
                                <option value="tarde">Tarde (16:00 - 19:00)</option>
                            </Select>
                            }

                            {selectedShift && 
                                <Select w='250px' onChange={(e) => setSelectedHour(e.target.value)} value={selectedHour} border='1px solid #80c687'>
                                    <option value="">Seleccionar Hora</option>
                                    {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                                        Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                            selectedDay === 'sábado' ? 
                                            <option key={hour} value={hour}>{hour}</option> :
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
                        box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
                        transition='all 0.3s ease'
                        _hover={{
                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)',
                            transform: 'translateY(-2px)',
                            backgroundColor:'#80c687',
                            color: theme === 'light' ? 'white' : 'black'
                        }}
                        onClick={() => {
                            if (selectedDay && selectedShift && selectedHour && name) {
                            handleAddPerson(selectedDay, selectedShift, selectedHour, name);
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
                        disabled={!name || !selectedDay || !selectedShift || !selectedHour}
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
                        textDecor='underline'
                        textTransform='capitalize'
                        textAlign='center'
                        >{selectedDay} - Turno {selectedShift === 'mañana' ? 'Mañana' : 'Tarde'}</Text>
                    <Flex
                        justifyContent='center'
                        alignItems='center'
                        flexDir={['column','column','row']}
                        columnGap='40px'
                        rowGap={['10px','10px','0']}
                        w={['80%','80%','90%']}
                        flexWrap={['wrap','wrap','nowrap']}
                        >
                        {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                            Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                <Flex key={hour} flexDir='column' rowGap='5px' w={['95%','80%','300px']} alignItems='center' border='1px solid black' borderRadius='10px' padding='15px'>
                                    {selectedDay === 'sábado' ? 
                                    <Text textDecor='underline' fontWeight='bold' fontSize='2rem' margin='0 20px 0 20px'>{hour}</Text> :
                                    <Text textDecor='underline' fontWeight='bold' fontSize='1.6rem' margin='0 20px 0 20px'>{hour}:00</Text>
                                }
                                    {calendar[selectedDay][selectedShift][hour].map((person, index) => (
                                        <Box key={index} w='100%' display='flex' flexDir='row' alignItems='center' justifyContent='space-around' paddingTop='5px' paddingBottom='5px'>
                                            <Button
                                                display={name.toLocaleLowerCase() === person ? 'flex' : 'none'}
                                                backgroundColor={theme === 'light' ? 'white' : 'black'}
                                                color='black'
                                                box-shadow= '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
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
                                                    textDecor={name.toLocaleLowerCase() === person ? 'underline' : 'none'}
                                                    textAlign='center'
                                                    w='100%'
                                                    style={{fontWeight: 'bold', margin: '5px 0 10px 0'}} 
                                                    color={person ? 'auto' : 'green'}
                                                    >{person || "Disponible"}</Text>
                                            <Button
                                                display={name.toLocaleLowerCase() === person ? 'flex' : 'none'}
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
        </Box>
    );
};

export default Calendario;
