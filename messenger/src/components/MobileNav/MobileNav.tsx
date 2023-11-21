import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import AppContext from '../../context/AppContext';
import TopNavLinks from '../../views/TopNavLinks/TopNavLinks';
import {
  Box,
  HStack,
  Menu,
  MenuList,
  MenuDivider,
  MenuItem,
  MenuButton,
  Avatar,
  VStack,
  Flex,
  IconButton,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiChevronDown,
} from 'react-icons/fi';
import { HamburgerIcon } from '@chakra-ui/icons'
import Search from '../Search/Search';

interface LinksUserOptionsType {
  name: string,
  path: string
}

const LinksUserOptions: LinksUserOptionsType[] = [
  { name: 'Register', path: '/register' },
  { name: 'Login', path: '/login' }
];

interface MobileNavProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileNavProps) => {
  const { userData, setContext } = useContext(AppContext);
  const navigate = useNavigate();
  const onLogout = () => {
    logoutUser()
      .then(() => {
        setContext(prevState => ({
          ...prevState,
          user: null,
          userData: null,
        }));
      })
      .catch((e: Error) => {
        console.error(e.message);
      })
      .finally(() => navigate('/'));
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 0 }}
      height='20'
      alignItems='center'
      bg={'darkBlue'}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'space-between', lg: 'space-between' }}
      {...rest}>
      <IconButton
        color={'white'}
        _hover={{ color: 'black', backgroundColor: 'gray.300' }}
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='outline'
        aria-label='open menu'
        icon={<HamburgerIcon />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        mx={3}
        color={'grey'}
        fontSize='2xl'
        fontFamily='monospace'
        fontWeight='bold'>
        Bookworm&apos;s Sanctuary
      </Text>

      <Box m={'auto'} w={{ base: '100%', md: '100%', lg: '80%' }}>
        <Box ml={{ base: 0, md: 10, lg: 5 }}>
          <Search />
        </Box>
      </Box>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'} >
          <Menu>
            {userData ?
              <MenuButton ml={5} pr={{ base: 0, md: 0, lg: 8 }} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
                <HStack>
                  <Avatar
                    bg={'white'}
                    size={'lg'}
                    src={userData.profilePhoto} />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems='flex-start'
                    spacing='1px'>
                    <Text fontSize='sm' color={'grey'}>{userData.handle}</Text>
                    <Text fontSize='xs' color={'grey'}>
                    </Text>
                  </VStack>
                  <Box display={{ base: 'none', md: 'flex' }}>
                    <FiChevronDown color={'grey'} />
                  </Box>
                </HStack>
              </MenuButton>
              :
              <TopNavLinks links={LinksUserOptions} />
            }
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={() => navigate('/user-details')}>Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={onLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default MobileNav;