// ─── EditUserButton.jsx ───────────────────────────────────────────────────────
import { createPortal } from "react-dom"
import { useState, useEffect } from "react"
import { useToast, Spinner } from "@chakra-ui/react"
import axios from "axios"

const editUserStyles = `
    @keyframes euBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes euPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes euPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes euFieldIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .eu-open-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.7rem; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase;
        cursor: pointer; border-radius: 8px;
        padding: 5px 14px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391; background: transparent;
        transition: all 0.25s ease;
        white-space: nowrap;
    }
    .eu-open-btn:hover {
        background: rgba(104,211,145,0.1);
        border-color: #68D391;
        transform: translateY(-1px);
    }

    .eu-close-btn {
        background: rgba(255,255,255,0.08); border: none;
        cursor: pointer; width: 30px; height: 30px;
        border-radius: 50%; display: flex;
        align-items: center; justify-content: center;
        color: rgba(255,255,255,0.6); font-size: 0.82rem;
        transition: background 0.2s ease; flex-shrink: 0;
    }
    .eu-close-btn:hover { background: rgba(255,255,255,0.15); color: white; }

    .eu-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase;
        color: rgba(255,255,255,0.35);
        display: block; margin-bottom: 6px;
    }

    .eu-input, .eu-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        border-radius: 10px; padding: 10px 14px;
        border: 1px solid rgba(104,211,145,0.3);
        outline: none; width: 100%; box-sizing: border-box;
        background: rgba(255,255,255,0.04);
        color: rgba(255,255,255,0.88);
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .eu-input:focus, .eu-select:focus {
        border-color: #68D391;
        box-shadow: 0 0 0 1px #68D391;
    }
    .eu-input::placeholder { color: rgba(160,174,192,0.45); }
    .eu-select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2368D391' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        background-color: rgba(255,255,255,0.04);
        padding-right: 32px; cursor: pointer;
    }

    .eu-field {
        animation: euFieldIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
    }
    .eu-field:nth-child(1) { animation-delay: 0.05s; }
    .eu-field:nth-child(2) { animation-delay: 0.08s; }
    .eu-field:nth-child(3) { animation-delay: 0.11s; }
    .eu-field:nth-child(4) { animation-delay: 0.14s; }
    .eu-field:nth-child(5) { animation-delay: 0.17s; }
    .eu-field:nth-child(6) { animation-delay: 0.20s; }

    .eu-save-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        cursor: pointer; border-radius: 10px;
        padding: 11px 24px; flex: 1;
        border: 1px solid #68D391;
        color: #1a202c; background: #68D391;
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        display: flex; align-items: center; justify-content: center; gap: 6px;
    }
    .eu-save-btn:hover:not(:disabled) {
        background: #4FBF72; border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }
    .eu-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .eu-cancel-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem; font-weight: 600;
        letter-spacing: 0.08em; text-transform: uppercase;
        cursor: pointer; border-radius: 10px;
        padding: 11px 20px;
        border: 1px solid rgba(160,174,192,0.25);
        color: rgba(160,174,192,0.7); background: transparent;
        transition: all 0.25s ease;
    }
    .eu-cancel-btn:hover {
        border-color: rgba(160,174,192,0.45);
        transform: translateY(-1px);
    }
`

