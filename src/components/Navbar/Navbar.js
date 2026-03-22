import { Flex, Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarMenu from './SidebarMenu';
import CircularText from './CircularText';

const AnimatedThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <Box 
      as="button" 
      onClick={toggleTheme} 
      position="relative" 
      w="45px" 
      h="45px" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      borderRadius="full"
      bg={theme === 'light' ? 'gray.100' : 'gray.800'}
      color={theme === 'light' ? '#f59e0b' : '#fbbf24'}
      _hover={{ bg: theme === 'light' ? 'gray.200' : 'gray.700', transform: 'scale(1.05)' }}
      transition="all 0.3s ease"
      overflow="hidden"
      boxShadow="sm"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ y: -30, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ y: -30, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

function Navbar({toggleTheme, theme, userData}) {
    //<Image src={logo2} alt='logo de fuerza integral' w='10rem' h='8rem' marginLeft={['0','20px','20px']} objectFit='cover' />
    return (
        <Flex
            flexDir='row'
            justify='space-between'
            alignItems='center'
            flexWrap='nowrap'
            mb='40px'
            px={['10px', '20px', '20px']}
            py='10px'
            w='100%'
            >
            <CircularText
                theme={theme}
                text="FUERZA*BASE*INTEGRAL*"
                onHover="speedUp"
                spinDuration={20}
                className="custom-class"
            />
            <Flex
                marginRight={['0','20px','20px']}
                alignItems='center'
                columnGap={['15px', '25px', '25px']}
                >
                <AnimatedThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <SidebarMenu theme={theme} userData={userData}/>
            </Flex>
        </Flex>
    )
}

export default Navbar