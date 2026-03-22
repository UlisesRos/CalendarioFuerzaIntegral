// ─── ModalIngresos.jsx ────────────────────────────────────────────────────────
import { createPortal } from "react-dom"
import { useEffect } from "react"

const modalIngresosStyles = `
    @keyframes miBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes miPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes miPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes miCardIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .mi-close-btn {
        background: rgba(255,255,255,0.08);
        border: none;
        cursor: pointer;
        width: 30px; height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.6);
        font-size: 0.82rem;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    .mi-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .mi-stat-card {
        animation: miCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        border-radius: 14px;
        padding: 18px 20px;
        flex: 1;
    }
    .mi-stat-card:nth-child(1) { animation-delay: 0.08s; }
    .mi-stat-card:nth-child(2) { animation-delay: 0.14s; }
`

const ModalIngresos = ({ isOpen, onClose, totalPagados, totalNoPagados }) => {
    const isMobile = window.innerWidth < 600

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

    const totalGeneral = totalPagados + totalNoPagados
    const porcentajePagado = totalGeneral > 0
        ? Math.round((totalPagados / totalGeneral) * 100)
        : 0

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
                animation: 'miBackdropIn 0.3s ease both',
            }}
        >
            <style>{modalIngresosStyles}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    width: '100%', maxWidth: '420px',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    overflow: 'hidden',
                    animation: isMobile
                        ? 'miPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                        : 'miPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
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

                {/* Header */}
                <div style={{
                    padding: isMobile ? '28px 20px 18px' : '24px 28px 18px',
                    borderBottom: '1px solid rgba(104,211,145,0.12)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#68D391' }}>
                                Resumen del mes
                            </span>
                        </div>
                        <button className="mi-close-btn" onClick={onClose}>✕</button>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.1 }}>
                        Ingresos Mensuales
                    </h2>
                </div>

                {/* Stats */}
                <div style={{ padding: isMobile ? '20px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

                    {/* Cards ingresado / no ingresado */}
                    <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                        <div className="mi-stat-card" style={{ background: 'rgba(104,211,145,0.07)', border: '1px solid rgba(104,211,145,0.25)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#68D391' }} />
                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                                    Ingresado
                                </span>
                            </div>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 900, color: '#68D391', lineHeight: 1 }}>
                                $ {totalPagados.toLocaleString('es-ES')}
                            </span>
                        </div>

                        <div className="mi-stat-card" style={{ background: 'rgba(252,129,129,0.06)', border: '1px solid rgba(252,129,129,0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC8181' }} />
                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                                    Pendiente
                                </span>
                            </div>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 900, color: '#FC8181', lineHeight: 1 }}>
                                $ {totalNoPagados.toLocaleString('es-ES')}
                            </span>
                        </div>
                    </div>

                    {/* Barra de progreso */}
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${porcentajePagado}%`,
                            background: 'linear-gradient(90deg, #68D391, #4FBF72)',
                            borderRadius: '9999px',
                            transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1)',
                        }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '-8px' }}>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.68rem', color: '#68D391' }}>
                            {porcentajePagado}% cobrado
                        </span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
                            Total: $ {totalGeneral.toLocaleString('es-ES')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

    return createPortal(content, document.body)
}

export default ModalIngresos