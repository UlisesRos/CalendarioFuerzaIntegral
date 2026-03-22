// ─── ResetPasswordForm.jsx ────────────────────────────────────────────────────
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useToast, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { authStyles, AuthField } from './authShared'

const ResetPasswordForm = ({ theme, apiUrl }) => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'

    const passwordMatch = newPassword && confirmPassword && newPassword === confirmPassword
    const passwordMismatch = newPassword && confirmPassword && newPassword !== confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            toast({ title: 'Error', description: 'Las contraseñas no coinciden', status: 'error', duration: 5000, isClosable: true })
            return
        }
        setIsLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/auth/reset-password/${token}`, { newPassword })
            toast({ title: 'Éxito', description: response.data.msg, status: 'success', duration: 5000, isClosable: true })
            navigate('/login')
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
                        Nueva contraseña
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
                    Restablecer contraseña
                </h1>
                <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    color: textMuted,
                    marginTop: '8px',
                    lineHeight: 1.6,
                }}>
                    Elegí una contraseña nueva y segura para tu cuenta.
                </p>
            </div>

            {/* ── Panel ── */}
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

                    <AuthField label="Nueva contraseña" required>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="auth-input"
                                type={showNew ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mínimo 8 caracteres" required
                                style={{ background: inputBg, color: inputColor }}
                            />
                            <button type="button" className="auth-eye-btn" onClick={() => setShowNew(!showNew)} tabIndex={-1}>
                                {showNew ? '🙈' : '👁'}
                            </button>
                        </div>
                    </AuthField>

                    <AuthField label="Confirmá la contraseña" required>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="auth-input"
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repetí tu contraseña" required
                                style={{
                                    background: inputBg,
                                    color: inputColor,
                                    borderColor: passwordMismatch
                                        ? 'rgba(252,129,129,0.6)'
                                        : passwordMatch
                                            ? 'rgba(104,211,145,0.6)'
                                            : undefined,
                                }}
                            />
                            <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                                {showConfirm ? '🙈' : '👁'}
                            </button>
                        </div>
                        {/* Feedback coincidencia */}
                        {passwordMismatch && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FC8181', flexShrink: 0 }} />
                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.72rem', color: '#FC8181' }}>
                                    Las contraseñas no coinciden
                                </span>
                            </div>
                        )}
                        {passwordMatch && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#68D391', flexShrink: 0 }} />
                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.72rem', color: '#68D391' }}>
                                    Las contraseñas coinciden
                                </span>
                            </div>
                        )}
                    </AuthField>

                    <div style={{ height: '1px', background: borderC, margin: '4px 0' }} />

                    <button
                        className="auth-submit-btn"
                        type="submit"
                        disabled={isLoading || !!passwordMismatch}
                    >
                        {isLoading
                            ? <><Spinner size="sm" color="gray.800" thickness="2px" /> Restableciendo...</>
                            : 'Restablecer contraseña'
                        }
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login" className="auth-forgot-link">
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordForm