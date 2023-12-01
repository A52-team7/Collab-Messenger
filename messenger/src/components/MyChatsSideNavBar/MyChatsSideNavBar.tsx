import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { getChannelById } from '../../services/channels.service';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { getUserChannelsLive } from '../../services/users.service';
import MyChat from '../MyChat/MyChat';

export interface Channel {
  id: string;
  title: string;
  creator: string;
  members: [];
  messages: [];
  createdOn: Date;
  seenBy: []
}

const MyChatsSideNavBar = () => {

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

  }, [userData]);



  const onCreate = () => {
    navigate('/new-chat');
  }

  return (
    <Flex direction={'column'}>
      <Flex justifyContent={'center'}>
        <Text>
          My chats
        </Text>
        <Button
          px={8}
          rounded={'md'}
          onClick={onCreate}
        >
          New
        </Button>
      </Flex>
      <Stack>
        {channels.map((channel: Channel) => (
          <Box key={channel.id}>
            <MyChat {...channel} />
          </Box>
        ))}
      </Stack>
    </Flex>
  )
}


export default MyChatsSideNavBar;