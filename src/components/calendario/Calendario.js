import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../../css/calendario/Calendario.css'
import { Box, Button, Flex, FormLabel, Heading, Input, Select, Text } from '@chakra-ui/react';
import Swal from 'sweetalert2'

const initialCalendar = {
    lunes: {
        mañana: {
            8: ["isabel c","belu s","joaco m","hugo d","nanci g","javier r","miriam p"],
            9: ["valen o","lu s","ale p","beti f","mauri l",null],
            10: ["ro b","ailen m","facu a","omar b",null,null],
            11: ["bruno",null,null,null,null,null]
        },
        tarde: {
            16: ["jor p","dona r","irina r","mayra n","marian g","cuervo",null],
            17: ["clari s","ale a","ale g","facu a",null,null,null],
            18: ["franco s","alicia n","belu a","damian o","maela g","eze s"],
            19: ["rama r","maia b","mariano f","uli","mica p",null],
        }
    },
    martes: {
        mañana: {
            8: ["joaco m","agos p","juan jose f","pato c",null,null,null],
            9: ["marina m","sabri v","lu w","flor p","mayra n","martina g"],
            10: ["adri f","marian m","betty j",null,null,null],
            11: ["dani r",null,null, null, null, null]
        },
        tarde: {
            16: ["dani e","ziu r","malvi r","liliana v","rocio g",null,null],
            17: ["guille sc","irina r","elba g",null,null,null,null],
            18: ["frances","sofi f","eve v",null,null,null],
            19: ["lucas k",null,null,null,null,null]
        }
    },
    miércoles: {
        mañana: {
            8: ["daniela a","belu s","isabel c","nanci g","romi m",null,null],
            9: ["beti f","valen o","lu s","mauri l","yaz w",null],
            10: ["ro b","flor b","ailen m","omar b",null,null],
            11: ["dani r",null,null,null,null,null]
        },
        tarde: {
            16: ["irina r","fati d","mayra n","cande b","marian g",null,null],
            17: ["clari s","ale a","ale g","cuervo","facu a",null,null],
            18: ["maela g","eze s","vero t","franco s","bruno",null],
            19: ["rama r","maia b","uli","mica p",null,null],
        }
    },
    jueves: {
        mañana: {
            8: ["joaco m","javier r",null,null,null,null,null],
            9: ["marina m","ale p","flor p","martina g","sabri v",null],
            10: ["dani e","facu a","marian m",null,null,null],
            11: [null,null,null,null,null,null]
        },
        tarde: {
            16: ["dona r","jor p","mayra n","ziomara r","malvi r",null,null],
            17: ["agos p","facu a","rocio g","liliana v","elba","guille sc","pato c"],
            18: ["frances","belu a","irina r",null,null,null],
            19: ["mariano f","flor m","lucas k","sofi f","eve v",null],
        }
    },
    viernes: {
        mañana: {
            8: ["juan jose f","miriam p","daniela a","isabel c","romi m","belu s","hugo d"],
            9: ["martina g","yaz w","lu w","beti f","nanci g","mauri l"],
            10: ["ro b","dani r","adri f","flor b","ailen m",null],
            11: [null,null,null,null,null,null]
        },
        tarde: {
            16: ["jor p","marian g","mayra n","cande b","dona r","irina r",null],
            17: ["ale g","bruno","liliana v","rocio g","damian o","irina r",null],
            18: ["alicia n","eze s","maela g","vero t", null,null],
            19: ["maia b","rama r","mica p","uli",null,null],
        }
    },
    sábado: {
        mañana: {
            930: ["yaz w","fatima d","dani r","flor p","licha r",null],
            1030: ["lu s","marian m","eve v","sofia f",null,null],
            1130: ["flor m",null,null,null,null,null,null]
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

            if(personaRepetida.filter(p => p === true).length > 0){
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
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
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
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
                return updated;
            } else {
                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
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
            const updated = { ...prev };
            updated[day][shift][hour][index] = null;
            return updated;
            });
            const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                    }
                });
                Toast.fire({
                    icon: "error",
                    title: "Usuario eliminado"
                });
        };

    const handleMovePerson = (fromDay, fromShift, fromHour, index) => {
        const person = calendar[fromDay][fromShift][fromHour][index];
    
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
                                const Toast = Swal.mixin({
                                    toast: true,
                                    position: "top-end",
                                    showConfirmButton: false,
                                    timer: 3000,
                                    timerProgressBar: true,
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
