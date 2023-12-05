import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext from '../../context/AppContext';
// import NavItem from '../NavItem/NavItem';
import {
  Box,
  Flex,
  Button,
  CloseButton,
  useColorModeValue,
  Heading,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
} from 'react-icons/fi';
import { BsChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { SIDEBAR_SHOW_MESSAGES, SIDEBAR_SHOW_TEAMS } from '../../common/constants';


import UserTeams from '../UserTeams/UserTeams'
import MyChatsSideNavBar from '../MyChatsSideNavBar/MyChatsSideNavBar';

// const LinkItems = [
//   { name: 'Home', icon: FiHome, path: '/' },
//   { name: 'Team', icon: FiHome, path: '/new-team' },
//   { name: 'Create new chat', icon: FiHome, path: '/create-new-chat' },
// ];

interface SidebarContentProps {
  onClose: () => void
  display?: object
}

const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { user } = useContext(AppContext);
  const [show, setShow] = useState(SIDEBAR_SHOW_MESSAGES);
  const [activeBtn, setActiveBtn] = useState('messages-btn');
  const navigate = useNavigate();

  const showContentHandle = (e: React.MouseEvent<HTMLElement>) => {
    const targetId = e.currentTarget.id;
    if (targetId === 'home-btn') {
      navigate('/');
    } else {
      setShow(targetId === 'messages-btn' ? SIDEBAR_SHOW_MESSAGES : SIDEBAR_SHOW_TEAMS);
    }
    setActiveBtn(targetId);
  }

  return (
    <Box
      transition={'3s ease'}
      bg={'RGB(29, 29, 29)'}
      borderRight={'1px'}
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: '220px', md: 80 }}
      pos={'fixed'}
      h={'full'}
      {...rest}>
      <Box position={'absolute'} right={0}>
        <CloseButton display={{ md: 'none' }} onClick={onClose} />
      </Box>
      <Flex
        w={'100%'}
        alignItems={'center'}
        justifyContent={'center'}>
        <Image
          _hover={{ cursor: 'pointer' }}
          src={'/logo-removebg-preview.png'}
          alt={'logo'}
          boxSize='125px'
          borderRadius="full"
          id={'home-btn'}
          onClick={(e) => showContentHandle(e)} />
      </Flex>
      {user &&
        <>
          <Flex alignItems='center' justifyContent={'space-around'}>
            <Box>
              <Button borderRadius={'50%'} px={3} py={6}
                id={'messages-btn'}
                bg={activeBtn === 'messages-btn' ? 'green.300' : 'gray.100'}
                _hover={{ opacity: 0.5 }}
                onClick={(e) => showContentHandle(e)}>
                <BsChatTextFill size={30} />
              </Button>
              <FormLabel color={'white'} htmlFor={'messages-btn'}>CHATS</FormLabel>
            </Box>
            <Box>
              <Button borderRadius={'50%'} px={3} py={6}
                id={'teams-btn'}
                bg={activeBtn === 'teams-btn' ? 'green.300' : 'gray.100'}
                _hover={{ opacity: 0.5 }}
                onClick={(e) => showContentHandle(e)}>
                <RiTeamFill size={30} />
              </Button>
              <FormLabel color={'white'} htmlFor={'teams-btn'}>TEAMS</FormLabel>
            </Box>
          </Flex>
          <Box minW={'210px'}>
            {show === SIDEBAR_SHOW_MESSAGES ?
              <MyChatsSideNavBar onClose={onClose} />
              :
              <UserTeams onClose={onClose} />
            }
          </Box>
        </>}
    </Box >
  );
}

export default SidebarContent;