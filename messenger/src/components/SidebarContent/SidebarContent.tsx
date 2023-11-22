import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import NavItem from '../NavItem/NavItem';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
} from 'react-icons/fi';

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  {name:'Create new chat', icon: FiHome, path: '/create-new-chat'},
];

interface SidebarContentProps {
  onClose: () => void
  display?: object
}

const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { userData } = useContext(AppContext);
  return (
    <Box
      transition='3s ease'
      bg={'blue'}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}>
      <Flex alignItems='center' justify="center">
        <Image alt='logo' w={"150px"} alignItems='center' />
      </Flex>
      <Flex h='20' alignItems='center' mx='4' justifyContent='space-between'>
        <Text fontSize='23' fontFamily='monospace' fontWeight='bold' color={'grey'}>
          COLLAB-MESSANGER
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem key={LinkItems[0].name} icon={LinkItems[0].icon} name={LinkItems[0].name} path={LinkItems[0].path} />
      <NavItem key={LinkItems[1].name} icon={LinkItems[1].icon} name={LinkItems[1].name} path={LinkItems[1].path} />
    </Box >
  );
}

export default SidebarContent;