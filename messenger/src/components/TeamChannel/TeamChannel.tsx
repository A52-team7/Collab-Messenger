import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../context/AppContext';
import { Flex, Box, Text } from "@chakra-ui/react";
import { setChannelToSeen, getChannelSeenLive } from '../../services/channels.service';
import { UserState } from '../../context/AppContext';
import { Team } from '../CreateTeam/CreateTeam';
import { FaExclamationCircle } from "react-icons/fa";

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
    <Flex
      position={'relative'}
      w={'100%'}
      mt={2}
      border={'1px solid'}
      borderColor={'white'}
      borderRadius={'5px'}
      bg={activeBtn === channelId ? 'teal.600' : 'none'}
      _hover={{ cursor: 'pointer', bg: 'teal.600' }}
    >
      <Text
        p={1}
        textAlign={'center'}
        m={'auto'}
        color={'white'}
        fontWeight={userHasSeen ? '' : 'bold'}
        onClick={() => handleOpenChannel(channelId)}>
        {channelTitle}
      </Text>
      {
        !userHasSeen && <Box
          position={'absolute'}
          top={'-3px'}
          right={'-7px'}
        >
          <FaExclamationCircle size={20} color={'yellow'} />
        </Box>
      }
    </Flex>
  )
}

export default TeamChannel;