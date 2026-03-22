// ─── Login.jsx ────────────────────────────────────────────────────────────────
import { useToast, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authStyles, AuthField } from './authShared'


function Login({ theme, apiUrl }) {
    const [formData, setFormData] = useState({ useremail: '', userpassword: '' })
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, formData)
            if (response.status === 200) {
                localStorage.setItem('token', response.data.token)
                toast({ title: 'Inicio de sesión exitoso', status: 'success', duration: 5000, isClosable: true })
                navigate('/home')
                window.location.reload()
            }
        } catch (error) {
            toast({
                title: 'Error al iniciar sesión',
                description: error.response?.data?.msg || 'Error en el servidor.',
                status: 'error', duration: 5000, isClosable: true
            })
        } finally {
            setLoading(false)
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
                        Bienvenido de vuelta
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
                    Iniciar sesión
                </h1>
                <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    color: textMuted,
                    marginTop: '8px',
                    lineHeight: 1.6,
                }}>
                    Ingresá tus datos para acceder al sistema.
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

                    <AuthField label="Email" required>
                        <input
                            className="auth-input no-icon"
                            name="useremail" type="text"
                            value={formData.useremail}
                            onChange={handleChange}
                            placeholder="tu@email.com" required
                            style={{ background: inputBg, color: inputColor }}
                        />
                    </AuthField>

                    <AuthField label="Contraseña" required>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="auth-input"
                                name="userpassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.userpassword}
                                onChange={handleChange}
                                placeholder="Tu contraseña" required
                                style={{ background: inputBg, color: inputColor }}
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? '🙈' : '👁'}
                            </button>
                        </div>
                    </AuthField>

                    {/* ¿Olvidaste tu contraseña? */}
                    <div style={{ marginTop: '-4px' }}>
                        <Link to="/forgotpasswordform" className="auth-forgot-link">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        background: borderC,
                        margin: '4px 0',
                    }} />

                    <button
                        className="auth-submit-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? <><Spinner size="sm" color="gray.800" thickness="2px" /> Ingresando...</>
                            : 'Iniciar sesión'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login