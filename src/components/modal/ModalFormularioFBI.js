import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfgjFCA-opZ7jM6eW7fdCXVSzsBrPqBtMt_QY7slVJ7OXjJCA/viewform';

const styles = `
    @keyframes fbiBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes fbiPanelIn {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes fbiPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fbiPulse {
        0%   { box-shadow: 0 0 0 0 rgba(104,211,145,0.5); }
        70%  { box-shadow: 0 0 0 7px rgba(104,211,145,0); }
        100% { box-shadow: 0 0 0 0 rgba(104,211,145,0); }
    }

    .fbi-btn-completar {
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
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    .fbi-btn-completar:hover {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }

    .fbi-btn-confirmar {
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
    .fbi-btn-confirmar:hover:not(:disabled) {
        border-color: rgba(104,211,145,0.4);
        color: rgba(104,211,145,0.85);
    }
    .fbi-btn-confirmar:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
`;

const ModalFormularioFBI = ({ isOpen, onConfirm }) => {
    const [hasOpenedForm, setHasOpenedForm] = useState(false);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 600;

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAbrirFormulario = () => {
        window.open(FORM_URL, '_blank', 'noopener,noreferrer');
        setHasOpenedForm(true);
    };

    const content = (
        <>
            <style>{styles}</style>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 100001,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(6px)',
                    WebkitBackdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: isMobile ? 'flex-end' : 'center',
                    justifyContent: 'center',
                    padding: isMobile ? 0 : '16px',
                    animation: 'fbiBackdropIn 0.3s ease both',
                    boxSizing: 'border-box',
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '460px',
                        background: '#111827',
                        borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                        border: '1px solid rgba(104,211,145,0.25)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(104,211,145,0.08)',
                        overflow: 'hidden',
                        animation: isMobile
                            ? 'fbiPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both'
                            : 'fbiPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                    }}
                >
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

                    {/* Barra superior verde */}
                    <div style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, #68D391, #4FBF72)',
                        width: '100%',
                        flexShrink: 0,
                    }} />

                    {/* Contenido */}
                    <div style={{ padding: isMobile ? '32px 20px 28px' : '28px 28px 24px' }}>

                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            marginBottom: '20px',
                            gap: '12px',
                        }}>
                            <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '12px',
                                background: 'rgba(104,211,145,0.1)',
                                border: '1px solid rgba(104,211,145,0.22)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.15rem',
                                flexShrink: 0,
                            }}>
                                📋
                            </div>
                            <div>
                                <span style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.2em',
                                    textTransform: 'uppercase',
                                    color: '#68D391',
                                    fontWeight: 600,
                                    display: 'block',
                                    marginBottom: '3px',
                                }}>
                                    Alumn@s FBI
                                </span>
                                <h2 style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.15rem',
                                    fontWeight: 900,
                                    color: 'white',
                                    margin: 0,
                                    lineHeight: 1.2,
                                }}>
                                    Formulario de conocimiento
                                </h2>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: 'rgba(104,211,145,0.1)',
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
                            En Fuerza Base Integral entrenar bien es entrenar con propósito y con un plan a tu medida.
                            Queremos conocerte mejor.
                            <br /><br />
                            Completá este breve formulario para que podamos personalizar tu planificación y seguir
                            mejorando el servicio de FBI. No te lleva más de 3 minutos.
                            <br /><br />
                            ¡Gracias por ser parte de FBI! 💪
                        </p>

                        {/* Info box */}
                        <div style={{
                            background: 'rgba(104,211,145,0.06)',
                            border: '1px solid rgba(104,211,145,0.18)',
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
                                background: '#68D391',
                                animation: 'fbiPulse 2s infinite',
                                flexShrink: 0,
                            }} />
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.77rem',
                                color: 'rgba(104,211,145,0.85)',
                                fontWeight: 500,
                                lineHeight: 1.5,
                            }}>
                                Solo lleva 3 minutos completarlo
                            </span>
                        </div>

                        {/* Botones */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="fbi-btn-completar" onClick={handleAbrirFormulario}>
                                📝 Completar formulario
                            </button>
                            <button
                                className="fbi-btn-confirmar"
                                onClick={onConfirm}
                                disabled={!hasOpenedForm}
                                title={!hasOpenedForm ? 'Primero abrí el formulario' : ''}
                            >
                                Ya completé el formulario
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export default ModalFormularioFBI;
