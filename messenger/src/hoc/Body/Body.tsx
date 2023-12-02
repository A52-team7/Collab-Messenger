import { Box, Drawer, DrawerContent, useDisclosure } from '@chakra-ui/react';
import SidebarContent from '../../components/SidebarContent/SidebarContent';
import MobileNav from '../../components/MobileNav/MobileNav';
import { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode
}

const Body = ({ children }: BodyProps): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH='100vh' bg={'lightBlue'}>
      <SidebarContent onClose={() => onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}>
        <DrawerContent maxW={'210px'}>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Box opacity={isOpen ? 0.1 : 1}>
        <MobileNav onOpen={onOpen} />
        <Box ml={{ base: 0, md: 80 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Body;