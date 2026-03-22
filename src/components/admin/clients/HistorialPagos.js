// ─── HistorialPagos.jsx (admin — desde ClienteModal) ─────────────────────────
import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

const historialPagosAdminStyles = `
    @keyframes hpaBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes hpaPanelIn {
        from { opacity: 0; transform: translateY(40px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes hpaPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes hpaCardIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .hpa-open-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 9px 18px;
        border: 1px solid rgba(104,211,145,0.4);
        color: #68D391;
        background: rgba(104,211,145,0.08);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .hpa-open-btn:hover {
        background: rgba(104,211,145,0.15);
        border-color: #68D391;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    }

    .hpa-close-btn {
        background: rgba(255,255,255,0.08);
        border: none;
        cursor: pointer;
        width: 30px; height: 30px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: rgba(255,255,255,0.6);
        font-size: 0.82rem;
        transition: background 0.2s ease;
        flex-shrink: 0;
    }
    .hpa-close-btn:hover { background: rgba(255,255,255,0.15); color: white; }

    .hpa-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        border-radius: 10px;
        padding: 9px 32px 9px 12px;
        border: 1px solid rgba(104,211,145,0.35);
        outline: none;
        flex: 1;
        transition: border-color 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2368D391' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        cursor: pointer;
    }
    .hpa-select:focus { border-color: #68D391; box-shadow: 0 0 0 1px #68D391; }

    .hpa-pago-card {
        animation: hpaCardIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
        transition: transform 0.2s ease;
    }
    .hpa-pago-card:hover { transform: translateY(-2px); }

    .hpa-reset-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem; font-weight: 600;
        letter-spacing: 0.1em; text-transform: uppercase;
        cursor: pointer; background: none; border: none;
        color: rgba(160,174,192,0.6); padding: 0;
        transition: color 0.2s ease;
    }
    .hpa-reset-btn:hover { color: #68D391; }
`

const HistorialPagos = ({ clienteSeleccionado, theme }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [mesSeleccionado, setMesSeleccionado] = useState("")
    const [anioSeleccionado, setAnioSeleccionado] = useState("")
    const isMobile = window.innerWidth < 600

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const anios = Array.from({ length: new Date().getFullYear() - 2024 + 1 }, (_, i) => 2025 + i)

    const formatFecha = (fechaISO) => {
        const f = new Date(fechaISO)
        return `${String(f.getDate()).padStart(2, '0')}-${String(f.getMonth() + 1).padStart(2, '0')}-${f.getFullYear()}`
    }

    const pagosFiltrados = clienteSeleccionado.historialPagos.filter((pago) => {
        const f = new Date(pago.fecha)
        const cumpleMes = mesSeleccionado ? f.getMonth() + 1 === parseInt(mesSeleccionado) : true
        const cumpleAnio = anioSeleccionado ? f.getFullYear() === parseInt(anioSeleccionado) : true
        return cumpleMes && cumpleAnio
    })

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

    const selectStyle = { background: '#1a2332', color: 'rgba(255,255,255,0.85)' }

    const modal = isOpen ? createPortal(
        <div
            onClick={() => setIsOpen(false)}
            style={{
                position: 'fixed', inset: 0, zIndex: 999999,
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
                display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center',
                padding: isMobile ? 0 : '16px',
                animation: 'hpaBackdropIn 0.3s ease both',
            }}
        >
            <style>{historialPagosAdminStyles}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative', width: '100%', maxWidth: '460px',
                    maxHeight: isMobile ? '92vh' : '82vh',
                    background: '#111827',
                    borderRadius: isMobile ? '24px 24px 0 0' : '20px',
                    border: '1px solid rgba(104,211,145,0.2)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    animation: isMobile ? 'hpaPanelInMobile 0.4s cubic-bezier(0.22,1,0.36,1) both' : 'hpaPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
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
                                Historial de pagos
                            </span>
                        </div>
                        <button className="hpa-close-btn" onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 900, color: 'white', margin: '0 0 4px', lineHeight: 1.1, textTransform: 'capitalize' }}>
                        {clienteSeleccionado.username} {clienteSeleccionado.userlastname}
                    </h2>
                    <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                        {pagosFiltrados.length} {pagosFiltrados.length === 1 ? 'pago encontrado' : 'pagos encontrados'}
                    </p>
                </div>

                {/* Filtros */}
                <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <select className="hpa-select" value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)} style={selectStyle}>
                        <option value="">Todos los meses</option>
                        {meses.map((mes, i) => <option key={i} value={i + 1}>{mes}</option>)}
                    </select>
                    <select className="hpa-select" value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(e.target.value)} style={selectStyle}>
                        <option value="">Todos los años</option>
                        {anios.map((anio) => <option key={anio} value={anio}>{anio}</option>)}
                    </select>
                    {(mesSeleccionado || anioSeleccionado) && (
                        <button className="hpa-reset-btn" onClick={() => { setMesSeleccionado(""); setAnioSeleccionado("") }}>
                            Limpiar
                        </button>
                    )}
                </div>

                {/* Lista */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(104,211,145,0.4) transparent' }}>
                    {pagosFiltrados.length === 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: '8px' }}>
                            <span style={{ fontSize: '1.8rem' }}>📭</span>
                            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                                No hay pagos para el filtro seleccionado
                            </span>
                        </div>
                    ) : (
                        pagosFiltrados.map((pago, i) => {
                            const mesPago = new Date(pago.fecha).getMonth()
                            return (
                                <div key={i} className="hpa-pago-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(104,211,145,0.15)', borderRadius: '12px', padding: '14px 16px', animationDelay: `${i * 0.05}s` }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#68D391', flexShrink: 0 }} />
                                            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, color: 'white' }}>{meses[mesPago]}</span>
                                        </div>
                                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#68D391' }}>
                                            ${pago.monto?.toLocaleString('es-ES')}
                                        </span>
                                    </div>
                                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        {[
                                            { label: 'Fecha', value: formatFecha(pago.fecha) },
                                            { label: 'Días', value: `${clienteSeleccionado.diasentrenamiento} días` },
                                            { label: 'Método', value: pago.metodo },
                                        ].map(({ label, value }) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>{label}</span>
                                                <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.75)', textTransform: 'capitalize' }}>{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>,
        document.body
    ) : null

    return (
        <>
            <style>{historialPagosAdminStyles}</style>
            <button className="hpa-open-btn" onClick={() => setIsOpen(true)}>
                Ver historial de pagos
            </button>
            {modal}
        </>
    )
}

export default HistorialPagos