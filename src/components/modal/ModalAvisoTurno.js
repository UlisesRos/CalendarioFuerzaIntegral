import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import { MINUTOS_BLOQUEO_ANTES } from '../../utils/bajasTurnos';

// ============================================================================
// Carteles amables del calendario cuando alguien se borra de un turno:
//   - 'bloqueo'     (azul)  : falta muy poco para la clase, no puede borrarse/moverlo
//   - 'advertencia' (ámbar) : 8ª y 9ª baja del mes
//   - 'limite'      (rojo)  : 10ª baja del mes en adelante
// Son sólo avisos informativos: nada de esto bloquea a nadie en el calendario.
// ============================================================================

const TEMAS = {
    bloqueo:     { color: '#63B3ED', rgb: '99,179,237',  icono: '⏰' },
    advertencia: { color: '#F6AD55', rgb: '246,173,85',  icono: '⚠️' },
    limite:      { color: '#FC8181', rgb: '252,129,129', icono: '🚫' },
};

const ORDINALES = { 8: 'octava', 9: 'novena' };

const styles = `
    @keyframes avBackdropIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
    @keyframes avPanelIn {
        from { opacity: 0; transform: translateY(32px) scale(0.97); }
        to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes avPanelInMobile {
        from { opacity: 0; transform: translateY(100%); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes avPulse {
        0%   { box-shadow: 0 0 0 0 rgba(var(--av-rgb), 0.5); }
        70%  { box-shadow: 0 0 0 7px rgba(var(--av-rgb), 0); }
        100% { box-shadow: 0 0 0 0 rgba(var(--av-rgb), 0); }
    }

    .av-backdrop {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0,0,0,0.78);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        box-sizing: border-box;
        animation: avBackdropIn 0.3s ease both;
    }
    .av-panel {
        position: relative;
        width: 100%;
        max-width: 440px;
        max-height: 92vh;
        overflow-y: auto;
        background: #111827;
        border-radius: 20px;
        border: 1px solid rgba(var(--av-rgb), 0.25);
        box-shadow: 0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(var(--av-rgb), 0.08);
        animation: avPanelIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }
    .av-content { padding: 28px 28px 24px; }
    .av-handle { display: none; }

    @media (max-width: 599px) {
        .av-backdrop { align-items: flex-end; padding: 0; }
        .av-panel {
            border-radius: 24px 24px 0 0;
            animation-name: avPanelInMobile;
        }
        .av-content { padding: 32px 20px calc(28px + env(safe-area-inset-bottom, 0px)); }
        .av-handle {
            display: block;
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 36px;
            height: 4px;
            background: rgba(255,255,255,0.12);
            border-radius: 9999px;
            z-index: 20;
        }
    }
    @media (prefers-reduced-motion: reduce) {
        .av-backdrop, .av-panel { animation: none; }
    }

    .av-close-btn {
        background: rgba(255,255,255,0.07);
        border: none;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255,255,255,0.5);
        font-size: 0.82rem;
        transition: background 0.2s ease, color 0.2s ease;
        flex-shrink: 0;
    }
    .av-close-btn:hover {
        background: rgba(255,255,255,0.15);
        color: white;
    }

    .av-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 13px 28px;
        border: 1px solid var(--av-color);
        color: #1a202c;
        background: var(--av-color);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        width: 100%;
    }
    .av-btn:hover {
        filter: brightness(0.92);
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(var(--av-rgb), 0.35);
    }
    .av-btn:focus-visible, .av-close-btn:focus-visible {
        outline: 2px solid var(--av-color);
        outline-offset: 2px;
    }
`;

