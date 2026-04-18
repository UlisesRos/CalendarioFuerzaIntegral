import React, { useState, useEffect } from 'react'
import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react'
import '../../css/consultorio/ConsultorioFBI.css'

// ── Importar imágenes (el usuario las reemplaza en src/img/) ──────────────
import nutri1 from '../../img/nutri1.png'
import nutri2 from '../../img/nutri2.png'
import nutri3 from '../../img/nutri3.png'
import kine   from '../../img/kine.png'
import oste   from '../../img/oste.png'

// ── SVG Icons ─────────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.535 5.853L.057 23.854a.5.5 0 00.589.588l6.122-1.604A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.69-.505-5.23-1.385l-.374-.217-3.88 1.017 1.033-3.772-.237-.388A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

// ── Data ──────────────────────────────────────────────────────────────────
const PROFESSIONALS = {
  nutricionistas: [
    {
      id: 'nutri1',
      img: nutri1,
      name: 'Florencia Bertaña',
      profesion: 'Lic. en Nutrición',
      desc: 'Soy Florencia Bertaña, licenciada en Nutrición recibida en la Universidad del Centro Educativo Latinoamericano (UCEL). Me especializo en nutrición deportiva, particularmente en fútbol, y en estrategias orientadas a mejorar el rendimiento y modificar la composición corporal. Soy antropometrista nivel 2, lo que me permite evaluar la composición corporal de manera precisa y realizar un seguimiento objetivo de los cambios. Además, realicé formación en coaching nutricional, lo que me permite acompañar no solo a deportistas, sino también a personas que buscan mejorar sus hábitos y su composición corporal, aunque no practiquen deporte. Mi objetivo es acompañar a cada persona en la mejora de sus hábitos, optimizar el rendimiento (deportivo o cotidiano) y ayudar a que cada uno se sienta mejor, generando cambios sostenibles a largo plazo.',
      whatsapp: '#',
      instagram: '#',
    },
    {
      id: 'nutri2',
      img: nutri2,
      name: 'Carolina Giandomenico',
      profesion: 'Lic. en Nutrición',
      desc: 'Soy Carolina Giandomenico, licenciada en nutrición. Siempre me interesó la actividad física y muchos de los posgrados que realicé fueron de nutrición deportiva. Pero, la verdad es que muchas áreas de la profesión me encantan, y por ende mi interés abarca desde patologías crónicas como la diabetes hasta elecciones alimentarias como el vegetarianismo. Considero que lo más importante cuando hablamos de alimentación es reestablecer una manera más amorosa y amable de vincularnos con la comida, el cuerpo y la salud en general. Cuando una persona llega a la consulta, amo escuchar y conocer su contexto, historia y necesidades para poder darles herramientas y acompañar el proceso de cambio.',
      whatsapp: '#',
      instagram: '#',
    },
    {
      id: 'nutri3',
      img: nutri3,
      name: 'Julieta Martini',
      profesion: 'Lic. en Nutrición',
      desc: 'Soy Julieta Martini, me recibí como Licenciada en Nutrición en Ucel, también realicé la diplomatura en Nutrición Deportiva de la UNR y el curso ISAK de las mediciones antropométricas para poder brindar más herramientas a mis pacientes. Me especializo en el ámbito deportivo. Mi principal objetivo es mejorar el rendimiento de las personas: que tengan más energía, se sientan mejor y aprendan a mirar más allá del número en la balanza. Por eso me enfoco en analizar la composición corporal con las mediciones antropométricas, acompañando la evolución de la masa muscular y la grasa, y enseñando a comer de forma adecuada para evitar la pérdida de músculo y construir hábitos que se sostengan en el tiempo.',
      whatsapp: '#',
      instagram: '#',
    },
  ],
  kinesiologa: [
    {
      id: 'kine',
      img: kine,
      name: 'Milagros Rinaldi',
      profesion: 'Lic. en Kinesiología y Fisiatría',
      desc: 'Soy Milagros Rinaldi, Licenciada en Kinesiología y Fisiatría, egresada de la UAI, y diplomada en Estimulación Temprana del IUNIR. Me incorporo al equipo con una mirada integral, convencida de que la salud no es solo el correcto funcionamiento del cuerpo, sino el equilibrio del ser en todas sus dimensiones. A lo largo de mi formación fui integrando diferentes herramientas como terapias manuales, masoterapia, técnicas de relajación y entrenamiento, desde pilates hasta el trabajo de fuerza. Todo esto me permite acompañar a cada persona con un enfoque personalizado, priorizando un movimiento de calidad, seguro y consciente. Creo profundamente en la importancia de dedicarnos un momento en el día para conectar con nosotros mismos. Ese espacio es uno de los mayores actos de cuidado y bondad que podemos tener con nuestro propio cuerpo. Mi objetivo es acompañarte en ese camino: que puedas moverte mejor, sentirte bien y habitar tu cuerpo desde un lugar más saludable y equilibrado.',
      whatsapp: '#',
      instagram: '#',
    },
  ],
  osteopata: [
    {
      id: 'oste',
      img: oste,
      name: 'Ignacio Albornoz',
      profesion: 'Osteópata Deportivo',
      desc: 'Soy Ignacio Albornoz, licenciado en Kinesiología, certificado en Osteopatía Deportiva (TMID) y Applied Performance Coach (APCC) con una sólida trayectoria orientada al alto rendimiento, la readaptación deportiva y la preparación física. Mi enfoque integra la rehabilitación clínica con el entrenamiento de fuerza, permitiéndome abordar al deportista de forma integral, desde la prevención hasta la vuelta a la competencia. Mi objetivo es la optimización del rendimiento humano, aplicando herramientas de vanguardia en biomecánica y terapia manual para minimizar riesgos de lesión y maximizar la capacidad física de los atletas en entornos competitivos de alto nivel.',
      whatsapp: '#',
      instagram: '#',
    },
  ],
}

