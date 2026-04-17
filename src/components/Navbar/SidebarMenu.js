import React, { useEffect, useState } from 'react';
import {
  Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay,
  useToast, Text, Flex, Spinner
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ProtectedRegisterButton from '../Registro/ProtectedRegisterButton';

// ─── Estilos globales ─────────────────────────────────────────────────────────
const sidebarStyles = `
    @keyframes drawerIn {
        from { opacity: 0; transform: translateX(24px); }
        to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes linkIn {
        from { opacity: 0; transform: translateX(16px); }
        to   { opacity: 1; transform: translateX(0); }
    }

    .sb-link {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.01em;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 6px 0;
        transition: color 0.25s ease, transform 0.25s cubic-bezier(0.22,1,0.36,1);
        cursor: pointer;
        background: none;
        border: none;
        text-align: left;
        width: 100%;
        position: relative;
    }
    .sb-link::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0;
        width: 0;
        height: 2px;
        background: #68D391;
        border-radius: 9999px;
        transition: width 0.3s cubic-bezier(0.22,1,0.36,1);
    }
    .sb-link:hover::after { width: 100%; }
    .sb-link:hover { transform: translateX(6px); }

    .sb-link.light { color: #2D3748; }
    .sb-link.dark  { color: rgba(255,255,255,0.88); }
    .sb-link.light:hover { color: #68D391; }
    .sb-link.dark:hover  { color: #68D391; }

    .sb-link-item {
        animation: linkIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
    }

    .sb-footer-btn {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border-radius: 10px;
        padding: 10px 20px;
        border: 1px solid rgba(104,211,145,0.4);
        transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        white-space: nowrap;
        text-decoration: none;
        display: inline-block;
    }
    .sb-footer-btn.primary {
        background: #68D391;
        color: #1a202c;
        border-color: #68D391;
    }
    .sb-footer-btn.primary:hover {
        background: #4FBF72;
        border-color: #4FBF72;
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(104,211,145,0.35);
    }
    .sb-footer-btn.secondary {
        background: transparent;
    }
    .sb-footer-btn.secondary:hover {
        background: rgba(104,211,145,0.08);
        border-color: #68D391;
        transform: translateY(-2px);
    }
    .sb-footer-btn.danger {
        background: transparent;
        border-color: rgba(252,129,129,0.4);
        color: #FC8181;
    }
    .sb-footer-btn.danger:hover {
        background: rgba(252,129,129,0.08);
        border-color: #FC8181;
        transform: translateY(-2px);
    }
    .sb-footer-btn.ghost {
        background: transparent;
        border-color: rgba(160,174,192,0.3);
    }
    .sb-footer-btn.ghost:hover {
        background: rgba(160,174,192,0.08);
        transform: translateY(-2px);
    }
`

// ─── Hamburger animado ────────────────────────────────────────────────────────
const AnimatedHamburger = ({ isOpen, theme, onClick }) => {
  const color = theme === 'light' ? '#1A202C' : '#F7FAFC'
  return (
    <Box
      onClick={onClick}
      cursor="pointer"
      position="relative"
      w="40px" h="40px" m="5px"
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.1)' }}
    >
      <motion.div
        animate={isOpen ? { rotate: 45, y: 10 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '28px', height: '2.5px', backgroundColor: color, top: '10px', left: '6px', borderRadius: '3px' }}
      />
      <motion.div
        animate={isOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '22px', height: '2.5px', backgroundColor: color, top: '20px', left: '6px', borderRadius: '3px' }}
      />
      <motion.div
        animate={isOpen ? { rotate: -45, y: -10 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '28px', height: '2.5px', backgroundColor: color, top: '30px', left: '6px', borderRadius: '3px' }}
      />
    </Box>
  )
}

