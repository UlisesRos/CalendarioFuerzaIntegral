import { createPortal } from "react-dom";
import { Flex, Spinner, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

// ─── Estilos ──────────────────────────────────────────────────────────────────
const historialPagosStyles = `
    @keyframes hpBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes hpPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes hpPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hpCardIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .hp-open-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 20px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: rgba(104,211,145,0.08);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .hp-open-btn:hover {
        background: rgba(104,211,145,0.15);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    }

    .hp-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        border-radius: 10px;
        padding: 9px 32px 9px 12px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        flex: 1;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2368D391' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        cursor: pointer;
    }
    .hp-select:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }

    .hp-pago-card {
        animation: hpCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hp-pago-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .hp-close-btn {
        background: rgba(255,255,255,0.08);
        border: none;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.6);
        font-size: 0.82rem;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    .hp-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .hp-reset-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        background: none;
        border: none;
        color: rgba(160,174,192,0.6);
        padding: 0;
        transition: color 0.2s ease;
    }
    .hp-reset-btn:hover { color: #68D391; }
`

// ─── Modal de historial ───────────────────────────────────────────────────────
function HistorialModal({ userData, onClose, theme }) {
    const [mesSeleccionado, setMesSeleccionado] = useState("")
    const [anioSeleccionado, setAnioSeleccionado] = useState("")
    const isMobile = window.innerWidth < 600

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
    const anios = Array.from(
        { length: new Date().getFullYear() - 2024 + 1 },
        (_, i) => 2025 + i
    )

    const formatFecha = (fechaISO) => {
        const fecha = new Date(fechaISO)
        return `${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${fecha.getFullYear()}`
    }

    const pagosFiltrados = userData.historialPagos.filter((pago) => {
        const fechaPago = new Date(pago.fecha)
        const cumpleMes = mesSeleccionado ? fechaPago.getMonth() + 1 === parseInt(mesSeleccionado) : true
        const cumpleAnio = anioSeleccionado ? fechaPago.getFullYear() === parseInt(anioSeleccionado) : true
        return cumpleMes && cumpleAnio
    })

    const selectBg = '#1a2332'
    const selectColor = 'rgba(255,255,255,0.85)'

    const content = (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
                padding: isMobile ? 0 : '16px',
                animation: 'hpBackdropIn 0.3s ease both',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: isMobile ? '92vh' : '82vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: isMobile
                        ? 'hpPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                        : 'hpPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                {/* Handle mobile */}
                {isMobile && (
                    <div style={{
                        position: 'absolute', top: '10px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '36px', height: '4px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '9999px', zIndex: 20,
                    }} />
                )}

                {/* ── Header ── */}
                <div style={{
                    padding: isMobile ? '28px 20px 18px' : '24px 28px 18px',
                    borderBottom: '1px solid rgba(104,211,145,0.12)',
                    flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.65rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#68D391',
                            }}>
                                Mis pagos
                            </span>
                        </div>
                        <button className="hp-close-btn" onClick={onClose}>✕</button>
                    </div>

                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'white',
                        margin: '0 0 4px',
                        lineHeight: 1.1,
                        textTransform: 'capitalize',
                    }}>
                        {userData.username} {userData.userlastname}
                    </h2>
                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.78rem',
                        color: 'rgba(255,255,255,0.35)',
                        margin: 0,
                    }}>
                        {pagosFiltrados.length} {pagosFiltrados.length === 1 ? 'pago encontrado' : 'pagos encontrados'}
                    </p>
                </div>

                {/* ── Filtros ── */}
                <div style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    flexShrink: 0,
                    display: 'flex',
                    gap: '10px',
                    flexWrap: 'wrap',
                }}>
                    <select
                        className="hp-select"
                        value={mesSeleccionado}
                        onChange={(e) => setMesSeleccionado(e.target.value)}
                        style={{ background: selectBg, color: selectColor }}
                    >
                        <option value="">Todos los meses</option>
                        {meses.map((mes, index) => (
                            <option key={index} value={index + 1}>{mes}</option>
                        ))}
                    </select>

                    <select
                        className="hp-select"
                        value={anioSeleccionado}
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
                        style={{ background: selectBg, color: selectColor }}
                    >
                        <option value="">Todos los años</option>
                        {anios.map((anio) => (
                            <option key={anio} value={anio}>{anio}</option>
                        ))}
                    </select>

                    {(mesSeleccionado || anioSeleccionado) && (
                        <button
                            className="hp-reset-btn"
                            onClick={() => { setMesSeleccionado(""); setAnioSeleccionado("") }}
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {/* ── Lista scrolleable ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(104,211,145,0.4) transparent',
                }}>
                    {pagosFiltrados.length === 0 ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 0',
                            gap: '8px',
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>📭</span>
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.82rem',
                                color: 'rgba(255,255,255,0.3)',
                                textAlign: 'center',
                            }}>
                                No hay pagos para el filtro seleccionado
                            </span>
                        </div>
                    ) : (
                        pagosFiltrados.map((pago, i) => {
                            const mesPago = new Date(pago.fecha).getMonth()
                            return (
                                <div
                                    key={i}
                                    className="hp-pago-card"
                                    style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(104,211,145,0.15)',
                                        borderRadius: '12px',
                                        padding: '14px 16px',
                                        animationDelay: `${i * 0.05}s`,
                                    }}
                                >
                                    {/* Mes + monto */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '10px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{
                                                width: '6px', height: '6px',
                                                borderRadius: '50%',
                                                background: '#68D391',
                                                flexShrink: 0,
                                            }} />
                                            <span style={{
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: 'white',
                                            }}>
                                                {meses[mesPago]}
                                            </span>
                                        </div>
                                        <span style={{
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: '0.95rem',
                                            fontWeight: 700,
                                            color: '#68D391',
                                        }}>
                                            ${pago.monto?.toLocaleString('es-ES')}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div style={{
                                        height: '1px',
                                        background: 'rgba(255,255,255,0.05)',
                                        marginBottom: '10px',
                                    }} />

                                    {/* Detalles */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {[
                                            { label: 'Fecha', value: formatFecha(pago.fecha) },
                                            { label: 'Días', value: `${userData.diasentrenamiento} días` },
                                            { label: 'Método', value: pago.metodo },
                                        ].map(({ label, value }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: '0.68rem',
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    color: 'rgba(255,255,255,0.3)',
                                                }}>
                                                    {label}
                                                </span>
                                                <span style={{
                                                    fontFamily: "'Poppins', sans-serif",
                                                    fontSize: '0.82rem',
                                                    fontWeight: 500,
                                                    color: 'rgba(255,255,255,0.75)',
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}

// ─── Componente principal ─────────────────────────────────────────────────────
const HistorialPagosUs = ({ userData, theme }) => {
    const [isOpen, setIsOpen] = useState(false)

    if (!userData) {
        return (
            <Flex w="100%" h="30vh" align="center" justify="center" flexDir="column" gap="12px">
                <Text fontFamily='"Poppins", sans-serif' fontSize="0.85rem" color="gray.400">Cargando...</Text>
                <Spinner size="lg" color="green.400" thickness="3px" />
            </Flex>
        )
    }

    return (
        <>
            <style>{historialPagosStyles}</style>
            <button className="hp-open-btn" onClick={() => setIsOpen(true)}>
                Ver historial de pagos
            </button>
            {isOpen && (
                <HistorialModal
                    userData={userData}
                    onClose={() => setIsOpen(false)}
                    theme={theme}
                />
            )}
        </>
    )
}

export default HistorialPagosUs