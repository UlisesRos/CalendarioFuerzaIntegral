import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, Heading, Text, Spinner, useToast } from '@chakra-ui/react';

const preciosAdminStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    
    .pa-header { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .pa-panel  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }
    .pa-actions { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.16s both; }

    .pa-input-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 20px;
    }

    .pa-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #A0AEC0;
    }

    .pa-input {
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        border-radius: 12px;
        padding: 12px 16px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .pa-input:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }

    .pa-save-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.92rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 14px;
        padding: 15px 36px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .pa-save-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(104,211,145,0.45);
    }
    .pa-save-btn:active:not(:disabled) {
        transform: translateY(0);
    }
    .pa-save-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

function PreciosAdmin({ theme, apiUrl }) {
    const [config, setConfig] = useState({
        precios: { 1: '', 2: '', 3: '', 4: '', 5: '' },
        descuento: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useToast();

    const isDark = theme === 'dark';
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white';
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)';
    const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748';
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white';

    useEffect(() => {
        cargarConfiguracion();
    }, []);

    const cargarConfiguracion = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${apiUrl}/api/config/precios`);
            if (response.data) {
                // Convertir el descuento a porcentaje para mostrarlo mejor
                const descPorcentual = response.data.descuento ? response.data.descuento * 100 : 0;
                setConfig({
                    precios: response.data.precios || { 1: '', 2: '', 3: '', 4: '', 5: '' },
                    descuento: descPorcentual
                });
            }
        } catch (error) {
            toast({
                title: 'Error al cargar precios',
                description: 'No se pudo obtener la configuración actual.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePrecio = (dias, valor) => {
        setConfig({
            ...config,
            precios: {
                ...config.precios,
                [dias]: valor
            }
        });
    };

    const handleGuardar = async () => {
        setSaving(true);
        try {
            // Revertir el descuento a decimal antes de enviar (ej. 10 -> 0.1)
            const payload = {
                precios: {
                    1: Number(config.precios[1]),
                    2: Number(config.precios[2]),
                    3: Number(config.precios[3]),
                    4: Number(config.precios[4]),
                    5: Number(config.precios[5]),
                },
                descuento: Number(config.descuento) / 100
            };

            await axios.put(`${apiUrl}/api/config/precios`, payload);
            toast({
                title: 'Configuración guardada',
                description: 'Los nuevos precios y descuentos fueron aplicados correctamente.',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error al guardar',
                description: 'Verificá tu conexión o permisos y volvé a intentarlo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Flex w="100%" h="70vh" align="center" justify="center" flexDir="column" gap="12px">
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">Restaurando registros...</Text>
                <Spinner size="lg" color="green.400" thickness="3px" />
            </Flex>
        );
    }

    return (
        <Box
            display="flex"
            flexDir="column"
            alignItems="center"
            w="100%"
            px={['16px', '24px', '40px']}
            py={['32px', '52px']}
        >
            <style>{preciosAdminStyles}</style>

            {/* ── Header ── */}
            <Box className="pa-header" w="100%" maxW="600px" mb={['24px', '32px']}>
                <Flex alignItems="center" gap="10px" mb="10px">
                    <Box w="24px" h="2px" bg="green.400" borderRadius="full" />
                    <Text
                        fontFamily='"Poppins", sans-serif'
                        fontSize="0.7rem"
                        letterSpacing="0.25em"
                        textTransform="uppercase"
                        color="gray.500"
                    >
                        Configuración global
                    </Text>
                </Flex>
                <Heading
                    fontFamily='"Playfair Display", serif'
                    fontSize={['1.8rem', '2.4rem']}
                    fontWeight="900"
                    letterSpacing="-0.02em"
                    color={isDark ? 'white' : 'gray.900'}
                    lineHeight="1.1"
                >
                    Precios y Descuentos
                </Heading>
                <Text
                    mt="8px"
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.85rem"
                    color={textMuted}
                    lineHeight="1.6"
                >
                    Los cambios aplicados aquí impactarán directamente en el flujo de pagos de toda la plataforma de forma inmediata.
                </Text>
            </Box>

            {/* ── Panel de edición ── */}
            <Box
                className="pa-panel"
                w="100%" maxW="600px"
                bg={panelBg}
                border="1px solid"
                borderColor={borderC}
                borderRadius="16px"
                p={['20px', '32px']}
                mb="24px"
            >
                <Flex alignItems="center" gap="10px" mb="24px">
                    <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                    <Text fontFamily='"Poppins", sans-serif' fontSize="0.68rem" letterSpacing="0.2em" textTransform="uppercase" color={textMuted}>
                        Cuotas por días de entrenamiento
                    </Text>
                </Flex>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', columnGap: '20px' }}>
                    {[1, 2, 3, 4, 5].map(dias => (
                        <div className="pa-input-group" key={dias}>
                            <label className="pa-label">Precio para {dias} {dias === 1 ? 'Día' : 'Días'}</label>
                            <input
                                className="pa-input"
                                type="number"
                                style={{ background: inputBg, color: textMain }}
                                value={config.precios[dias]}
                                onChange={(e) => handleChangePrecio(dias, e.target.value)}
                                placeholder="Ej. 40000"
                            />
                        </div>
                    ))}
                </div>

                <Flex alignItems="center" gap="10px" mt="10px" mb="24px" pt="20px" borderTop={`1px solid ${borderC}`}>
                    <Box w="20px" h="2px" bg="blue.400" borderRadius="full" />
                    <Text fontFamily='"Poppins", sans-serif' fontSize="0.68rem" letterSpacing="0.2em" textTransform="uppercase" color={textMuted}>
                        Descuentos especiales
                    </Text>
                </Flex>

                <div className="pa-input-group" style={{ maxWidth: '300px' }}>
                    <label className="pa-label">Porcentaje de descuento (%)</label>
                    <input
                        className="pa-input"
                        type="number"
                        style={{ background: inputBg, color: textMain }}
                        value={config.descuento}
                        onChange={(e) => setConfig({ ...config, descuento: e.target.value })}
                        placeholder="Ej. 10 (para 10%)"
                    />
                </div>
            </Box>

            {/* ── Acciones ── */}
            <Box className="pa-actions" w="100%" maxW="600px">
                <button
                    className="pa-save-btn"
                    onClick={handleGuardar}
                    disabled={saving}
                >
                    {saving ? (
                        <><Spinner size="sm" color="gray.800" thickness="2px" /> Guardando...</>
                    ) : (
                        <>Guardar Configuración</>
                    )}
                </button>
            </Box>
        </Box>
    );
}

export default PreciosAdmin;
