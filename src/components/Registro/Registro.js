// ─── Registro.jsx ─────────────────────────────────────────────────────────────
import { useToast, Spinner } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const registroStyles = `
    @keyframes fadeSlideUp {
        from { opacity: 0; transform: translateY(20px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fieldIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .reg-header { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .reg-panel  { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.08s both; }

    .reg-field {
        animation: fieldIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }
    .reg-field:nth-child(1)  { animation-delay: 0.05s; }
    .reg-field:nth-child(2)  { animation-delay: 0.08s; }
    .reg-field:nth-child(3)  { animation-delay: 0.11s; }
    .reg-field:nth-child(4)  { animation-delay: 0.14s; }
    .reg-field:nth-child(5)  { animation-delay: 0.17s; }
    .reg-field:nth-child(6)  { animation-delay: 0.20s; }
    .reg-field:nth-child(7)  { animation-delay: 0.23s; }
    .reg-field:nth-child(8)  { animation-delay: 0.26s; }
    .reg-field:nth-child(9)  { animation-delay: 0.29s; }

    .reg-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        display: block;
        margin-bottom: 6px;
    }

    .reg-input, .reg-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        border-radius: 10px;
        padding: 10px 14px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        appearance: none;
    }
    .reg-input:focus, .reg-select:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }
    .reg-input::placeholder { color: rgba(160,174,192,0.6); font-size: 0.82rem; }

    .reg-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2368D391' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 32px;
        cursor: pointer;
    }

    .reg-submit-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 12px;
        padding: 13px 32px;
        border: 1px solid #68D391;
        color: #1a202c;
        background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 8px;
    }
    .reg-submit-btn:hover:not(:disabled) {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 10px 28px rgba(104,211,145,0.4);
    }
    .reg-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .reg-divider-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
    }
`

// ─── Campo individual ─────────────────────────────────────────────────────────
function Field({ label, required, children }) {
    return (
        <div className="reg-field">
            <label className="reg-label">
                {label} {required && <span style={{ color: '#68D391' }}>*</span>}
            </label>
            {children}
        </div>
    )
}

function Registro({ theme, apiUrl }) {
    const [formData, setFormData] = useState({
        username: '', userlastname: '', useremail: '',
        userpassword: '', userpasswordc: '',
        diasentrenamiento: '', usertelefono: '',
        documento: '', descuento: ''
    })
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const isDark = theme === 'dark'
    const panelBg = isDark ? 'rgba(255,255,255,0.03)' : 'white'
    const borderC = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(104,211,145,0.2)'
    const textMuted = isDark ? 'rgba(255,255,255,0.4)' : '#A0AEC0'
    const textMain = isDark ? 'rgba(255,255,255,0.9)' : '#2D3748'
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'white'
    const inputColor = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'
    const labelColor = isDark ? 'rgba(255,255,255,0.45)' : '#A0AEC0'

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${apiUrl}/api/auth/register`, formData)
            if (response.status === 201) {
                toast({ title: 'Registro exitoso', description: 'Ahora podés iniciar sesión', status: 'success', duration: 5000, isClosable: true })
                navigate('/login')
            }
        } catch (error) {
            const msg = error.response?.data?.msg || error.request
                ? 'No se pudo conectar al servidor'
                : 'Hubo un problema con la solicitud.'
            toast({ title: 'Error al registrarse', description: error.response?.data?.msg || msg, status: 'error', duration: 5000, isClosable: true })
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
            <style>{registroStyles}</style>

            {/* ── Header ── */}
            <div className="reg-header" style={{ width: '100%', maxWidth: '520px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: '24px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                    <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: '0.7rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: '#A0AEC0',
                    }}>
                        Nuevo miembro
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
                    Crear cuenta
                </h1>
                <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: '0.85rem',
                    color: textMuted,
                    marginTop: '8px',
                    lineHeight: 1.6,
                }}>
                    Completá el formulario para registrarte en el sistema.
                </p>
            </div>

            {/* ── Formulario ── */}
            <form
                className="reg-panel"
                onSubmit={handleSubmit}
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    background: panelBg,
                    border: `1px solid ${borderC}`,
                    borderRadius: '20px',
                    padding: 'clamp(20px, 5vw, 36px)',
                    boxSizing: 'border-box',
                }}
            >
                {/* Label sección */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                    <div style={{ width: '20px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                    <span className="reg-divider-label" style={{ color: textMuted }}>
                        Datos personales
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Field label="Nombre" required>
                        <input className="reg-input" name="username" type="text"
                            value={formData.username} onChange={handleChange}
                            placeholder="Tu nombre" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <Field label="Apellido" required>
                        <input className="reg-input" name="userlastname" type="text"
                            value={formData.userlastname} onChange={handleChange}
                            placeholder="Tu apellido" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <Field label="Email" required>
                        <input className="reg-input" name="useremail" type="email"
                            value={formData.useremail} onChange={handleChange}
                            placeholder="tu@email.com" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <Field label="Documento" required>
                        <input className="reg-input" name="documento" type="number"
                            value={formData.documento} onChange={handleChange}
                            placeholder="Número de documento" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <Field label="Celular" required>
                        <input className="reg-input" name="usertelefono" type="number"
                            value={formData.usertelefono} onChange={handleChange}
                            placeholder="341xxxxxxx" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: borderC }} />
                        <span className="reg-divider-label" style={{ color: textMuted }}>Plan</span>
                        <div style={{ flex: 1, height: '1px', background: borderC }} />
                    </div>

                    <Field label="Días de entrenamiento" required>
                        <select className="reg-select" name="diasentrenamiento"
                            value={formData.diasentrenamiento} onChange={handleChange} required
                            style={{ background: inputBg, color: formData.diasentrenamiento ? inputColor : 'rgba(160,174,192,0.6)' }}
                        >
                            <option value="" disabled>Seleccioná la cantidad de días</option>
                            <option value="2">2 días</option>
                            <option value="3">3 días</option>
                            <option value="4">4 días</option>
                            <option value="5">5 días</option>
                        </select>
                    </Field>

                    <Field label="Descuento">
                        <select className="reg-select" name="descuento"
                            value={formData.descuento} onChange={handleChange}
                            style={{ background: inputBg, color: formData.descuento ? inputColor : 'rgba(160,174,192,0.6)' }}
                        >
                            <option value="">Sin descuento</option>
                            <option value="jubilado">Jubilado</option>
                            <option value="estudiante">Estudiante</option>
                            <option value="familia">Grupo familiar (+2)</option>
                            <option value="deportista">Deportista</option>
                        </select>
                    </Field>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: borderC }} />
                        <span className="reg-divider-label" style={{ color: textMuted }}>Seguridad</span>
                        <div style={{ flex: 1, height: '1px', background: borderC }} />
                    </div>

                    <Field label="Contraseña" required>
                        <input className="reg-input" name="userpassword" type="password"
                            value={formData.userpassword} onChange={handleChange}
                            placeholder="Tu contraseña" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <Field label="Confirmá tu contraseña" required>
                        <input className="reg-input" name="userpasswordc" type="password"
                            value={formData.userpasswordc} onChange={handleChange}
                            placeholder="Repetí tu contraseña" required
                            style={{ background: inputBg, color: inputColor }} />
                    </Field>

                    <button className="reg-submit-btn" type="submit" disabled={loading}>
                        {loading
                            ? <><Spinner size="sm" color="gray.800" thickness="2px" /> Registrando...</>
                            : 'Crear cuenta'
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Registro