function EditUserButton({ user, onUserUpdated, theme, apiUrl }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const isMobile = window.innerWidth < 600
    const toast = useToast()

    const [formData, setFormData] = useState({
        username: user.username,
        userlastname: user.userlastname,
        usertelefono: user.usertelefono,
        diasentrenamiento: user.diasentrenamiento,
        descuento: user.descuento,
        fechaPago: user.fechaPago,
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            await axios.put(`${apiUrl}/api/auth/userupdate/${user._id}`, formData)
            toast({ title: "Usuario actualizado", description: "Los datos se actualizaron correctamente.", status: "success", duration: 5000, isClosable: true })
            onUserUpdated()
            setIsOpen(false)
        } catch (error) {
            console.error("Error al actualizar el usuario:", error)
            toast({ title: "Error", description: "Hubo un problema al actualizar el usuario.", status: "error", duration: 5000, isClosable: true })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isOpen) return
        const handleKey = (e) => { if (e.key === 'Escape') setIsOpen(false) }
        document.addEventListener('keydown', handleKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKey)
            document.body.style.overflow = ''
        }
    }, [isOpen])

    const modal = isOpen ? createPortal(
        <div
            onClick={() => setIsOpen(false)}
            style={{
                position: 'fixed', inset: 0, zIndex: 99999,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                padding: isMobile ? 0 : '16px',
                animation: 'euBackdropIn 0.3s ease both',
            }}
        >
            <style>{editUserStyles}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative', width: '100%', maxWidth: '460px',
                    maxHeight: isMobile ? '92vh' : '84vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: isMobile ? 'euPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both' : 'euPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
                }}
            >
                {isMobile && (
                    <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', width: '36px', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '9999px', zIndex: 20 }} />
                )}

                {/* Header */}
                <div style={{ padding: isMobile ? '28px 20px 18px' : '24px 28px 18px', borderBottom: '1px solid rgba(104,211,145,0.12)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '2px', background: '#68D391', borderRadius: '9999px' }} />
                            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#68D391' }}>
                                Editar cliente
                            </span>
                        </div>
                        <button className="eu-close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 900, color: 'white', margin: 0, lineHeight: 1.1, textTransform: 'capitalize' }}>
                        {user.username} {user.userlastname}
                    </h2>
                </div>

                {/* Formulario scrolleable */}
                <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px' : '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(104,211,145,0.4) transparent' }}>
                    {[
                        { label: 'Nombre', name: 'username', type: 'text', placeholder: 'Nombre' },
                        { label: 'Apellido', name: 'userlastname', type: 'text', placeholder: 'Apellido' },
                        { label: 'Celular', name: 'usertelefono', type: 'text', placeholder: 'Teléfono' },
                        { label: 'Fecha de pago', name: 'fechaPago', type: 'text', placeholder: 'DD-MM-YYYY' },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={name} className="eu-field">
                            <label className="eu-label">{label}</label>
                            <input className="eu-input" name={name} type={type} placeholder={placeholder} value={formData[name] || ''} onChange={handleInputChange} />
                        </div>
                    ))}

                    {/* Días */}
                    <div className="eu-field">
                        <label className="eu-label">Días de entrenamiento</label>
                        <select className="eu-select" name="diasentrenamiento" value={formData.diasentrenamiento} onChange={handleInputChange}>
                            <option value="2">2 días</option>
                            <option value="3">3 días</option>
                            <option value="4">4 días</option>
                            <option value="5">5 días</option>
                        </select>
                    </div>

                    {/* Descuento */}
                    <div className="eu-field">
                        <label className="eu-label">Descuento</label>
                        <select className="eu-select" name="descuento" value={formData.descuento || ''} onChange={handleInputChange}>
                            <option value="">Sin descuento</option>
                            <option value="jubilado">Jubilado</option>
                            <option value="estudiante">Estudiante</option>
                            <option value="familia">Grupo familiar (+2)</option>
                            <option value="deportista">Deportista</option>
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: isMobile ? '16px 20px' : '16px 28px', borderTop: '1px solid rgba(104,211,145,0.1)', display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <button className="eu-save-btn" onClick={handleUpdate} disabled={loading}>
                        {loading ? <><Spinner size="sm" color="gray.800" thickness="2px" /> Guardando...</> : 'Guardar cambios'}
                    </button>
                    <button className="eu-cancel-btn" onClick={() => setIsOpen(false)}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    ) : null

    return (
        <>
            <style>{editUserStyles}</style>
            <button className="eu-open-btn" onClick={() => setIsOpen(true)}>
                Editar
            </button>
            {modal}
        </>
    )
}

export default EditUserButton