import { Box, Button, Flex, Stack, HStack, Heading, Center, Divider } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom';
import { getChannelById } from '../../services/channels.service';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { getUserByHandle, getUserChannelsLive } from '../../services/users.service';
import MyChat from '../MyChat/MyChat';
import { FiPlusSquare } from "react-icons/fi";

export interface Channel {
  id: string;
  title: string;
  creator: string;
  members: [];
  messages: [];
  createdOn: Date;
  seenBy: [];
  isBetweenTwo?: boolean;
}

interface MyChatsSideNavBarProps {
  onClose: () => void;
}

const MyChatsSideNavBar = ({ onClose }: MyChatsSideNavBarProps) => {
  const { userData } = useContext(AppContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeBtn, setActiveBtn] = useState('');
  const navigate = useNavigate();

  const [hasMyNotes, setHasMyNotes] = useState(false);
  const [myNotes, setMyNotes] = useState<Channel>();

  const location = useLocation();

  const handleActiveBtn = (chanelId: string) => {
    window.localStorage.setItem('chatsActiveBtn', chanelId);
    window.localStorage.removeItem('teamsActiveBtn');
    setActiveBtn(chanelId);
  }

  useEffect(() => {
    const pathArray = location.pathname.split('/');

    if (pathArray[1] !== 'chat' && pathArray[1] !== 'video') {
      window.localStorage.removeItem('chatsActiveBtn');
      setActiveBtn('');
    }
  }, [location]);

  useEffect(() => {
    const activeFromLS = window.localStorage.getItem('chatsActiveBtn');
    if (activeFromLS) {
      setActiveBtn(activeFromLS);
    }
  }, [activeBtn]);


  useEffect(() => {
    if (userData === null) return;
    getUserByHandle(userData?.handle)
      .then((result) => {
        setHasMyNotes(Object.keys(result.val()).includes('myNotes'));
        getChannelById(result.val().myNotes)
          .then((res) => setMyNotes(res))
          .catch(e => console.error(e));
      })
      .catch(e => console.error(e));
  }, []);


  useEffect(() => {
    if (userData === null) return;

    getUserChannelsLive(userData.handle, (data: string[]) => {
      Promise.all(
        data.map((id: string) => {
          return getChannelById(id)
            .then(res => res)
            .catch(e => console.error(e));
        })
      ).then(userChannels => {
        const onlyUserChats = userChannels.filter(channel => !Object.keys(channel).includes('toTeam'));
        setChannels([...onlyUserChats]);
      })
        .catch(error => console.error(error.message));
    });

  }, [userData]);



  const onCreate = () => {
    navigate('/new-chat');
  }

  return (
    <Flex direction={'column'} justifyContent={'center'}>

      <Flex justify={'center'}>
        <HStack w={'80%'} justify="space-between">
          <Heading as={'h2'} size={'lg'} color={'white'}>My chats</Heading>
          <Button variant='unstyled' color={'white'} _hover={{ transform: 'scale(1.3)', color: 'white' }} onClick={onCreate}><FiPlusSquare size={20} /></Button>
        </HStack>
      </Flex>

      {hasMyNotes && myNotes &&
        <>
          <Box>
            <Center>
              <MyChat channel={myNotes} activeBtn={activeBtn} />
            </Center>
          </Box>
          <Divider mt={5} />
        </>
      }
      <Stack
        w={'inherit'}
        maxH={'40vh'}
        mt={5}
        overflowY="auto"
        css={{
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'black',
            borderRadius: '24px',
          },
        }}
      >
        {channels.map((channel: Channel) => (
          <Flex
            key={channel.id}
            justifyContent={'center'}
            onClick={() => {
              handleActiveBtn(channel.id);
              onClose();
            }} >
            <MyChat channel={channel} activeBtn={activeBtn} />
          </Flex>
        ))}
      </Stack>
    </Flex>
  )
}


export default MyChatsSideNavBar;