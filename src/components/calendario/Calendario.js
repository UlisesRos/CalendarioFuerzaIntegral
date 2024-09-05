import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../css/calendario/Calendario.css'
import { Box, Button, Flex, FormLabel, Heading, Input, Select, Text } from '@chakra-ui/react';

const initialCalendar = {
    lunes: {
        mañana: {
            8: [null, null, "isabel c", "joaco", "nanci", "javier r"],
            9: [null, null, "valen o", "pau", "beti f", "mauri l"],
            10: [null, null, null, null,"omar b", "facu a"],
            11: [null, null, null, null,"bruno", "damian o"]
        },
        tarde: {
            16: ["jor p", "ale g", "irina roman", "mayra n", "marian g", "cuervo"],
            17: [ null, null, 'clari s', "ale a", "belu a", "facu a"],
            18: ["franco s", "alicia n", "melina l", "uli", "maela g", "mica p"],
            19: [ null, "rama", "maia b", "marian f", "lu s", "dani r"],
        }
    },
    martes: {
        mañana: {
            8: ["agos p", "joaco", "juan jose f", "belu", null, null],
            9: ["mariana m", "sabri v", "lucas k", "flor p", "martina g", null],
            10: ["betty j", "adri f", "ailen", "mariana m", null, null],
            11: ["mer s", "flor b", "mayra n", null, null, null]
        },
        tarde: {
            16: ["dani e", "juli v", "clari o", "liliana v", null, null],
            17: ["guille sc", "pau f", "eva a", "elba", "irina r", "juan jose"],
            18: ["frances", "sofia f", "eve v", "celeste g", "patricio", "dani r"],
            19: Array(6).fill("Cerrado"),
        }
    },
    miércoles: {
        mañana: {
            8: ["lu w", "isabel c", "nanci g", "romi m", null, null],
            9: ["daniela a", "mauri l", "Ale P", "Yas", null, null],
            10: ["ailen m","omar b",null,null,null,null],
            11: ["Lu S",null,null,null,null,null]
        },
        tarde: {
            16: ["irina r","ale G","marcelo m","cande b","marian g",null],
            17: ["ale a","melina l","facu a","cuervo","sofia f",null],
            18: ["ulises","flor m","laura f","franco s","bruno","mica p"],
            19: ["frances","juli",null,null,null,null],
        }
    },
    jueves: {
        mañana: {
            8: ["joaco m","javier r",null,null,null,null],
            9: ["Yaz","belu","Licha R","martina g",null,null],
            10: ["ro b","mayra","betty j",null,null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["juli pau","dona r","jor p","alicia n","ziomara r","malvi r"],
            17: ["agos p","facu a","cori o","liliana v","dani r","guille s","eva a"],
            18: ["frances","celesta g",null,null,null,null],
            19: ["mariano f","lucas k","rama",null,null,null],
        }
    },
    viernes: {
        mañana: {
            8: ["daniela a","isabel c",null,null,null,null],
            9: ["lu w","flor b",null,null,null,null],
            10: ["dani r","mauri l","damian o","cori o",null,null],
            11: Array(6).fill("Cerrado")
        },
        tarde: {
            16: ["ale g","marian g","belu a","cande b","irina r",null],
            17: ["sofia f","melina l","eve v",null,null,null],
            18: ["ro b","belu","irina r","Maela G","mica p", null],
            19: ["maia b","rama","frances","juli b","uli","flor m"],
        }
    },
    sábado: {
        mañana: {
            930: ["fatima d","dani r","flor p","lu s","cori o",null],
            1030: ["marian m","eve v","sofia f","ro b",null,null],
            1130: ["mayran", "dona r",null,null,null,null]
        }
    }
};

const Calendario = ({ theme, adminCalendar }) => {
    
    // Calendario que se guarda en el LOCALSTORAGE
    const [calendar, setCalendar] = useState(() => {
        const savedCalendar = localStorage.getItem("calendar");
        return savedCalendar ? JSON.parse(savedCalendar) : initialCalendar;
    });
    
    //UseState para manejar las distintas cosas (nombre, dia, turno y hora)
    const [name, setName] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedShift, setSelectedShift] = useState("");
    const [selectedHour, setSelectedHour] = useState("");

    // Funcion para resetear el calendario al que estaba en el comienzo
    const handleResetCalendar = () => {
        setCalendar(JSON.parse(localStorage.getItem("calendarAdmin", JSON.stringify(adminCalendar))));    
    };

    // Persistencia 
    useEffect(() => {
        localStorage.setItem("calendar", JSON.stringify(calendar));
    }, [calendar]);

    // Funcion para resetear el calendario todos los sabados a las 15hs
    const resetSaturday = () => {
        const ahora = moment();
        const sabado = ahora.day() === 6;
        const quinceHoras = ahora.hour() === 15 && ahora.minute() === 0;

        if(sabado && quinceHoras) {
            console.log('Ejecutando reseteo del Initial Calendar.')
            handleResetCalendar()
        }
    }

    // Ejecutar la funcion resetSaturday cada una hora para ver si es sabado.
    useEffect(() => {
        
        //Timer para recargar la pagina cada 1 hora
        const timer = setTimeout(() => {
            window.location.reload()
        }, 3600000)
        // ejecutando la funcion que resetea el Initial Calendar
        resetSaturday()

        return() => clearTimeout(timer)
    })

    const handleAddPerson = (day, shift, hour, name) => {
        setCalendar((prev) => {
            // Crear una copia profunda del estado previo
            const updated = JSON.parse(JSON.stringify(prev));
            const availableSlot = updated[day][shift][hour].indexOf(null);
            const personaRepetida = updated[day][shift][hour].map(pers => pers === name.toLocaleLowerCase())

            console.log(updated)

            if(personaRepetida.filter(p => p === true).length > 0){
                alert(`Hola ${name}, ya estas registrado en este horario. Elije otro.`)
                return prev
            } else if (availableSlot !== -1) {
                day === 'sábado' ? alert(`Turno Confirmado: ${day}, ${hour} hs`) : alert(`Turno Confirmado: ${day}, ${hour}:00 hs`)
                updated[day][shift][hour][availableSlot] = name.toLocaleLowerCase();
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
        const toShift = prompt("Ingresa el turno de destino (mañana o tarde):").toLocaleLowerCase();
        
        // Validar que el turno sea válido
        if (toShift !== "mañana" && toShift !== "tarde") {
            alert("Turno inválido. Por favor ingresa 'mañana' o 'tarde'.");
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
                handleRemovePerson(fromDay, fromShift, fromHour, index);
            }
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
                margin='15px 0 0 0'
                textAlign='center'
                >
                <FormLabel
                    textAlign='center'
                    >
                    Nombre Habitual
                </FormLabel>
                <Input
                    border='1px solid #80c687'
                    w={["80%",'40%','30%']}
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    fontSize='0.9rem'
                    placeholder="Ingresa el nombre con el que te registras siempre" 
                />
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
