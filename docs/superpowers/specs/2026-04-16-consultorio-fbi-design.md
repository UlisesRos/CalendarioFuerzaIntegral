# Consultorio FBI — Diseño de la nueva sección

**Fecha:** 2026-04-16  
**Estado:** Aprobado por el usuario

---

## Resumen

Agregar una nueva sección pública llamada **Consultorio FBI** al sitio web de Fuerza Integral. La sección presenta a los profesionales de salud que trabajan en conjunto con el gimnasio: 3 nutricionistas, 1 kinesióloga y 1 osteópata. El diseño sigue los patrones visuales existentes (Chakra UI + Framer Motion + Playfair Display/Poppins + verde #68D391) con tabs animados, cards de profesionales y un modal de detalle con botones de contacto (WhatsApp e Instagram).

---

## Archivos a modificar/crear

| Archivo | Acción |
|---|---|
| `src/components/consultorio/ConsultorioFBI.js` | Crear — componente principal |
| `src/css/consultorio/ConsultorioFBI.css` | Crear — animaciones y estilos específicos |
| `src/App.js` | Modificar — agregar import y ruta `/consultoriofbi` |
| `src/components/Navbar/SidebarMenu.js` | Modificar — agregar NavLink "Consultorio FBI" |

---

## Datos de los profesionales

### Nutricionistas
```js
[
  {
    id: 'nutri1',
    img: 'nutri1', // src/img/nutri1.png (el usuario la carga)
    name: 'Florencia Bertaña',
    profesion: 'Lic. en Nutrición',
    desc: `Soy Florencia Bertaña, licenciada en Nutrición recibida en la Universidad del Centro Educativo Latinoamericano (UCEL). Me especializo en nutrición deportiva, particularmente en fútbol, y en estrategias orientadas a mejorar el rendimiento y modificar la composición corporal. Soy antropometrista nivel 2, lo que me permite evaluar la composición corporal de manera precisa y realizar un seguimiento objetivo de los cambios. Además, realicé formación en coaching nutricional, lo que me permite acompañar no solo a deportistas, sino también a personas que buscan mejorar sus hábitos y su composición corporal, aunque no practiquen deporte. Mi objetivo es acompañar a cada persona en la mejora de sus hábitos, optimizar el rendimiento (deportivo o cotidiano) y ayudar a que cada uno se sienta mejor, generando cambios sostenibles a largo plazo.`,
    whatsapp: '#', // el usuario carga el link
    instagram: '#',
  },
  {
    id: 'nutri2',
    img: 'nutri2',
    name: 'Carolina Giandomenico',
    profesion: 'Lic. en Nutrición',
    desc: `Soy Carolina Giandomenico, licenciada en nutrición. Siempre me interesó la actividad física y muchos de los posgrados que realicé fueron de nutrición deportiva. Pero, la verdad es que muchas áreas de la profesión me encantan, y por ende mi interés abarca desde patologías crónicas como la diabetes hasta elecciones alimentarias como el vegetarianismo. Considero que lo más importante cuando hablamos de alimentación es reestablecer una manera más amorosa y amable de vincularnos con la comida, el cuerpo y la salud en general. Cuando una persona llega a la consulta, amo escuchar y conocer su contexto, historia y necesidades para poder darles herramientas y acompañar el proceso de cambio.`,
    whatsapp: '#',
    instagram: '#',
  },
  {
    id: 'nutri3',
    img: 'nutri3',
    name: 'Julieta Martini',
    profesion: 'Lic. en Nutrición',
    desc: `Soy Julieta Martini, me recibí como Licenciada en Nutrición en Ucel, también realicé la diplomatura en Nutrición Deportiva de la UNR y el curso ISAK de las mediciones antropométricas para poder brindar más herramientas a mis pacientes. Me especializo en el ámbito deportivo. Mi principal objetivo es mejorar el rendimiento de las personas: que tengan más energía, se sientan mejor y aprendan a mirar más allá del número en la balanza. Por eso me enfoco en analizar la composición corporal con las mediciones antropométricas, acompañando la evolución de la masa muscular y la grasa, y enseñando a comer de forma adecuada para evitar la pérdida de músculo y construir hábitos que se sostengan en el tiempo.`,
    whatsapp: '#',
    instagram: '#',
  },
]
```

### Kinesióloga
```js
[
  {
    id: 'kine',
    img: 'kine',
    name: 'Milagros Rinaldi',
    profesion: 'Lic. en Kinesiología y Fisiatría',
    desc: `Soy Milagros Rinaldi, Licenciada en Kinesiología y Fisiatría, egresada de la UAI, y diplomada en Estimulación Temprana del IUNIR. Me incorporo al equipo con una mirada integral, convencida de que la salud no es solo el correcto funcionamiento del cuerpo, sino el equilibrio del ser en todas sus dimensiones. A lo largo de mi formación fui integrando diferentes herramientas como terapias manuales, masoterapia, técnicas de relajación y entrenamiento, desde pilates hasta el trabajo de fuerza. Todo esto me permite acompañar a cada persona con un enfoque personalizado, priorizando un movimiento de calidad, seguro y consciente. Creo profundamente en la importancia de dedicarnos un momento en el día para conectar con nosotros mismos. Ese espacio es uno de los mayores actos de cuidado y bondad que podemos tener con nuestro propio cuerpo. Mi objetivo es acompañarte en ese camino: que puedas moverte mejor, sentirte bien y habitar tu cuerpo desde un lugar más saludable y equilibrado.`,
    whatsapp: '#',
    instagram: '#',
  },
]
```

### Osteópata
```js
[
  {
    id: 'oste',
    img: 'oste',
    name: 'Ignacio Albornoz',
    profesion: 'Osteópata Deportivo',
    desc: `Soy Ignacio Albornoz, licenciado en Kinesiología, certificado en Osteopatía Deportiva (TMID) y Applied Performance Coach (APCC) con una sólida trayectoria orientada al alto rendimiento, la readaptación deportiva y la preparación física. Mi enfoque integra la rehabilitación clínica con el entrenamiento de fuerza, permitiéndome abordar al deportista de forma integral, desde la prevención hasta la vuelta a la competencia. Mi objetivo es la optimización del rendimiento humano, aplicando herramientas de vanguardia en biomecánica y terapia manual para minimizar riesgos de lesión y maximizar la capacidad física de los atletas en entornos competitivos de alto nivel.`,
    whatsapp: '#',
    instagram: '#',
  },
]
```

---

## Estructura del componente ConsultorioFBI.js

```
ConsultorioFBI
├── <style> (animaciones inline igual que Home.js)
├── Hero section
│   ├── Barra verde vertical izquierda
│   ├── Heading "Consultorio FBI" (Playfair Display, mismo tamaño que Home)
│   └── Subtítulo "Nutrición · Kinesiología · Osteopatía" (Poppins uppercase, gray.500)
├── Tabs
│   ├── TabBar (3 tabs: Nutricionistas / Kinesióloga / Osteópata)
│   │   └── Indicador verde: Box con `left` animado via CSS transition
│   └── TabPanel (stagger de cards al cambiar tab)
├── ProfessionalCard (reutiliza estilos de TrainerCard)
│   ├── Foto con grayscale(60%) → grayscale(0%) en hover
│   ├── Barra verde izquierda (accent-bar: sube desde abajo en hover)
│   ├── Nombre + especialidad abajo
│   └── Badge "Ver perfil" en hover
└── ProfessionalModal (extiende TrainerModal con sección de contactos)
    ├── Foto (aspect-ratio 4/5, objectPosition center top)
    ├── Nombre + especialidad superpuesto con gradiente
    ├── Sección "Sobre mí" (mismo estilo que TrainerModal)
    └── Sección "Contacto"
        ├── Botón WhatsApp: bg #68D391, icono SVG WhatsApp, hover con box-shadow verde
        └── Botón Instagram: bg gradient fuchsia→orange, icono SVG Instagram, hover con brillo
```

---

## Animaciones

Todas inline dentro de un `<style>` tag en el componente (igual que Home.js y SidebarMenu.js):

```css
/* Entrada de cards al cambiar tab */
@keyframes consultCardReveal {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Entrada del contenido del tab */
@keyframes tabPanelIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulse sutil en botones de contacto al aparecer el modal */
@keyframes contactBtnIn {
  0%   { opacity: 0; transform: scale(0.92); }
  60%  { opacity: 1; transform: scale(1.03); }
  100% { opacity: 1; transform: scale(1); }
}

/* Clase aplicada a cards */
.consult-card { animation: consultCardReveal 0.6s cubic-bezier(0.22,1,0.36,1) both; }
.consult-card:nth-child(1) { animation-delay: 0.05s; }
.consult-card:nth-child(2) { animation-delay: 0.15s; }
.consult-card:nth-child(3) { animation-delay: 0.25s; }

/* Hover igual que TrainerCard */
.consult-card .card-photo { transition: transform 0.7s cubic-bezier(0.22,1,0.36,1), filter 0.5s ease; filter: grayscale(60%); }
.consult-card:hover .card-photo { transform: scale(1.06); filter: grayscale(0%); }

/* Botones de contacto */
.contact-btn { animation: contactBtnIn 0.4s cubic-bezier(0.22,1,0.36,1) both; }
.contact-btn-wa  { animation-delay: 0.15s; }
.contact-btn-ig  { animation-delay: 0.25s; }
```

---

## Routing y navegación

### App.js
- Import: `import ConsultorioFBI from "./components/consultorio/ConsultorioFBI"`
- Ruta pública (sin `ProtectedRouteToken`): `<Route path="/consultoriofbi" element={<ConsultorioFBI theme={theme} />} />`

### SidebarMenu.js
Agregar `NavLink` con `to="/consultoriofbi"` en los tres bloques de navegación (admin, usuario autenticado, usuario no autenticado), antes de "Contactanos" y con delay apropiado. El texto del link es `"Consultorio FBI"`.

---

## Grid layout

| Categoría | Desktop | Mobile |
|---|---|---|
| Nutricionistas (3) | `repeat(3, 1fr)` | `1fr 1fr` (2 col, 3ra card centrada) |
| Kinesióloga (1) | `1fr` max-width 320px centrado | igual |
| Osteópata (1) | `1fr` max-width 320px centrado | igual |

---

## Imágenes

El usuario cargará las imágenes en `src/img/` con estos nombres exactos. El componente asume extensión `.png`. Si las imágenes son `.jpg`, cambiar la extensión en los imports.

Nombres esperados: `nutri1`, `nutri2`, `nutri3`, `kine`, `oste`.

Los imports en ConsultorioFBI.js usarán:
```js
import nutri1 from '../../img/nutri1.png'
import nutri2 from '../../img/nutri2.png'
import nutri3 from '../../img/nutri3.png'
import kine   from '../../img/kine.png'
import oste   from '../../img/oste.png'
```

---

## Links de contacto

Los links de WhatsApp e Instagram arrancan en `'#'` como placeholder. El usuario los reemplaza cuando los tenga. Formato esperado:
- WhatsApp: `https://wa.me/549XXXXXXXXXX`
- Instagram: `https://instagram.com/usuario`

---

## Decisiones de diseño

- **Sin autenticación requerida:** La sección es pública para que cualquier visitante pueda contactar a los profesionales.
- **Consistencia visual total:** Se reutilizan las mismas clases CSS, fuentes, colores y patrones de animación del Home para no romper la identidad del sitio.
- **Modal en lugar de expand in-place:** Concentra la atención en el CTA de contacto y evita el re-layout del grid.
- **Imágenes con placeholder:** Si la imagen no existe aún, el componente no falla — Chakra UI `Image` muestra un fallback vacío.
