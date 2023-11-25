import { useState, useContext } from 'react';
import AppContext from '../../context/AppContext';
import NavItem from '../NavItem/NavItem';
import {
  Box,
  Flex,
  Button,
  CloseButton,
  useColorModeValue,
  Heading,
  FormLabel,
  Center
} from '@chakra-ui/react';
import {
  FiHome,
} from 'react-icons/fi';
import { BsChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { SIDEBAR_SHOW_MESSAGES, SIDEBAR_SHOW_TEAMS } from '../../common/constants';


import UserTeams from '../UserTeams/UserTeams'
import MyChatsSideNavBar from '../MyChatsSideNavBar/MyChatsSideNavBar';
import { useNavigate } from 'react-router-dom';

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Team', icon: FiHome, path: '/new-team' },
  { name: 'Create new chat', icon: FiHome, path: '/create-new-chat' },
];

interface SidebarContentProps {
  onClose: () => void
  display?: object
}

const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { user } = useContext(AppContext);
  const [show, setShow] = useState(SIDEBAR_SHOW_TEAMS);
  const navigate = useNavigate();

  const showContentHandle = (e: React.MouseEvent<HTMLElement>) => {
    const targetId = e.currentTarget.id;
    setShow(targetId === 'messages-btn' ? SIDEBAR_SHOW_MESSAGES : SIDEBAR_SHOW_TEAMS);
  }

  return (
    <Box
      transition={'3s ease'}
      bg={'blue'}
      borderRight={'1px'}
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'fit-content', md: 60 }}
      pos={'fixed'}
      h={'full'}
      {...rest}>
      <Box position={'absolute'} right={0}>
        <CloseButton display={{ md: 'none' }} onClick={onClose} />
      </Box>
      <Flex alignItems={'center'} justifyContent={'flex-end'}>
        <Heading textAlign={'center'} fontSize={24}>COLLAB-MESSENGER</Heading>
      </Flex>
      {user &&
        <>
          <Flex mt={{ base: 5, md: 5 }} alignItems='center' justifyContent={'space-around'}>
            <Box
              cursor={'pointer'}
              onClick={() => navigate('/')}>
              <Button px={3} py={6}>
                <FiHome size={30} />
              </Button>
              <FormLabel textAlign={'center'}>HOME</FormLabel>
            </Box>
          </Flex>
          <Flex alignItems='center' justifyContent={'space-around'}>
            <Box>
              <Button borderRadius={'50%'} px={3} py={6}
                id={'messages-btn'}
                onClick={(e) => showContentHandle(e)}>
                <BsChatTextFill size={30} />
              </Button>
              <FormLabel>CHATS</FormLabel>
            </Box>
            <Box>
              <Button rounded={'xl'} px={3} py={6}
                id={'teams-btn'}
                onClick={(e) => showContentHandle(e)}>
                <RiTeamFill size={30} />
              </Button>
              <FormLabel>TEAMS</FormLabel>
            </Box>
          </Flex>
          <Box minW={'210px'}>
            {/* <NavItem key={LinkItems[0].name} icon={LinkItems[0].icon} name={LinkItems[0].name} path={LinkItems[0].path} /> */}
            {show === SIDEBAR_SHOW_MESSAGES ?
              <MyChatsSideNavBar />
              :
              <UserTeams />
            }
          </Box>
        </>}
    </Box >
  );
}

export default SidebarContent;