import { createPortal } from "react-dom"
import { useEffect } from "react"
import { Text } from "@chakra-ui/react"
import HistorialPagos from "./HistorialPagos"

// ─── Estilos ──────────────────────────────────────────────────────────────────
const clienteModalStyles = `
    @keyframes cmBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes cmPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes cmPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes cmFieldIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .cm-close-btn {
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
    .cm-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .cm-field {
        animation: cmFieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 11px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .cm-field:last-of-type { border-bottom: none; }

    .cm-field:nth-child(1) { animation-delay: 0.05s; }
    .cm-field:nth-child(2) { animation-delay: 0.08s; }
    .cm-field:nth-child(3) { animation-delay: 0.11s; }
    .cm-field:nth-child(4) { animation-delay: 0.14s; }
    .cm-field:nth-child(5) { animation-delay: 0.17s; }
    .cm-field:nth-child(6) { animation-delay: 0.20s; }
`

// ─── InfoRow ──────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, accent }) {
    return (
        <div className="cm-field">
            <div style={{
                width: '34px', height: '34px',
                borderRadius: '9px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    display: 'block',
                    marginBottom: '2px',
                }}>
                    {label}
                </span>
                <span style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: accent || 'rgba(255,255,255,0.85)',
                    display: 'block',
                    wordBreak: 'break-word',
                    textTransform: label === 'Nombre' ? 'capitalize' : 'none',
                }}>
                    {value}
                </span>
            </div>
        </div>
    )
}

// ─── ClienteModal ─────────────────────────────────────────────────────────────
const ClienteModal = ({ isOpen, onClose, clienteSeleccionado, theme }) => {
    const isMobile = window.innerWidth < 600

    const formatFecha = (fechaISO) => {
        const fecha = new Date(fechaISO)
        return `${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${fecha.getFullYear()}`
    }

    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen || !clienteSeleccionado) return null

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
                animation: 'cmBackdropIn 0.3s ease both',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '480px',
                    maxHeight: isMobile ? '92vh' : '84vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: isMobile
                        ? 'cmPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                        : 'cmPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                {/* Handle mobile */}
                {isMobile && (
                    <div style={{
                        position: 'absolute',
                        top: '10px', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '36px', height: '4px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '9999px',
                        zIndex: 20,
                    }} />
                )}

                {/* ── Header ── */}
                <div style={{
                    padding: isMobile ? '28px 20px 18px' : '24px 28px 18px',
                    borderBottom: '1px solid rgba(104,211,145,0.12)',
                    flexShrink: 0,
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '20px', height: '2px',
                                background: '#68D391',
                                borderRadius: '9999px',
                            }} />
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.65rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#68D391',
                            }}>
                                Perfil del cliente
                            </span>
                        </div>
                        <button className="cm-close-btn" onClick={onClose}>✕</button>
                    </div>

                    {/* Nombre grande */}
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: 'white',
                        margin: '0 0 6px',
                        lineHeight: 1.1,
                        textTransform: 'capitalize',
                    }}>
                        {clienteSeleccionado.username} {clienteSeleccionado.userlastname}
                    </h2>

                    {/* Badge pago */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: clienteSeleccionado.pago
                            ? 'rgba(104,211,145,0.1)'
                            : 'rgba(252,129,129,0.08)',
                        border: `1px solid ${clienteSeleccionado.pago
                            ? 'rgba(104,211,145,0.3)'
                            : 'rgba(252,129,129,0.25)'}`,
                    }}>
                        <div style={{
                            width: '6px', height: '6px',
                            borderRadius: '50%',
                            background: clienteSeleccionado.pago ? '#68D391' : '#FC8181',
                        }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: clienteSeleccionado.pago ? '#68D391' : '#FC8181',
                        }}>
                            {clienteSeleccionado.pago ? 'Al día' : 'Pendiente de pago'}
                        </span>
                    </div>
                </div>

                {/* ── Body scrolleable ── */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: isMobile ? '16px 20px' : '16px 28px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(104,211,145,0.4) transparent',
                }}>
                    <style>{clienteModalStyles}</style>

                    {/* Datos personales */}
                    <div style={{ marginBottom: '20px' }}>
                        <InfoRow icon="📱" label="Teléfono" value={clienteSeleccionado.usertelefono} />
                        <InfoRow icon="📧" label="Email" value={clienteSeleccionado.useremail} />
                        <InfoRow icon="🪪" label="Documento" value={clienteSeleccionado.documento} />
                        <InfoRow icon="📅" label="Fecha de ingreso" value={formatFecha(clienteSeleccionado.created_at)} />
                        <InfoRow icon="💪" label="Días de entrenamiento" value={`${clienteSeleccionado.diasentrenamiento} días por semana`} />
                        {clienteSeleccionado.descuento && (
                            <InfoRow
                                icon="✨"
                                label="Descuento"
                                value={`10% — ${clienteSeleccionado.descuento}`}
                                accent="#68D391"
                            />
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        background: 'rgba(104,211,145,0.1)',
                        marginBottom: '20px',
                    }} />

                    {/* Historial de pagos */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '14px',
                    }}>
                        <div style={{
                            width: '16px', height: '2px',
                            background: '#68D391',
                            borderRadius: '9999px',
                        }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.65rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                        }}>
                            Historial de pagos
                        </span>
                    </div>

                    <HistorialPagos
                        clienteSeleccionado={clienteSeleccionado}
                        theme={theme}
                    />
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}

export default ClienteModal