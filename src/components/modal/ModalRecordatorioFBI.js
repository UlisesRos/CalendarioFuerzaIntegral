import { createPortal } from 'react-dom';

const styles = `
    @keyframes reminderSlideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    .fbi-rem-btn-completar {
        font-family: 'Poppins', sans-serif;
        font-size: 0.76rem;
        font-weight: 700;
        letter-spacing: 0.07em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 8px;
        padding: 10px 18px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.25s ease;
        white-space: nowrap;
    }
    .fbi-rem-btn-completar:hover {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(104,211,145,0.3);
    }

    .fbi-rem-btn-dismiss {
        font-family: 'Poppins', sans-serif;
        font-size: 0.73rem;
        font-weight: 500;
        cursor: pointer;
        border-radius: 8px;
        padding: 10px 16px;
        border: 1px solid rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.45);
        background: transparent;
        transition: all 0.25s ease;
        white-space: nowrap;
    }
    .fbi-rem-btn-dismiss:hover {
        border-color: rgba(255,255,255,0.28);
        color: rgba(255,255,255,0.72);
    }
`;

const ModalRecordatorioFBI = ({ isOpen, onDismiss, formUrl }) => {
    if (!isOpen) return null;

    const handleAbrirFormulario = () => {
        window.open(formUrl, '_blank', 'noopener,noreferrer');
    };

    const content = (
        <>
            <style>{styles}</style>
            <div
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 99000,
                    width: 'calc(100% - 32px)',
                    maxWidth: '580px',
                    background: '#111827',
                    border: '1px solid rgba(104,211,145,0.28)',
                    borderRadius: '16px',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(104,211,145,0.06)',
                    overflow: 'hidden',
                    animation: 'reminderSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                {/* Barra superior */}
                <div style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, #68D391, #4FBF72)',
                    width: '100%',
                }} />

                <div style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    flexWrap: 'wrap',
                }}>
                    <span style={{ fontSize: '1.15rem', flexShrink: 0 }}>📋</span>

                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.73rem',
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.72)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        lineHeight: 1.55,
                        margin: 0,
                        flex: 1,
                        minWidth: '160px',
                    }}>
                        Si todavía no llenaste el formulario, por favor hacelo que a nosotros nos sirve mucho para seguir mejorando
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexShrink: 0,
                        flexWrap: 'wrap',
                    }}>
                        <button className="fbi-rem-btn-completar" onClick={handleAbrirFormulario}>
                            📝 Completar formulario
                        </button>
                        <button className="fbi-rem-btn-dismiss" onClick={onDismiss}>
                            Ya completé el formulario
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export default ModalRecordatorioFBI;
