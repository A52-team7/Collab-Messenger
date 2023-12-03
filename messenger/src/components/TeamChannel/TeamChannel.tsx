import { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import AppContext from '../../context/AppContext';
import { Button } from "@chakra-ui/react";
import { setChannelToSeen, getChannelSeenLive } from '../../services/channels.service';
import { UserState } from '../../context/AppContext';
import { Team } from '../CreateTeam/CreateTeam';

interface TeamChannelProps {
  channelId: string,
  channelTitle: string,
  team: Team
}

const TeamChannel = ({ channelId, channelTitle, team }: TeamChannelProps) => {
  const [userHasSeen, setSeenState] = useState(false);
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();

  const handleOpenChannel = (id: string) => {
    if (userData) {
      navigate('/chat', { state: { channelId: id, team: team } })
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
    <Button bg={userHasSeen ? 'green' : 'red'} variant='ghost' onClick={() => handleOpenChannel(channelId)}>
      {channelTitle} ({userHasSeen ? 'seen' : 'not seen'})
    </Button>
  )
}

export default TeamChannel;