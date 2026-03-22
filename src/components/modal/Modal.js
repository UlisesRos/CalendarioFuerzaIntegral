import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import axios from "axios"

// ─── Estilos ──────────────────────────────────────────────────────────────────
const modalStyles = `
    @keyframes toastSlideIn {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes toastSlideOut {
        from { opacity: 1; transform: translateY(0); }
        to   { opacity: 0; transform: translateY(20px); }
    }
    @keyframes progressBar {
        from { width: 100%; }
        to   { width: 0%; }
    }

    .nov-toast {
        animation: toastSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
    }
    .nov-toast.hiding {
        animation: toastSlideOut 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    .nov-toast-progress {
        animation: progressBar 6s linear forwards;
    }
    .nov-close-btn {
        background: rgba(255,255,255,0.1);
        border: none;
        cursor: pointer;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.7);
        font-size: 0.75rem;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    .nov-close-btn:hover {
        background: rgba(255,255,255,0.2);
        color: white;
    }
`

const DURATION = 6000  // ms que dura visible

function Modal({ apiUrl }) {
    const [visible, setVisible] = useState(false)
    const [hiding, setHiding] = useState(false)
    const [modalContent, setModalContent] = useState({
        title: '', subtitle: '', link: '', image: '', description: ''
    })

    useEffect(() => {
        const fetchModalContent = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/get-modal-content`)
                const data = response.data
                setModalContent(data)
                // Solo mostrar si hay título
                if (data.title && data.title.trim() !== '') {
                    setVisible(true)
                }
            } catch (error) {
                console.error('Error al cargar el contenido del modal', error)
            }
        }
        fetchModalContent()
    }, [])

    // Auto-cerrar después de DURATION ms
    useEffect(() => {
        if (!visible) return
        const timer = setTimeout(() => handleClose(), DURATION)
        return () => clearTimeout(timer)
    }, [visible])

    const handleClose = () => {
        setHiding(true)
        setTimeout(() => {
            setVisible(false)
            setHiding(false)
        }, 400)
    }

    if (!visible && !hiding) return null

    const toastContent = (
        <>
            <style>{modalStyles}</style>
            <div
                className={`nov-toast${hiding ? ' hiding' : ''}`}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 99999,
                    width: '100%',
                    maxWidth: '340px',
                    background: '#111827',
                    borderRadius: '14px',
                    border: '1px solid rgba(104,211,145,0.3)',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(104,211,145,0.1)',
                }}
            >
                {/* Barra de progreso */}
                <div style={{
                    height: '2px',
                    background: 'rgba(104,211,145,0.15)',
                    width: '100%',
                }}>
                    <div
                        className="nov-toast-progress"
                        style={{
                            height: '100%',
                            background: '#68D391',
                            borderRadius: '9999px',
                        }}
                    />
                </div>

                {/* Contenido */}
                <div style={{ padding: '16px 18px' }}>
                    {/* Label + cerrar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {/* Punto parpadeante */}
                            <div style={{
                                width: '7px', height: '7px',
                                borderRadius: '50%',
                                background: '#68D391',
                                boxShadow: '0 0 0 0 rgba(104,211,145,0.4)',
                                animation: 'pulse 2s infinite',
                                flexShrink: 0,
                            }} />
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.62rem',
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#68D391',
                                fontWeight: 600,
                            }}>
                                Novedad
                            </span>
                        </div>
                        <button className="nov-close-btn" onClick={handleClose}>✕</button>
                    </div>

                    {/* Línea divisora */}
                    <div style={{
                        height: '1px',
                        background: 'rgba(104,211,145,0.15)',
                        marginBottom: '12px',
                    }} />

                    {/* Título */}
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        color: 'white',
                        lineHeight: 1.25,
                        margin: '0 0 6px',
                    }}>
                        {modalContent.title}
                    </p>

                    {/* Descripción */}
                    {modalContent.description && (
                        <p style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.8rem',
                            color: 'rgba(255,255,255,0.55)',
                            lineHeight: 1.65,
                            margin: 0,
                        }}>
                            {modalContent.description}
                        </p>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes pulse {
                    0%   { box-shadow: 0 0 0 0 rgba(104,211,145,0.5); }
                    70%  { box-shadow: 0 0 0 6px rgba(104,211,145,0); }
                    100% { box-shadow: 0 0 0 0 rgba(104,211,145,0); }
                }
            `}</style>
        </>
    )

    return createPortal(toastContent, document.body)
}

export default Modal