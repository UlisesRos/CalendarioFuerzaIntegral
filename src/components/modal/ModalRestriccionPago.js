import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = `
    @keyframes rpBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes rpPanelIn {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes rpPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rpPulse {
        0%   { box-shadow: 0 0 0 0 rgba(252,129,129,0.5); }
        70%  { box-shadow: 0 0 0 7px rgba(252,129,129,0); }
        100% { box-shadow: 0 0 0 0 rgba(252,129,129,0); }
    }

    .rp-close-btn {
        background: rgba(255,255,255,0.07);
        border: none;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.5);
        font-size: 0.82rem;
        transition: background 0.2s ease, color 0.2s ease;
        flex-shrink: 0;
    }
    .rp-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .rp-btn-pagar {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 13px 28px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .rp-btn-pagar:hover {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }

    .rp-btn-cerrar {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 10px;
        padding: 11px 28px;
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.4);
        background: transparent;
        transition: all 0.25s ease;
        width: 100%;
    }
    .rp-btn-cerrar:hover {
        border-color: rgba(255,255,255,0.22);
        color: rgba(255,255,255,0.7);
    }
`;

const ModalRestriccionPago = ({ isOpen, onClose, variant = 'login' }) => {
    const navigate = useNavigate();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isCalendar = variant === 'calendar';

    const title = isCalendar
        ? 'Acceso restringido'
        : 'Cuota pendiente de pago';

    const description = isCalendar
        ? 'Para inscribirte en cualquier horario del calendario debés abonar la cuota del mes. Mientras tu pago esté pendiente, no podés reservar ningún turno.'
        : 'Todavía no abonaste la cuota de este mes. A partir del día 12 no podés inscribirte en ningún horario del calendario semanal.';

    const handlePagar = () => {
        onClose();
        navigate('/pagos');
    };

    const content = (
        <>
            <style>{styles}</style>
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: 'rgba(0,0,0,0.78)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: isMobile ? 'flex-end' : 'center',
                    justifyContent: 'center',
                    padding: isMobile ? 0 : '16px',
                    animation: 'rpBackdropIn 0.3s ease both',
                    boxSizing: 'border-box',
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '440px',
                        background: '#111827',
                        borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                        border: '1px solid rgba(252,129,129,0.25)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(252,129,129,0.08)',
                        overflow: 'hidden',
                        animation: isMobile
                            ? 'rpPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                            : 'rpPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                    }}
                >
                    {/* Handle mobile */}
                    {isMobile && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '36px',
                            height: '4px',
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: '9999px',
                            zIndex: 20,
                        }} />
                    )}

                    {/* Barra superior roja */}
                    <div style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, #FC8181, #F56565)',
                        width: '100%',
                        flexShrink: 0,
                    }} />

                    {/* Contenido */}
                    <div style={{ padding: isMobile ? '32px 20px 28px' : '28px 28px 24px' }}>

                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            gap: '12px',
                        }}>
                            {/* Icono + etiqueta + título */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: 'rgba(252,129,129,0.1)',
                                    border: '1px solid rgba(252,129,129,0.22)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.15rem',
                                    flexShrink: 0,
                                }}>
                                    🔒
                                </div>
                                <div>
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: '#FC8181',
                                        fontWeight: 600,
                                        display: 'block',
                                        marginBottom: '3px',
                                    }}>
                                        Restricción activa
                                    </span>
                                    <h2 style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.15rem',
                                        fontWeight: 900,
                                        color: 'white',
                                        margin: 0,
                                        lineHeight: 1.2,
                                    }}>
                                        {title}
                                    </h2>
                                </div>
                            </div>
                            <button className="rp-close-btn" onClick={onClose}>✕</button>
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: 'rgba(252,129,129,0.1)',
                            marginBottom: '18px',
                        }} />

                        {/* Descripción */}
                        <p style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.84rem',
                            color: 'rgba(255,255,255,0.55)',
                            lineHeight: 1.75,
                            margin: '0 0 20px',
                        }}>
                            {description}
                        </p>

                        {/* Info box */}
                        <div style={{
                            background: 'rgba(252,129,129,0.06)',
                            border: '1px solid rgba(252,129,129,0.18)',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <div style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: '#FC8181',
                                animation: 'rpPulse 2s infinite',
                                flexShrink: 0,
                            }} />
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.77rem',
                                color: 'rgba(252,129,129,0.85)',
                                fontWeight: 500,
                                lineHeight: 1.5,
                            }}>
                                La restricción aplica a partir del día 12 de cada mes
                            </span>
                        </div>

                        {/* Botones */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="rp-btn-pagar" onClick={handlePagar}>
                                Abonar cuota
                            </button>
                            <button className="rp-btn-cerrar" onClick={onClose}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export default ModalRestriccionPago;
