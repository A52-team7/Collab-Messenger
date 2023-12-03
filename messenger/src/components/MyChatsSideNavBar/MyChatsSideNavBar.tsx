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
  seenBy: []
}

interface MyChatsSideNavBarProps {
  onClose: () => void;
}

const MyChatsSideNavBar = ({ onClose }: MyChatsSideNavBarProps) => {

  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [channels, setChannels] = useState<Channel[]>([]);

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

  }, [userData, channels]);



  const onCreate = () => {
    navigate('/new-chat');
  }

  return (
    <Flex direction={'column'}>
      
      <HStack justify="space-between">
          <Heading as='h2' size='lg' textAlign="left">My chats</Heading>
          <Button variant='unstyled' _hover={{ transform: 'scale(1.5)', color: 'inherit' }} onClick={onCreate}><FiPlusSquare size={20} /></Button>
        </HStack>
      <Stack>
        {channels.map((channel: Channel) => (
          <Box onClick={() => onClose()} key={channel.id}>
            <MyChat channel={channel} />
          </Box>
        ))}
      </Stack>
    </Flex>
  )
}


export default MyChatsSideNavBar;