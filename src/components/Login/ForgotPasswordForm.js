// ─── ForgotPasswordForm.jsx ───────────────────────────────────────────────────
import React, { useState } from 'react';
import { useToast, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { authStyles, AuthField } from './authShared'

const ForgotPasswordForm = ({ theme, apiUrl }) => {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const toast = useToast()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/auth/forgot-password`, { useremail: email })
            toast({ title: 'Éxito', description: response.data.msg, status: 'success', duration: 5000, isClosable: true })
            setSent(true)
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response?.data?.msg || 'Error al conectar con el servidor',
                status: 'error', duration: 5000, isClosable: true
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            padding: '32px 16px 52px',
            boxSizing: 'border-box',
        }}>
            <style>{authStyles}</style>

            {/* ── Header ── */}
            <div className="auth-header" style={{ width: '100%', maxWidth: '440px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '24px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                    <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.7rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: '#A0AEC0',
                    }}>
                        Recuperar acceso
                    </span>
                </div>
                <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: isDark ? 'white' : '#1A202C',
                    lineHeight: 1.1,
                    margin: 0,
                }}>
                    ¿Olvidaste tu contraseña?
                </h1>
                <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    color: textMuted,
                    marginTop: '8px',
                    lineHeight: 1.6,
                }}>
                    Ingresá tu email y te enviamos un enlace para restablecer tu contraseña.
                </p>
            </div>

            {/* ── Panel ── */}
            {sent ? (
                /* Estado: email enviado */
                <div
                    className="auth-panel"
                    style={{
                        width: '100%',
                        maxWidth: '440px',
                        background: 'rgba(104,211,145,0.07)',
                        border: '1px solid rgba(104,211,145,0.3)',
                        borderRadius: '20px',
                        padding: 'clamp(20px, 5vw, 36px)',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                    }}
                >
                    <div style={{
                        width: '48px', height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(104,211,145,0.15)',
                        border: '1px solid rgba(104,211,145,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '1.4rem',
                    }}>
                        ✉️
                    </div>
                    <p style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: isDark ? 'white' : '#1A202C',
                        margin: '0 0 8px',
                    }}>
                        Revisá tu email
                    </p>
                    <p style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.82rem',
                        color: textMuted,
                        margin: '0 0 20px',
                        lineHeight: 1.6,
                    }}>
                        Te enviamos un enlace a <strong style={{ color: '#68D391' }}>{email}</strong>
                    </p>
                    <Link to="/login" className="auth-forgot-link" style={{ color: '#68D391' }}>
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            ) : (
                <form
                    className="auth-panel"
                    onSubmit={handleSubmit}
                    style={{
                        width: '100%',
                        maxWidth: '440px',
                        background: panelBg,
                        border: `1px solid ${borderC}`,
                        borderRadius: '20px',
                        padding: 'clamp(20px, 5vw, 36px)',
                        boxSizing: 'border-box',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <AuthField label="Email" required>
                            <input
                                className="auth-input no-icon"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@email.com" required
                                style={{ background: inputBg, color: inputColor }}
                            />
                        </AuthField>

                        <div style={{ height: '1px', background: borderC, margin: '4px 0' }} />

                        <button className="auth-submit-btn" type="submit" disabled={isLoading}>
                            {isLoading
                                ? <><Spinner size="sm" color="gray.800" thickness="2px" /> Enviando...</>
                                : 'Enviar enlace'
                            }
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <Link to="/login" className="auth-forgot-link">
                                ← Volver al inicio de sesión
                            </Link>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default ForgotPasswordForm