const TABS = [
  { key: 'nutricionistas', label: 'Nutricionistas' },
  { key: 'kinesiologa',    label: 'Kinesióloga'   },
  { key: 'osteopata',      label: 'Osteópata'     },
]

// ── ProfessionalModal ─────────────────────────────────────────────────────
function ProfessionalModal({ professional, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <Box
      className="consult-modal-backdrop"
      position="fixed"
      inset="0"
      zIndex="1000"
      bg="blackAlpha.700"
      display="flex"
      alignItems={['flex-end', 'center']}
      justifyContent="center"
      px={[0, '16px']}
      onClick={onClose}
      sx={{ backdropFilter: 'blur(6px)' }}
    >
      <Box
        className="consult-modal-panel"
        onClick={(e) => e.stopPropagation()}
        position="relative"
        w={['100%', '480px', '540px']}
        maxH={['95vh', '90vh']}
        bg="gray.950"
        borderRadius={['24px 24px 0 0', '20px']}
        overflow="hidden"
        display="flex"
        flexDir="column"
      >
        {/* Mobile handle */}
        <Box
          display={['block', 'none']}
          position="absolute"
          top="10px"
          left="50%"
          transform="translateX(-50%)"
          w="36px"
          h="4px"
          bg="whiteAlpha.300"
          borderRadius="full"
          zIndex="20"
        />

        {/* Close button */}
        <Box
          position="absolute"
          top="14px"
          right="14px"
          w="36px"
          h="36px"
          borderRadius="full"
          bg="blackAlpha.600"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={onClose}
          zIndex="20"
          sx={{ backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
          _hover={{ bg: 'blackAlpha.800' }}
        >
          <Text color="white" fontSize="1.1rem" lineHeight="1" userSelect="none">✕</Text>
        </Box>

        {/* Scrollable content */}
        <Box
          overflowY="auto"
          flex="1"
          sx={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: 'var(--chakra-colors-green-700)', borderRadius: '4px' },
          }}
        >
          {/* Photo */}
          <Box position="relative" w="100%" sx={{ aspectRatio: '4 / 5' }} flexShrink={0} overflow="hidden">
            <Image
              src={professional.img}
              alt={professional.name}
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition="center top"
            />
            <Box
              position="absolute"
              bottom="0"
              left="0"
              right="0"
              h="55%"
              bgGradient="linear(to-t, gray.950 0%, transparent 100%)"
            />
            <Box position="absolute" bottom="20px" left="24px" right="60px">
              <Box w="28px" h="2px" bg="green.400" borderRadius="full" mb="8px" />
              <Heading
                fontFamily='"Playfair Display", serif'
                fontSize={['1.5rem', '1.9rem']}
                fontWeight="900"
                color="white"
                lineHeight="1.1"
              >
                {professional.name}
              </Heading>
              <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.7rem"
                letterSpacing="0.22em"
                textTransform="uppercase"
                color="green.400"
                mt="4px"
              >
                {professional.profesion}
              </Text>
            </Box>
          </Box>

          {/* Description */}
          <Box px={['20px', '28px']} pt="20px" pb="12px" bg="gray.950">
            <Flex alignItems="center" gap="10px" mb="16px">
              <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
              <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.68rem"
                letterSpacing="0.22em"
                textTransform="uppercase"
                color="gray.500"
              >
                Sobre mí
              </Text>
            </Flex>
            <Text
              fontFamily='"Poppins", sans-serif'
              fontSize={['0.88rem', '0.95rem']}
              color="gray.300"
              lineHeight="1.85"
            >
              {professional.desc}
            </Text>
          </Box>

          {/* Contact buttons */}
          <Box px={['20px', '28px']} pt="8px" pb="32px" bg="gray.950">
            <Flex alignItems="center" gap="10px" mb="16px">
              <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
              <Text
                fontFamily='"Poppins", sans-serif'
                fontSize="0.68rem"
                letterSpacing="0.22em"
                textTransform="uppercase"
                color="gray.500"
              >
                Contacto
              </Text>
            </Flex>
            <Flex gap="12px" flexDir={['column', 'row']}>
              {/* WhatsApp */}
              <Box
                as="a"
                href={professional.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn contact-btn-wa"
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="8px"
                py="12px"
                px="20px"
                borderRadius="12px"
                color="white"
                fontFamily='"Poppins", sans-serif'
                fontSize="0.82rem"
                fontWeight="600"
                textDecoration="none"
                sx={{
                  background: '#25D366',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(37,211,102,0.45)',
                    background: '#1ebe5d',
                  },
                }}
              >
                <WhatsAppIcon />
                WhatsApp
              </Box>

              {/* Instagram */}
              <Box
                as="a"
                href={professional.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn contact-btn-ig"
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="8px"
                py="12px"
                px="20px"
                borderRadius="12px"
                color="white"
                fontFamily='"Poppins", sans-serif'
                fontSize="0.82rem"
                fontWeight="600"
                textDecoration="none"
                sx={{
                  background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(253,29,29,0.4)',
                    filter: 'brightness(1.1)',
                  },
                }}
              >
                <InstagramIcon />
                Instagram
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── ProfessionalCard ──────────────────────────────────────────────────────
function ProfessionalCard({ professional, onClick }) {
  return (
    <Box
      className="consult-card"
      onClick={onClick}
      cursor="pointer"
      position="relative"
      overflow="hidden"
      borderRadius="16px"
      bg="gray.900"
      sx={{ aspectRatio: '3 / 4' }}
      role="group"
    >
      {/* Accent bar */}
      <Box position="absolute" left="0" top="0" bottom="0" w="3px" zIndex="20" overflow="hidden">
        <Box
          className="c-accent-bar"
          w="3px"
          bg="green.400"
          position="absolute"
          bottom="0"
          left="0"
          right="0"
        />
      </Box>

      {/* Photo */}
      <Box position="absolute" inset="0" overflow="hidden">
        <Image
          className="c-card-photo"
          src={professional.img}
          alt={professional.name}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="top"
        />
        <Box
          position="absolute"
          inset="0"
          bgGradient="linear(to-t, blackAlpha.800 0%, blackAlpha.200 45%, transparent 70%)"
        />
        <Box className="c-card-overlay" position="absolute" inset="0" bg="blackAlpha.600" />
      </Box>

      {/* Name + contact icons */}
      <Box position="absolute" bottom="0" left="0" right="0" zIndex="10" p={['12px', '18px']}>
        <Flex justifyContent="space-between" alignItems="flex-end">
          <Box>
            <Text
              fontFamily='"Playfair Display", serif'
              fontSize={['0.9rem', '1.05rem', '1.2rem']}
              fontWeight="700"
              color="white"
              lineHeight="1.2"
            >
              {professional.name}
            </Text>
            <Text
              fontFamily='"Poppins", sans-serif'
              fontSize={['0.62rem', '0.68rem']}
              color="green.300"
              letterSpacing="0.2em"
              textTransform="uppercase"
              mt="2px"
            >
              {professional.profesion}
            </Text>
          </Box>

          {/* Botones de contacto rápido */}
          <Flex gap="6px" mb="2px" flexShrink={0}>
            <Box
              as="a"
              href={professional.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              w={['30px', '34px']}
              h={['30px', '34px']}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              sx={{
                background: '#25D366',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                flexShrink: 0,
                '&:hover': {
                  transform: 'scale(1.15)',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.55)',
                },
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.121 1.535 5.853L.057 23.854a.5.5 0 00.589.588l6.122-1.604A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.69-.505-5.23-1.385l-.374-.217-3.88 1.017 1.033-3.772-.237-.388A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
            </Box>
            <Box
              as="a"
              href={professional.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              w={['30px', '34px']}
              h={['30px', '34px']}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              sx={{
                background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
                backdropFilter: 'blur(4px)',
                transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
                flexShrink: 0,
                '&:hover': {
                  transform: 'scale(1.15)',
                  boxShadow: '0 4px 14px rgba(253,29,29,0.45)',
                },
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Hint badge */}
      <Box
        className="c-card-hint"
        position="absolute"
        top="12px"
        right="12px"
        zIndex="10"
        px="10px"
        py="5px"
        borderRadius="full"
        bg="blackAlpha.600"
        sx={{ backdropFilter: 'blur(4px)' }}
      >
        <Text
          fontFamily='"Poppins", sans-serif'
          fontSize="0.62rem"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="green.300"
        >
          Ver perfil
        </Text>
      </Box>
    </Box>
  )
}

// ── ConsultorioFBI ────────────────────────────────────────────────────────
function ConsultorioFBI({ theme }) {
  const [activeTab, setActiveTab]                       = useState('nutricionistas')
  const [panelKey, setPanelKey]                         = useState(0)
  const [selectedProfessional, setSelectedProfessional] = useState(null)

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    setPanelKey((k) => k + 1)
  }

  const activeIndex          = TABS.findIndex((t) => t.key === activeTab)
  const currentProfessionals = PROFESSIONALS[activeTab]
  const isNutri              = activeTab === 'nutricionistas'

  const indicatorLeft = `${activeIndex * (100 / 3)}%`

  const isDark      = theme === 'dark'
  const tabBorder   = isDark ? 'whiteAlpha.200' : 'gray.200'
  const tabInactive = isDark ? 'whiteAlpha.500' : 'gray.400'

  return (
    <Flex justifyContent="center" flexDir="column" alignItems="center">
      {/* ── Hero ── */}
      <Box
        w="100%"
        minH={['100px', '180px', '240px']}
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        px={['24px', '48px', '80px']}
        py={['28px', '44px']}
        overflow="hidden"
      >
        <Box position="relative">
          <Box
            position="absolute"
            left="-20px"
            top="8%"
            bottom="8%"
            w="3px"
            bg="green.400"
            borderRadius="full"
          />
          <Heading
            as="h1"
            fontFamily='"Playfair Display", serif'
            fontSize={['clamp(1.8rem, 8vw, 3rem)', 'clamp(2.5rem, 6vw, 5rem)', '6vw']}
            fontWeight="900"
            lineHeight="1.05"
            letterSpacing="-0.02em"
            color="black"
            _dark={{ color: 'white' }}
            whiteSpace="nowrap"
          >
            Consultorio{' '}
            <Box as="span" color="green.400">FBI</Box>
          </Heading>
          <Text
            mt={['6px', '10px']}
            fontFamily='"Poppins", sans-serif'
            fontSize={['0.65rem', '0.85rem', '1rem']}
            fontWeight="400"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="gray.500"
          >
            Nutrición · Kinesiología · Osteopatía
          </Text>
        </Box>
      </Box>

      {/* ── Tabs + Cards ── */}
      <Box w="90%" mb="60px">
        {/* Label + descripción */}
        <Flex alignItems="center" gap="12px" mb="10px">
          <Box w="28px" h="2px" bg="green.400" borderRadius="full" flexShrink={0} />
          <Text
            fontFamily='"Poppins", sans-serif'
            fontSize={['0.7rem', '0.8rem']}
            fontWeight="400"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="gray.500"
          >
            Nuestros profesionales
          </Text>
        </Flex>
        <Text
          fontFamily='"Poppins", sans-serif'
          fontSize={['0.82rem', '0.92rem']}
          color="gray.500"
          _dark={{ color: 'whiteAlpha.600' }}
          lineHeight="1.7"
          mb={['20px', '28px']}
          maxW="640px"
        >
          Acá encontrás a todos los profesionales que trabajan día a día junto a Fuerza Base Integral, acompañando a cada persona desde su área de especialidad.
        </Text>

        {/* Tab bar */}
        <Box position="relative" mb={['24px', '36px']}>
          <Flex borderBottom="1px solid" borderColor={tabBorder}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab
              return (
                <Box
                  key={tab.key}
                  flex="1"
                  py={['10px', '14px']}
                  textAlign="center"
                  cursor="pointer"
                  onClick={() => handleTabChange(tab.key)}
                  userSelect="none"
                >
                  <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize={['0.65rem', '0.78rem', '0.88rem']}
                    fontWeight={isActive ? '700' : '500'}
                    letterSpacing="0.08em"
                    textTransform="uppercase"
                    color={isActive ? 'green.400' : tabInactive}
                    sx={{ transition: 'color 0.25s ease' }}
                  >
                    {tab.label}
                  </Text>
                </Box>
              )
            })}
          </Flex>

          {/* Sliding indicator */}
          <Box
            position="absolute"
            bottom="-1px"
            h="2px"
            bg="green.400"
            borderRadius="full"
            w={`${100 / 3}%`}
            sx={{
              left: indicatorLeft,
              transition: 'left 0.35s cubic-bezier(0.22,1,0.36,1)',
            }}
          />
        </Box>

        {/* Cards grid — key cambia al cambiar tab para re-triggerear animaciones */}
        <Box
          key={panelKey}
          className={isNutri ? 'tab-panel-active nutri-grid' : 'tab-panel-active'}
          display="grid"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}
          gap={['10px', '14px', '16px']}
          /* Para kine/oste (1 card): misma anchura que una card de nutri, centrada */
          maxW={!isNutri ? ['100%', 'calc(50% - 7px)', 'calc(33.33% - 11px)'] : undefined}
          mx={!isNutri ? 'auto' : undefined}
        >
          {currentProfessionals.map((p) => (
            <Box key={p.id} w="100%">
              <ProfessionalCard
                professional={p}
                onClick={() => setSelectedProfessional(p)}
              />
            </Box>
          ))}
        </Box>

        {/* Mobile hint */}
        <Text
          display={['block', 'none']}
          mt="14px"
          fontFamily='"Poppins", sans-serif'
          fontSize="0.68rem"
          letterSpacing="0.15em"
          textTransform="uppercase"
          color="gray.400"
          textAlign="center"
        >
          Tocá una tarjeta para ver el perfil
        </Text>
      </Box>

      {/* Modal */}
      {selectedProfessional && (
        <ProfessionalModal
          professional={selectedProfessional}
          onClose={() => setSelectedProfessional(null)}
        />
      )}
    </Flex>
  )
}

export default ConsultorioFBI