// Arma los textos de cada cartel
const armarContenido = (aviso) => {
    if (aviso.tipo === 'bloqueo') {
        const mover = aviso.accion === 'mover';
        const minutos = Number(aviso.minutosParaInicio);
        const cuando = aviso.enCurso
            ? 'ya está en marcha'
            : minutos > 1 ? `empieza en ${minutos} minutos` : 'está por comenzar';

        return {
            eyebrow: aviso.enCurso ? 'Clase en curso' : 'Turno por comenzar',
            titulo: mover ? 'No podés mover este turno' : 'No podés borrarte de este turno',
            parrafos: [
                `Tu clase de las ${aviso.hora}:00 hs ${cuando} y, por la cercanía con el horario, ` +
                    `${mover ? 'ya no es posible cambiarla a otro horario' : 'ya no podés borrarte a esta altura'}.`,
                `Te pedimos que, de ahora en más, ${mover ? 'lo hagas' : 'te borres'} con más anticipación o, mejor aún, ` +
                    'que asistas a tu turno: hay personas que quieren ocupar ese lugar.',
            ],
            destacado: `Podés ${mover ? 'mover tu turno' : 'borrarte'} hasta ${MINUTOS_BLOQUEO_ANTES} minutos antes de la clase.`,
        };
    }

    const cantidad = Number(aviso.cantidad);
    const limite = Number(aviso.limite) || 10;
    const reinicio = 'Tus bajas se reinician el 1.° de cada mes.';

    if (aviso.tipo === 'advertencia') {
        const ordinal = ORDINALES[cantidad];
        const restantes = Math.max(0, Number.isFinite(Number(aviso.restantes)) ? Number(aviso.restantes) : limite - cantidad);
        return {
            eyebrow: 'Aviso importante',
            titulo: ordinal ? `Es tu ${ordinal} baja del mes` : `Ya te borraste ${cantidad} veces este mes`,
            parrafos: [
                `Ya es la ${ordinal ? `${ordinal} vez` : `vez número ${cantidad}`} que te borrás de un turno este mes. ` +
                    `Si te borrás más de ${limite} veces en el mismo mes, la app te va a bloquear la posibilidad de anotarte en los turnos siguientes.`,
                'Gracias por ayudarnos a que más personas puedan entrenar.',
            ],
            destacado: restantes === 1 ? 'Te queda 1 baja este mes' : `Te quedan ${restantes} bajas este mes`,
            nota: reinicio,
        };
    }

    // 'limite'
    return {
        eyebrow: 'Límite del mes',
        titulo: cantidad > limite ? `Ya te borraste ${cantidad} veces este mes` : `Llegaste a tus ${limite} bajas del mes`,
        parrafos: [
            'Ya no podés borrarte de más turnos este mes: si seguís borrándote, la app te va a quitar la posibilidad de sumarte a nuevos turnos.',
            'Sabemos que a veces surgen imprevistos. Solo te pedimos que, de ahora en más, nos acompañes en los turnos que reserves, así otras personas también pueden entrenar.',
        ],
        destacado: cantidad > limite
            ? `Llevás ${cantidad} bajas este mes (el cupo es de ${limite})`
            : `Usaste ${limite} de ${limite} bajas este mes`,
        nota: reinicio,
    };
};

