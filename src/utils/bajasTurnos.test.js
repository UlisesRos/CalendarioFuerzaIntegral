import { estadoBloqueoBaja } from './bajasTurnos'

// Argentina es UTC-3 todo el año: 17:45 en Argentina = 20:45 UTC
const ar = (dia, hora, minuto = 0, segundo = 0) => Date.UTC(2026, 9, dia, hora + 3, minuto, segundo)
// 5/10/2026 es lunes; 10/10/2026 es sábado
const lunes = (hora, minuto, segundo) => ar(5, hora, minuto, segundo)
const sabado = (hora, minuto, segundo) => ar(10, hora, minuto, segundo)

describe('estadoBloqueoBaja', () => {
    test('límites exactos de la ventana (clase de las 18)', () => {
        expect(estadoBloqueoBaja('lunes', '18', lunes(10, 0)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja('lunes', '18', lunes(17, 44, 59)).bloqueado).toBe(false)

        expect(estadoBloqueoBaja('lunes', '18', lunes(17, 45, 0))).toEqual({
            bloqueado: true, enCurso: false, minutosParaInicio: 15,
        })
        expect(estadoBloqueoBaja('lunes', '18', lunes(17, 59, 30))).toEqual({
            bloqueado: true, enCurso: false, minutosParaInicio: 1,
        })
        expect(estadoBloqueoBaja('lunes', '18', lunes(18, 0, 0))).toEqual({
            bloqueado: true, enCurso: true, minutosParaInicio: 0,
        })
        expect(estadoBloqueoBaja('lunes', '18', lunes(18, 59, 59)).bloqueado).toBe(true)
        expect(estadoBloqueoBaja('lunes', '18', lunes(19, 0, 0)).bloqueado).toBe(false)
    })

    test('sólo aplica el mismo día de la semana', () => {
        expect(estadoBloqueoBaja('lunes', '18', ar(6, 17, 50)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja('lunes', '8', lunes(17, 50)).bloqueado).toBe(false)
    })

    test('no depende de la zona horaria del dispositivo', () => {
        // 20:50 UTC del lunes es 17:50 en Argentina, sea cual sea la zona del celular
        expect(estadoBloqueoBaja('lunes', '18', Date.UTC(2026, 9, 5, 20, 50)).bloqueado).toBe(true)
        expect(estadoBloqueoBaja('lunes', '18', Date.UTC(2026, 9, 5, 17, 50)).bloqueado).toBe(false)
    })

    test('el sábado, tras el reinicio de las 12 hs, los turnos son de la semana siguiente', () => {
        expect(estadoBloqueoBaja('sábado', '12', sabado(11, 50)).bloqueado).toBe(true)
        expect(estadoBloqueoBaja('sábado', '12', sabado(12, 0)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja('sábado', '12', sabado(12, 30)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja('sábado', '11', sabado(11, 30)).bloqueado).toBe(true)
    })

    test('datos inválidos nunca bloquean', () => {
        expect(estadoBloqueoBaja('lunes', 'abc', lunes(17, 50)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja('domingo', '18', lunes(17, 50)).bloqueado).toBe(false)
        expect(estadoBloqueoBaja(undefined, undefined, lunes(17, 50)).bloqueado).toBe(false)
    })
})
