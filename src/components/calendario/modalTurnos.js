import { createPortal } from "react-dom"
import { useEffect } from "react"

const modalTurnosStyles = `
    @keyframes mtBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes mtPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes mtPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes mtCardIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .mt-close-btn {
        background: rgba(255,255,255,0.08);
        border: none;
        cursor: pointer;
        width: 30px; height: 30px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.6);
        font-size: 0.82rem;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    .mt-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .mt-schedule-card {
        animation: mtCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .mt-schedule-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    }
`

const TURNO_LABELS = {
    'mañana': '🌅 Mañana',
    'tarde': '🌆 Tarde',
}

const ModalTurnos = ({ isOpen, onClose, getUserSchedule }) => {
    const isMobile = window.innerWidth < 600
    const schedule = getUserSchedule()

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

    if (!isOpen) return null

    const content = (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: isMobile ? 'flex-end' : 'center',
                justifyContent: 'center',
                padding: isMobile ? 0 : '16px',
                animation: 'mtBackdropIn 0.3s ease both',
            }}
        >
            <style>{modalTurnosStyles}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%', maxWidth: '440px',
                    maxHeight: isMobile ? '88vh' : '78vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    animation: isMobile
                        ? 'mtPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                        : 'mtPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
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
                                fontSize: '0.65rem', letterSpacing: '0.2em',
                                textTransform: 'uppercase', color: '#68D391',
                            }}>
                                Mi calendario
                            </span>
                        </div>
                        <button className="mt-close-btn" onClick={onClose}>✕</button>
                    </div>

                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem', fontWeight: 900,
                        color: 'white', margin: '0 0 4px', lineHeight: 1.1,
                    }}>
                        Turnos inscriptos
                    </h2>
                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.35)',
                        margin: 0,
                    }}>
                        {schedule.length} {schedule.length === 1 ? 'turno registrado' : 'turnos registrados'}
                    </p>
                </div>

                {/* ── Lista scrolleable ── */}
                <div style={{
                    flex: 1, overflowY: 'auto',
                    padding: '16px 20px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(104,211,145,0.4) transparent',
                }}>
                    {schedule.length === 0 ? (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            padding: '40px 0', gap: '8px',
                        }}>
                            <span style={{ fontSize: '1.8rem' }}>📭</span>
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.82rem',
                                color: 'rgba(255,255,255,0.3)',
                                textAlign: 'center',
                            }}>
                                No tenés turnos registrados todavía
                            </span>
                        </div>
                    ) : (
                        schedule.map((item, i) => (
                            <div
                                key={i}
                                className="mt-schedule-card"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(104,211,145,0.15)',
                                    borderRadius: '12px',
                                    padding: '14px 16px',
                                    animationDelay: `${i * 0.06}s`,
                                }}
                            >
                                {/* Día + hora */}
                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '6px', height: '6px',
                                            borderRadius: '50%', background: '#68D391', flexShrink: 0,
                                        }} />
                                        <span style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1rem', fontWeight: 700,
                                            color: 'white', textTransform: 'capitalize',
                                        }}>
                                            {item.day}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '1rem', fontWeight: 700, color: '#68D391',
                                    }}>
                                        {item.hour}:00 hs
                                    </span>
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px' }} />

                                {/* Turno */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.65rem', letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: 'rgba(255,255,255,0.3)',
                                    }}>
                                        Turno
                                    </span>
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.82rem', fontWeight: 500,
                                        color: 'rgba(255,255,255,0.7)',
                                    }}>
                                        {TURNO_LABELS[item.shift] || item.shift}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}

export default ModalTurnos