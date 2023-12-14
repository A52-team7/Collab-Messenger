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
import { HamburgerIcon } from '@chakra-ui/icons';
import SearchUsers from '../SearchUsers/SearchUsers';
import { START_CHAT } from '../../common/constants';
import UserStatus from '../UserStatus/UserStatus';

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
      ml={{ base: 0, md: 80 }}
      px={{ base: 4, md: 0 }}
      height={'14'}
      alignItems='center'
      bg={'RGB(29, 29, 29)'}
      borderBottomWidth='1px'
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'space-between', lg: 'space-between' }}
      {...rest}>
      <IconButton
        mr={1}
        color={'white'}
        _hover={{ color: 'black', backgroundColor: 'gray.300' }}
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant='outline'
        aria-label='open menu'
        icon={<HamburgerIcon />}
      />

      <Box m={'auto'} w={{ base: '100%', md: '100%', lg: '100%' }}>
        <Box ml={{ base: 1, md: 1, lg: 1 }}>
          <SearchUsers searchType={START_CHAT} />
        </Box>
      </Box>

      <HStack spacing={{ base: '0', md: '6' }}>
        <Flex alignItems={'center'} >
          <Menu>
            {userData ?
              (<HStack>
                <Avatar
                  size={'md'}
                  src={userData.profilePhoto} >
                  <UserStatus />
                </Avatar>
                <MenuButton ml={5} pr={{ base: 0, md: 0, lg: 4 }} transition='all 0.3s' _focus={{ boxShadow: 'none' }}>
                  <Flex
                    display={{ base: 'none', md: 'flex' }}
                    alignItems='flex-start'
                    spacing='1px'>
                    <Text fontSize='sm' color={'grey'} ml={-3} mr={1}>{userData.handle}</Text>
                    {/* <Text fontSize='xs' color={'grey'}>
                    </Text> */}
                    <Box display={{ base: 'none', md: 'flex' }} mt={1}>
                      <FiChevronDown color={'grey'} />
                    </Box>
                  </Flex>
                </MenuButton>
              </HStack>)
              :
              <TopNavLinks links={LinksUserOptions} />
            }
            <MenuList
              zIndex={99}
              color="white"
              bg={"RGB(59, 59, 59)"}
              borderColor={"RGB(59, 59, 59)"}>
              <MenuItem 
              bg={"RGB(59, 59, 59)"}
              _hover={{opacity: '0.8'}}
               onClick={() => navigate('/user-details')}>Profile</MenuItem>
              <MenuDivider borderColor={'gray'} />
              <MenuItem 
              bg={"RGB(59, 59, 59)"} 
              _hover={{opacity: '0.8'}}
              onClick={onLogout}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}

export default MobileNav;