// ─── NavLink ──────────────────────────────────────────────────────────────────
const NavLink = ({ to, children, onClick, theme, delay = 0 }) => (
  <div className="sb-link-item" style={{ animationDelay: `${delay}s` }}>
    <RouterLink to={to} onClick={onClick} className={`sb-link ${theme}`}>
      {children}
    </RouterLink>
  </div>
)

const NavButton = ({ onClick, children, theme, delay = 0 }) => (
  <div className="sb-link-item" style={{ animationDelay: `${delay}s` }}>
    <button onClick={onClick} className={`sb-link ${theme}`}>
      {children}
    </button>
  </div>
)

// ─── SidebarMenu ──────────────────────────────────────────────────────────────
function SidebarMenu({ theme, userData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const isDark = theme === 'dark'
  const drawerBg = isDark
    ? 'rgba(10,14,20,0.97)'
    : 'rgba(255,255,255,0.97)'
  const borderC = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(104,211,145,0.15)'
  const textMuted = isDark ? 'rgba(255,255,255,0.35)' : '#A0AEC0'
  const textMain = isDark ? 'rgba(255,255,255,0.88)' : '#2D3748'

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp > Date.now() / 1000) {
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      } catch {
        localStorage.removeItem('token')
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    toast({ title: 'Sesión cerrada', status: 'success', duration: 5000, isClosable: true })
    navigate('/login')
    setIsOpen(false)
  }

  const scrollToFooter = (e) => {
    e.preventDefault()
    setIsOpen(false)
    setTimeout(() => {
      document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const isAdmin = userData?.role === 'admin'

  return (
    <Box>
      <style>{sidebarStyles}</style>

      <AnimatedHamburger isOpen={isOpen} theme={theme} onClick={() => setIsOpen(true)} />

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement="right" size={['full', 'sm']}>
        <DrawerOverlay bg="blackAlpha.500" backdropFilter="blur(8px)" />
        <DrawerContent
          bg={drawerBg}
          backdropFilter="blur(20px)"
          color={textMain}
          display="flex"
          flexDir="column"
          borderLeft="1px solid"
          borderColor={borderC}
          h="100dvh"
          overflowY="hidden"
        >
          {/* ── Header ── */}
          <Box
            px="28px"
            pt="28px"
            pb="20px"
            borderBottom="1px solid"
            borderColor={borderC}
            flexShrink={0}
          >
            {/* Botón cerrar custom */}
            <Flex justifyContent="space-between" alignItems="center" mb="16px">
              <Flex alignItems="center" gap="10px">
                <Box w="20px" h="2px" bg="green.400" borderRadius="full" />
                <Text
                  fontFamily='"Poppins", sans-serif'
                  fontSize="0.65rem"
                  letterSpacing="0.25em"
                  textTransform="uppercase"
                  color={textMuted}
                >
                  Navegación
                </Text>
              </Flex>
              <Box
                onClick={() => setIsOpen(false)}
                cursor="pointer"
                w="32px" h="32px"
                borderRadius="full"
                bg={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                transition="all 0.2s ease"
                _hover={{
                  bg: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                  transform: 'rotate(90deg)'
                }}
              >
                <Text fontSize="0.85rem" color={textMuted} userSelect="none" lineHeight="1">✕</Text>
              </Box>
            </Flex>

            {/* Nombre del usuario si está logueado */}
            {isAuthenticated && userData && (
              <Box>
                <Text
                  fontFamily='"Playfair Display", serif'
                  fontSize="1.3rem"
                  fontWeight="900"
                  color={textMain}
                  lineHeight="1.2"
                  textTransform="capitalize"
                >
                  {userData.username} {userData.userlastname}
                </Text>
                <Flex alignItems="center" gap="6px" mt="4px">
                  <Box w="6px" h="6px" borderRadius="full" bg="green.400" />
                  <Text
                    fontFamily='"Poppins", sans-serif'
                    fontSize="0.68rem"
                    letterSpacing="0.15em"
                    textTransform="uppercase"
                    color="green.400"
                  >
                    {isAdmin ? 'Administrador' : 'Miembro activo'}
                  </Text>
                </Flex>
              </Box>
            )}
          </Box>

          {/* ── Body — Links ── */}
          <DrawerBody px="28px" py="28px" flex="1" overflowY="auto">
            {isAuthenticated ? (
              !userData ? (
                <Flex w="100%" h="50vh" align="center" justify="center" flexDir="column" gap="12px">
                  <Text fontFamily='"Poppins", sans-serif' fontSize="0.82rem" color={textMuted}>
                    Cargando...
                  </Text>
                  <Spinner size="md" color="green.400" thickness="2px" />
                </Flex>
              ) : isAdmin ? (
                <Flex flexDir="column" gap="4px">
                  <NavLink to="/" onClick={() => setIsOpen(false)} theme={theme} delay={0.05}>Home</NavLink>
                  <NavLink to="/calendario" onClick={() => setIsOpen(false)} theme={theme} delay={0.10}>Calendario</NavLink>
                  <NavLink to="/consultoriofbi" onClick={() => setIsOpen(false)} theme={theme} delay={0.15}>Consultorio FBI</NavLink>
                  <NavLink to="/seccionadmin" onClick={() => setIsOpen(false)} theme={theme} delay={0.20}>Admin</NavLink>
                </Flex>
              ) : (
                <Flex flexDir="column" gap="4px">
                  <NavLink to="/" onClick={() => setIsOpen(false)} theme={theme} delay={0.05}>Home</NavLink>
                  <NavLink to="/calendario" onClick={() => setIsOpen(false)} theme={theme} delay={0.10}>Calendario</NavLink>
                  <NavLink to="/consultoriofbi" onClick={() => setIsOpen(false)} theme={theme} delay={0.15}>Consultorio FBI</NavLink>
                  <NavLink to="/pagos" onClick={() => setIsOpen(false)} theme={theme} delay={0.20}>Pagos</NavLink>
                  <NavLink to="/perfil" onClick={() => setIsOpen(false)} theme={theme} delay={0.25}>Perfil</NavLink>
                  <NavButton onClick={scrollToFooter} theme={theme} delay={0.30}>Contactanos</NavButton>
                </Flex>
              )
            ) : (
              <Flex flexDir="column" gap="4px">
                <NavLink to="/" onClick={() => setIsOpen(false)} theme={theme} delay={0.05}>Home</NavLink>
                <NavLink to="/consultoriofbi" onClick={() => setIsOpen(false)} theme={theme} delay={0.10}>Consultorio FBI</NavLink>
                <NavButton onClick={scrollToFooter} theme={theme} delay={0.15}>Contactanos</NavButton>
              </Flex>
            )}
          </DrawerBody>

          {/* ── Footer — Acciones ── */}
          <Box
            px="28px"
            py="20px"
            borderTop="1px solid"
            borderColor={borderC}
            flexShrink={0}
            display="flex"
            flexDir="column"
            gap="10px"
          >
            {isAuthenticated ? (
              <>
                <button
                  className="sb-footer-btn danger"
                  style={{ color: '#FC8181' }}
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
                <button
                  className="sb-footer-btn ghost"
                  style={{ color: textMuted }}
                  onClick={() => setIsOpen(false)}
                >
                  Cerrar menú
                </button>
              </>
            ) : (
              <>
                <RouterLink to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none' }}>
                  <button className="sb-footer-btn primary" style={{ width: '100%' }}>
                    Iniciar sesión
                  </button>
                </RouterLink>

                <Box display={isAuthenticated ? 'none' : 'block'}>
                  <ProtectedRegisterButton onClose1={() => setIsOpen(false)} theme={theme} />
                </Box>

                <button
                  className="sb-footer-btn ghost"
                  style={{ color: textMuted, width: '100%' }}
                  onClick={() => setIsOpen(false)}
                >
                  Cerrar menú
                </button>
              </>
            )}
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default SidebarMenu