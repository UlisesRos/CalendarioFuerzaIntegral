import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../css/Calendario.css'
import { Box, Button, Flex, FormLabel, Heading, Input, Select, Text } from '@chakra-ui/react';

const initialCalendar = {
    lunes: {
        mañana: {
            8: ["Isabel C", "Joaco", "Nanci", "Javier R", null, null],
            9: ["Valen O", "Pau", "Beti F", "Mauri L", null, null],
            10: ["Omar B", "Facu Azar", null, null, null, null],
            11: ["Bruno", "Damian O", null, null, null, null]
        },
        tarde: {
            16: ["Jor P", "Ale G", "Irina Roman", "Mayra N", "Marian G", "Cuervo"],
            17: ['Clari S', "Ale A", "Belu A", "Facu A", null, null],
            18: ["Franco S", "Alicia N", "Melina L", "Uli", "Maela G", "Mica P"],
            19: ["Rama R", "Maia B", "Marian F", "Lu S", "Dani R", null],
        }
    },
    martes: {
        mañana: {
            8: ["Agos P", "Joaco", "Juan Jose F", "Belu", null, null],
            9: ["Marina M", "Sabri V", "Lucas Kalu", "Flor P", "Martina G", null],
            10: ["Betty J", "Adri F", "Ailen", "Marina M", null, null],
            11: ["Mer S", "Flor B", "Mayra N", null, null, null]
        },
        tarde: {
            16: ["Dani E", "Juli V", "Clari O", "Liliana V", null, null],
            17: ["Guille SC", "Pau F", "Eva A", "Elba", "Irina R", "Juan Jose", null],
            18: ["Frances", "Sofia F", "Eve V", "Celeste G", "Patricio", "Dani R"],
            19: Array(6).fill("Cerrado"),
        }
    },
    miércoles: {
        mañana: {
            8: ["Lu W", "Isabel C", "Nanci G", "Romi M", null, null],
            9: ["Daniela A", "Mauri L", "Ale P", "Yas", null, null],
            10: ["Ailen M","Omar B",null,null,null,null],
            11: ["Lu S",null,null,null,null,null]
        },
        tarde: {
            16: ["Irina R","Ale G","Marcelo M","Cande B","Marian G",null],
            17: ["Ale A","Melina L","Facu A","Cuervo","Sofia F",null,null],
            18: ["Uli","Flor M","Laura F","Franco S","Bruno","Mica P"],
            19: ["Frances","Juli",null,null,null,null],
        }
    },
    jueves: {
        mañana: {
            8: ["Joaco M","Javier R",null,null,null,null],
            9: ["Yaz","Belu","Licha R","Martina G",null,null],
            10: ["Ro B","Mayra","Betty J",null,null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["Juli Pau","Dona R","Jor P","Alicia N","Ziomara R","Malvi R"],
            17: ["Agos P","Facu A","Cori O","Liliana V","Dani R","Guille S","Eva A"],
            18: ["Frances","Celesta G",null,null,null,null],
            19: ["Mariano F","Lucas K","Rama",null,null,null],
        }
    },
    viernes: {
        mañana: {
            8: ["Daniela A","Isabel C",null,null,null,null],
            9: ["Lu W","Flor B",null,null,null,null],
            10: ["Dani R","Mauri","Damian O","Cori O",null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["Ale G","Marian G","Belu A","Cande B","Irina R",null],
            17: ["Sofia F","Melina L","Eve V",null,null,null],
            18: ["Ro B","Belu","Irina R","Maela G","Mica P", null],
            19: ["Maia B","Rama R","Frances","Juli B","Uli","Flor M"],
        }
    },
    sábado: {
        mañana: {
            9: ["Fatima D","Dani R","Flor P","Lu S","Cori O",null],
            10: ["Marian M","Eve v","Sofia F","Ro B",null,null],
            11: ["Mayran", "Dona R",null,null,null,null]
        }
    }
};

const Calendario = () => {
    
    const [calendar, setCalendar] = useState(() => {
        const savedCalendar = localStorage.getItem("calendar");
        return savedCalendar ? JSON.parse(savedCalendar) : initialCalendar;
    });
    
    const [name, setName] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [selectedHour, setSelectedHour] = useState("");

    const handleResetCalendar = () => {
        setCalendar(initialCalendar);
        localStorage.setItem("calendar", JSON.stringify(initialCalendar));
    };

    // Persistencia 
    useEffect(() => {
        localStorage.setItem("calendar", JSON.stringify(calendar));
    }, [calendar]);

    // Resetear el calendario cada sabado a las 15hs
    useEffect(() => {
        const now = moment();
        const saturday15h = moment().day(6).hour(15).minute(0).second(0);
    
        if (now.isAfter(saturday15h)) {
            saturday15h.add(1, 'week');
        }
    
        const timeUntilReset = saturday15h.diff(now);
    
        const timer = setTimeout(() => {
            setCalendar(initialCalendar);
            localStorage.setItem("calendar", JSON.stringify(initialCalendar));
        }, timeUntilReset);
    
        return () => clearTimeout(timer);
    }, []);

    const handleAddPerson = (day, shift, hour, name) => {
        setCalendar((prev) => {
            // Crear una copia profunda del estado previo
            const updated = JSON.parse(JSON.stringify(prev));
            const availableSlot = updated[day][shift][hour].indexOf(null);
    
            if (availableSlot !== -1) {
                updated[day][shift][hour][availableSlot] = name;
                setName(""); // Limpia el campo de entrada
                return updated;
            } else {
                alert("No hay espacios disponibles en este horario.");
                return prev;
            }
        });
    };

    const handleRemovePerson = (day, shift, hour, index) => {
            setCalendar((prev) => {
            const updated = { ...prev };
            updated[day][shift][hour][index] = null;
            return updated;
            });
    };

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index];
    
        // Pedir al usuario que ingrese el turno de destino (mañana o tarde)
        const toShift = prompt("Ingresa el turno de destino (mañana o tarde):");
    
        // Validar que el turno sea válido
        if (toShift !== "mañana" && toShift !== "tarde") {
            alert("Turno inválido. Por favor ingresa 'mañana' o 'tarde'.");
            return;
        }
    
        // Pedir al usuario que ingrese la hora de destino
        const toHour = prompt("Ingresa la hora de destino (por ejemplo, 16):");
    
        // Convertir la hora ingresada a un número
        const toHourNumber = parseInt(toHour, 10);
    
        // Validar que toHourNumber sea un número válido y que exista en el turno seleccionado
        if (!isNaN(toHourNumber) && calendar[fromDay] && calendar[fromDay][toShift] && calendar[fromDay][toShift].hasOwnProperty(toHourNumber)) {
            // Remover la persona de su horario actual
            handleRemovePerson(fromDay, fromShift, fromHour, index);
    
            const emptyIndex = calendar[fromDay][toShift][toHourNumber].indexOf(null);
            if (emptyIndex !== -1) {
                // Mover a la persona al nuevo horario
                handleAddPerson(fromDay, toShift, toHourNumber, person);
            } else {
                alert("El horario de destino está completo.");
                // Si el horario de destino está completo, la persona se vuelve a añadir al horario original
                handleAddPerson(fromDay, fromShift, fromHour, person);
            }
        } else {
            alert("Hora inválida o el horario no existe en el calendario.");
            // Si la hora es inválida, la persona se vuelve a añadir al horario original
            handleAddPerson(fromDay, fromShift, fromHour, person);
        }
    };
    
    


    return (
        <Box>
            <Box
                margin='30px 0 0 50px'
                textAlign='center'
                >
                <FormLabel
                    textAlign='center'
                    >
                    Nombre
                </FormLabel>
                <Input
                    border='1px solid black'
                    w='30%'
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Ingresa tu nombre" 
                />
            </Box>
            
            <Box
                margin='30px 0 30px 50px'
                textAlign='center'
                >
                <Heading
                    fontFamily='"Poppins", sans-serif;'
                    >Selecciona un día y una hora para inscribirte</Heading>
                <Flex
                    marginTop='20px'
                    columnGap='30px'
                    justifyContent='center'
                    >
                    <Select w='200px' onChange={(e) => setSelectedDay(e.target.value)} value={selectedDay}>
                    <option value="">Seleccionar Día</option>
                    {Object.keys(calendar).map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                    </Select>

                    {selectedDay && 
                        <Box
                            display='flex'
                            columnGap='30px'
                            >
                            {selectedDay === 'sábado' ? 
                            <Select w='250px' onChange={(e) => setSelectedShift(e.target.value)} value={selectedShift}>
                                <option value="">Seleccionar Turno</option>
                                <option value="mañana">Mañana (09:30 - 11:30)</option>
                            </Select> :
                            <Select w='250px' onChange={(e) => setSelectedShift(e.target.value)} value={selectedShift}>
                                <option value="">Seleccionar Turno</option>
                                <option value="mañana">Mañana (08:00 - 11:00)</option>
                                <option value="tarde">Tarde (16:00 - 19:00)</option>
                            </Select>
                            }

                            {selectedShift && 
                                <Select w='200px' onChange={(e) => setSelectedHour(e.target.value)} value={selectedHour}>
                                    <option value="">Seleccionar Hora</option>
                                    {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                                        Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                            <option key={hour} value={hour}>{hour}:00</option>
                                        ))
                                        : <option value="">No hay horas disponibles</option>
                                    }
                                </Select>
                            }
                        </Box>
                    }
                    

                    <Button 
                    onClick={() => {
                        if (selectedDay && selectedShift && selectedHour && name) {
                        handleAddPerson(selectedDay, selectedShift, selectedHour, name);
                        } else {
                        alert("Selecciona un día, un turno, una hora y proporciona tu nombre.");
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
                        fontSize='2rem'
                        textDecor='underline'
                        textTransform='capitalize'
                        >{selectedDay} - Turno {selectedShift === 'mañana' ? 'Mañana' : 'Tarde'}</Text>
                    <Flex
                        justifyContent='center'
                        columnGap='60px'
                        w='90%'
                        >
                        {(calendar[selectedDay] && calendar[selectedDay][selectedShift]) ? 
                            Object.keys(calendar[selectedDay][selectedShift]).map(hour => (
                                <Flex key={hour} flexDir='column' w='300px' alignItems='center' border='1px solid black' padding='15px'>
                                    {selectedDay === 'sábado' ?
                                    <Text textDecor='underline' fontWeight='bold' margin='0 20px 0 20px'>{hour}:30</Text> :
                                    <Text textDecor='underline' fontWeight='bold' margin='0 20px 0 20px'>{hour}:00</Text>
                                }
                                    {calendar[selectedDay][selectedShift][hour].map((person, index) => (
                                        <Box key={index} backgroundColor={person ? 'rgba(255, 192, 192, 1)' : 'rgba(152, 255, 152, 1)'} border='1px solid black' w='80%' margin='10px' display='flex' flexDir='column' alignItems='center' rowGap='3px' paddingTop='5px' paddingBottom='5px'>
                                            <Button color='red' fontSize='.9rem' w='50%' h='5vh' onClick={() => handleRemovePerson(selectedDay, selectedShift, hour, index)}>Eliminar</Button>
                                            <span style={{fontWeight: 'bold', margin: '5px 0 10px 0'}}>{person || "Disponible"}</span>
                                            <Button fontSize='.8rem' w='90%' onClick={() => {
                                                handleMovePerson(selectedDay, selectedShift, hour, index);
                                            }}>
                                                Mover a otro turno
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
                margin='20px 0 20px 0'
                display='flex'
                alignItems='center'
                justifyContent='center'
                >
                <Button
                    onClick={handleResetCalendar}
                    >
                    Resetear Initial
                </Button>
            </Box>
        </Box>
    );
};

export default Calendario;