const ModalAvisoTurno = ({ aviso, onClose }) => {
    const botonRef = useRef(null);
    const panelRef = useRef(null);
    // onClose suele llegar como función nueva en cada render: se guarda en un ref para que
    // el efecto dependa sólo de si el cartel está abierto (y no mueva el foco una y otra vez)
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    // Sólo se considera abierto si realmente se va a mostrar (tipo conocido)
    const abierto = !!(aviso && TEMAS[aviso.tipo]);

    useEffect(() => {
        if (!abierto) return;
        const anterior = document.activeElement;
        const overflowPrevio = document.body.style.overflow;
        const handleKey = (e) => { if (e.key === 'Escape') onCloseRef.current(); };
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        botonRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = overflowPrevio;
            try { anterior?.focus?.(); } catch { /* sin foco previo que restaurar */ }
        };
    }, [abierto]);

    if (!abierto) return null;

    const tema = TEMAS[aviso.tipo];
    const contenido = armarContenido(aviso);
    const cssVars = { '--av-color': tema.color, '--av-rgb': tema.rgb };

    // Las teclas dentro del cartel no deben llegar al calendario (por ejemplo, Enter inscribe).
    // Escape se resuelve acá porque stopPropagation también frena el listener del documento.
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();

        // El foco se queda dentro del cartel mientras está abierto
        if (e.key === 'Tab') {
            const botones = panelRef.current ? [...panelRef.current.querySelectorAll('button:not([disabled])')] : [];
            if (botones.length) {
                const primero = botones[0];
                const ultimo = botones[botones.length - 1];
                const enPanel = panelRef.current.contains(document.activeElement);
                if (!enPanel || (e.shiftKey && document.activeElement === primero)) {
                    e.preventDefault();
                    (e.shiftKey ? ultimo : primero).focus();
                } else if (!e.shiftKey && document.activeElement === ultimo) {
                    e.preventDefault();
                    primero.focus();
                }
            }
        }
        e.stopPropagation();
    };

    const content = (
        <>
            <style>{styles}</style>
            <div className="av-backdrop" style={cssVars} onClick={onClose} onKeyDown={handleKeyDown}>
                <div
                    ref={panelRef}
                    className="av-panel"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="av-titulo"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="av-handle" />

                    {/* Barra superior de color */}
                    <div style={{
                        height: '3px',
                        background: `linear-gradient(90deg, ${tema.color}, rgba(${tema.rgb},0.7))`,
                        width: '100%',
                    }} />

                    <div className="av-content">
                        {/* Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            gap: '12px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div aria-hidden="true" style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    background: `rgba(${tema.rgb},0.1)`,
                                    border: `1px solid rgba(${tema.rgb},0.22)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.15rem',
                                    flexShrink: 0,
                                }}>
                                    {tema.icono}
                                </div>
                                <div>
                                    <span style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: tema.color,
                                        fontWeight: 600,
                                        display: 'block',
                                        marginBottom: '3px',
                                    }}>
                                        {contenido.eyebrow}
                                    </span>
                                    <h2 id="av-titulo" style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.15rem',
                                        fontWeight: 900,
                                        color: 'white',
                                        margin: 0,
                                        lineHeight: 1.2,
                                    }}>
                                        {contenido.titulo}
                                    </h2>
                                </div>
                            </div>
                            <button className="av-close-btn" onClick={onClose} aria-label="Cerrar">✕</button>
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px',
                            background: `rgba(${tema.rgb},0.12)`,
                            marginBottom: '18px',
                        }} />

                        {/* Mensaje */}
                        {contenido.parrafos.map((texto, i) => (
                            <p key={i} style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: '0.84rem',
                                color: 'rgba(255,255,255,0.6)',
                                lineHeight: 1.75,
                                margin: i === contenido.parrafos.length - 1 ? '0 0 20px' : '0 0 12px',
                            }}>
                                {texto}
                            </p>
                        ))}

                        {/* Dato destacado */}
                        <div style={{
                            background: `rgba(${tema.rgb},0.07)`,
                            border: `1px solid rgba(${tema.rgb},0.2)`,
                            borderRadius: '10px',
                            padding: '12px 14px',
                            marginBottom: '24px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: tema.color,
                                    animation: 'avPulse 2s infinite',
                                    flexShrink: 0,
                                }} />
                                <span style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: '0.8rem',
                                    color: tema.color,
                                    fontWeight: 600,
                                    lineHeight: 1.5,
                                }}>
                                    {contenido.destacado}
                                </span>
                            </div>
                            {contenido.nota && (
                                <p style={{
                                    fontFamily: "'Poppins', sans-serif",
                                    fontSize: '0.72rem',
                                    color: 'rgba(255,255,255,0.45)',
                                    lineHeight: 1.5,
                                    margin: '6px 0 0 17px',
                                }}>
                                    {contenido.nota}
                                </p>
                            )}
                        </div>

                        <button ref={botonRef} className="av-btn" onClick={onClose}>
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return createPortal(content, document.body);
};

export default ModalAvisoTurno;
