// ─── ProtectedRegisterButton.jsx ─────────────────────────────────────────────
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const protectedStyles = `
    @keyframes prBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes prPanelIn {
        from { opacity: 0; transform: translateY(20px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .pr-input {
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        border-radius: 10px;
        padding: 10px 42px 10px 14px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .pr-input:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }
    .pr-input::placeholder { color: rgba(160,174,192,0.6); }

    .pr-verify-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 11px 24px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        flex: 1;
    }
    .pr-verify-btn:hover {
        background: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }
    .pr-cancel-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 11px 20px;
        border: 1px solid rgba(160,174,192,0.3);
        color: rgba(160,174,192,0.8);
        background: transparent;
        transition: all 0.25s ease;
    }
    .pr-cancel-btn:hover {
        border-color: rgba(160,174,192,0.5);
        transform: translateY(-1px);
    }

    .pr-open-btn {
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
        white-space: nowrap;
        width: 100%;
    }
    .pr-open-btn:hover {
        background: rgba(104,211,145,0.15);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    }

    .pr-toggle-btn {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: rgba(160,174,192,0.7);
        font-size: 0.9rem;
        padding: 4px;
        transition: color 0.2s ease;
        display: flex;
        align-items: center;
    }
    .pr-toggle-btn:hover { color: #68D391; }
`

const ProtectedRegisterButton = ({ theme, onClose1 }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [code, setCode] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const isDark = theme === 'dark'

    const correctCode = process.env.REACT_APP_PROTECTED_CODE
    const accessDuration = 1000 * 60 * 15

    const handleVerifyCode = () => {
        if (code === correctCode) {
            localStorage.setItem("accessGranted", "true")
            setTimeout(() => localStorage.removeItem("accessGranted"), accessDuration)
            setError("")
            setIsOpen(false)
            onClose1()
            navigate("/registro")
        } else {
            setError("Código incorrecto. Intentalo nuevamente.")
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleVerifyCode()
    }

    const handleClose = () => {
        setIsOpen(false)
        setCode("")
        setError("")
    }

    const modalContent = isOpen ? (
        <div
            onClick={handleClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                animation: 'prBackdropIn 0.3s ease both',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: isDark ? '#111827' : 'white',
                    borderRadius: '20px',
                    border: `1px solid ${isDark ? 'rgba(104,211,145,0.2)' : 'rgba(104,211,145,0.25)'}`,
                    padding: '28px',
                    width: '100%',
                    maxWidth: '380px',
                    animation: 'prPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                    position: 'relative',
                }}
            >
                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '14px', right: '14px',
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        border: 'none',
                        cursor: 'pointer',
                        color: isDark ? 'rgba(255,255,255,0.5)' : '#A0AEC0',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                >
                    ✕
                </button>

                {/* Header */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <div style={{ width: '20px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.65rem',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#68D391',
                        }}>
                            Acceso restringido
                        </span>
                    </div>
                    <h2 style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: isDark ? 'white' : '#1A202C',
                        margin: 0,
                        lineHeight: 1.2,
                    }}>
                        Código de registro
                    </h2>
                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.82rem',
                        color: isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0',
                        margin: '8px 0 0',
                        lineHeight: 1.6,
                    }}>
                        Ingresá el código para acceder al formulario de registro.
                    </p>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(104,211,145,0.15)',
                    marginBottom: '20px',
                }} />

                {/* Input */}
                <div style={{ position: 'relative', marginBottom: error ? '8px' : '20px' }}>
                    <input
                        className="pr-input"
                        type={showPassword ? "text" : "password"}
                        placeholder="Código de acceso"
                        value={code}
                        onChange={(e) => { setCode(e.target.value); setError("") }}
                        onKeyDown={handleKeyPress}
                        autoFocus
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.04)' : 'white',
                            color: isDark ? 'rgba(255,255,255,0.9)' : '#2D3748',
                        }}
                    />
                    <button
                        className="pr-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? '🙈' : '👁'}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '16px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(252,129,129,0.08)',
                        border: '1px solid rgba(252,129,129,0.25)',
                    }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FC8181', flexShrink: 0 }} />
                        <span style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: '0.78rem',
                            color: '#FC8181',
                        }}>
                            {error}
                        </span>
                    </div>
                )}

                {/* Botones */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="pr-verify-btn" onClick={handleVerifyCode}>
                        Verificar
                    </button>
                    <button className="pr-cancel-btn" onClick={handleClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    ) : null

    return (
        <>
            <style>{protectedStyles}</style>
            <button className="pr-open-btn" onClick={() => setIsOpen(true)}>
                Registrarme
            </button>
            {createPortal(modalContent, document.body)}
        </>
    )
}

export default ProtectedRegisterButton