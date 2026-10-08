// ─── Bajas de turnos: ventana de bloqueo cercana a la clase ──────────────────
// Misma regla que aplica el servidor (CalendarioBack/utils/bajas.js): desde 15
// minutos antes de que empiece la clase hasta que termina, una persona no puede
// borrarse ni mover su turno. Acá sólo se usa para avisar al instante, sin esperar
// la respuesta del servidor; el servidor siempre tiene la última palabra.

export const MINUTOS_BLOQUEO_ANTES = 15
export const DURACION_CLASE_MIN = 60
// El calendario se reinicia los sábados a las 12 hs de Argentina: desde ahí los
// horarios del sábado ya son de la semana siguiente
const REINICIO_SABADO_MINUTOS = 12 * 60

const DIAS_EN_INGLES = {
    Sunday: 'domingo',
    Monday: 'lunes',
    Tuesday: 'martes',
    Wednesday: 'miércoles',
    Thursday: 'jueves',
    Friday: 'viernes',
    Saturday: 'sábado',
}

// Día de la semana y minutos desde las 00:00 en hora argentina (sin importar la zona del celular)
const ahoraEnArgentina = (ms) => {
    const partes = {}
    new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Argentina/Buenos_Aires',
        hourCycle: 'h23',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).formatToParts(new Date(ms)).forEach((parte) => { partes[parte.type] = parte.value })

    return {
        dia: DIAS_EN_INGLES[partes.weekday],
        // % 24: algunos navegadores viejos informan la medianoche como "24"
        minutos: (Number(partes.hour) % 24) * 60 + Number(partes.minute) + Number(partes.second) / 60,
    }
}

// ¿Está demasiado cerca la clase como para borrarse o moverla?
// Devuelve { bloqueado, enCurso, minutosParaInicio }. Ante cualquier duda NO bloquea.
export const estadoBloqueoBaja = (day, hour, ms = Date.now()) => {
    try {
        const horaClase = Number(hour)
        if (!Number.isInteger(horaClase)) return { bloqueado: false }

        const ahora = ahoraEnArgentina(ms)
        if (ahora.dia !== day) return { bloqueado: false }
        if (day === 'sábado' && ahora.minutos >= REINICIO_SABADO_MINUTOS) return { bloqueado: false }

        const minutosParaInicio = horaClase * 60 - ahora.minutos // negativo: la clase ya empezó
        if (minutosParaInicio > MINUTOS_BLOQUEO_ANTES || minutosParaInicio <= -DURACION_CLASE_MIN) {
            return { bloqueado: false }
        }

        return {
            bloqueado: true,
            enCurso: minutosParaInicio <= 0,
            minutosParaInicio: Math.max(0, Math.ceil(minutosParaInicio)),
        }
    } catch {
        return { bloqueado: false }
    }
}
