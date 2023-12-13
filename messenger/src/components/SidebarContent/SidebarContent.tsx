import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import {
  Box,
  Flex,
  Button,
  CloseButton,
  useColorModeValue,
  FormLabel,
  Image,
} from '@chakra-ui/react';
import { BsChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";
import { SIDEBAR_SHOW_MESSAGES, SIDEBAR_SHOW_TEAMS } from '../../common/constants';
import UserTeams from '../UserTeams/UserTeams'
import MyChatsSideNavBar from '../MyChatsSideNavBar/MyChatsSideNavBar';
import CalendarBtn from '../CalendarBtn/CalendarBtn';

interface SidebarContentProps {
  onClose: () => void
  display?: object
}

// interface unseenChatTeamBtnState {
//   chats: boolean;
//   teams: boolean;
// }


const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { user, userData } = useContext(AppContext);
  const [activeBtn, setActiveBtn] = useState(() => {
    const storedValue = window.localStorage.getItem('activeBtn');
    return (storedValue && storedValue !== "undefined") ? storedValue : 'messages-btn';
  });

  const [show, setShow] = useState(activeBtn === 'messages-btn' ? SIDEBAR_SHOW_MESSAGES : SIDEBAR_SHOW_TEAMS);
  // const [unseenChatTeamBtn, setUnseenChatTeamBtn] = useState<unseenChatTeamBtnState>({ chats: false, teams: false });

  useEffect(() => {
    if (activeBtn !== undefined) {
      window.localStorage.setItem('activeBtn', activeBtn);
    }
  }, [activeBtn]);

  const navigate = useNavigate();

  const showContentHandle = (e: React.MouseEvent<HTMLElement>) => {
    if (userData) {
      const targetId = e.currentTarget.id;
      if (targetId === 'home-btn') {
        navigate('/');
      } else {
        // if (targetId === 'messages-btn') {
        //   updateUserData(userData.handle, 'unseen/chats', false);
        // } else {
        //   updateUserData(userData.handle, 'unseen/teams', false);
        // }
        setShow(targetId === 'messages-btn' ? SIDEBAR_SHOW_MESSAGES : SIDEBAR_SHOW_TEAMS);
        setActiveBtn(targetId);
        window.localStorage.setItem('activeBtn', targetId);
      }
    }
  }

  // useEffect(() => {
  //   if (userData) {
  //     unseenTeamsChats(userData?.handle, (data) => {
  //       setUnseenChatTeamBtn({
  //         chats: data.chats,
  //         teams: data.teams
  //       });
  //       if (activeBtn === 'messages-btn') {
  //         console.log(activeBtn);
  //         updateUserData(userData.handle, 'unseen/chats', false)
  //       } else {
  //         console.log('second!');
  //         updateUserData(userData.handle, 'unseen/teams', false)
  //       }
  //     });
  //   }
  // }, []);

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
          src={'/final_logo.jpg'}
          alt={'logo'}
          boxSize='125px'
          borderRadius="full"
          id={'home-btn'}
          onClick={(e) => showContentHandle(e)} />
      </Flex>
      {user &&
        <>
          <Flex alignItems='center' justifyContent={'space-around'} mt={5} mb={5}>
            <Box>
              <Button position={'relative'} borderRadius={'50%'} px={3} py={6}
                id={'messages-btn'}
                bg={activeBtn === 'messages-btn' ? 'rgb(72,161,159)' : 'gray.100'}
                _hover={{ opacity: 0.5 }}
                onClick={(e) => showContentHandle(e)}>
                <BsChatTextFill size={30} />
                {/* {unseenChatTeamBtn.chats && <Box
                  top={-1}
                  right={-4}
                  position={'absolute'}>
                  <FaExclamationCircle size={25} color={'yellow'} />
                </Box>} */}
              </Button>
              <FormLabel mr={0} color={'white'} htmlFor={'messages-btn'}>CHATS</FormLabel>
            </Box>

            <CalendarBtn />

            <Box>
              <Button position={'relative'} borderRadius={'50%'} px={3} py={6}
                id={'teams-btn'}
                bg={activeBtn === 'teams-btn' ? 'rgb(72,161,159)' : 'gray.100'}
                _hover={{ opacity: 0.5 }}
                onClick={(e) => showContentHandle(e)}>
                <RiTeamFill size={30} />
                {/* {unseenChatTeamBtn.teams &&
                  <Box
                    top={-1}
                    right={-4}
                    position={'absolute'}>
                    <FaExclamationCircle size={25} color={'yellow'} />
                  </Box>} */}
              </Button>
              <FormLabel mr={0} color={'white'} htmlFor={'teams-btn'}>TEAMS</FormLabel>
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