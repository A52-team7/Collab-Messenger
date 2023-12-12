import { Box, Button, Flex, Stack, Text, HStack, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { getChannelById } from '../../services/channels.service';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { getUserChannelsLive } from '../../services/users.service';
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

      <Stack
        w={'inherit'}
        maxH={'60vh'}
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
              setActiveBtn(channel.id);
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