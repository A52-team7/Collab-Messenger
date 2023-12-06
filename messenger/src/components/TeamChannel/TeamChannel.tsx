import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../context/AppContext';
import { Box, Text } from "@chakra-ui/react";
import { setChannelToSeen, getChannelSeenLive } from '../../services/channels.service';
import { UserState } from '../../context/AppContext';
import { Team } from '../CreateTeam/CreateTeam';

interface TeamChannelProps {
  channelId: string;
  channelTitle: string;
  team: Team;
  activeBtn: string;
}

const TeamChannel = ({ channelId, channelTitle, team, activeBtn }: TeamChannelProps) => {
  const [userHasSeen, setSeenState] = useState(false);
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();

  const handleOpenChannel = (id: string) => {
    if (userData) {
      navigate(`/chat/${id}`, { state: { team: team } })
      setChannelToSeen(id, userData?.handle);
    }
  };

  useEffect(() => {
    if (!userData) return;
    getChannelSeenLive(channelId, userData?.handle, ((userHasSeen) => {
      userHasSeen ? setSeenState(true) : setSeenState(false);
    }));
  }, []);

  return (
    <Box
      w={'100%'}
      mt={2}
      border={'1px solid'}
      borderColor={'white'}
      borderRadius={'5px'}
      textAlign={'center'}
      fontWeight={'bold'}
      bg={activeBtn === channelId ? 'teal.600' : 'none'}
      _hover={{ cursor: 'pointer', bg: 'teal.600' }}
    >
      <Text
        m={1}
        color={'white'}
        // bg={userHasSeen ? 'green' : 'red'}
        onClick={() => handleOpenChannel(channelId)}>
        {channelTitle} ({userHasSeen ? 'seen' : 'not seen'})
      </Text>
    </Box>
  )
}

export default TeamChannel;