import { useState, useEffect } from 'react';
import { getChannelById } from '../../services/channels.service';
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar';
import { useLocation } from 'react-router-dom';
import { getTeamChannelsLive, getTeamById } from '../../services/teams.service';
import TeamChannel from '../TeamChannel/TeamChannel';
import { Box } from '@chakra-ui/react';
import { Team } from '../CreateTeam/CreateTeam';


export interface Id {
  id: string
}

const TeamChannels = ({ id }: Id) => {
  const [channels, setChannels] = useState<Channel[]>([]);

  const [team, setTeam] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
    generalChannel: '',
  });
  const [activeBtn, setActiveBtn] = useState('');
  const location = useLocation();

  const handleActiveBtn = (chanelId: string) => {
    window.localStorage.setItem('teamsActiveBtn', chanelId);
    window.localStorage.removeItem('chatsActiveBtn');
    setActiveBtn(chanelId);
  }

  useEffect(() => {
    const pathArray = location.pathname.split('/');

    if (pathArray[1] !== 'chat' && pathArray[1] !== 'video') {
      window.localStorage.removeItem('teamsActiveBtn');
      setActiveBtn('');
    }
  }, [location]);

  useEffect(() => {
    const activeFromLS = window.localStorage.getItem('teamsActiveBtn');
    if (activeFromLS) {
      setActiveBtn(activeFromLS);
    }
  }, [activeBtn]);

  useEffect(() => {

    getTeamChannelsLive(id, (data: string[]) => {
      Promise.all(
        data.map((channelId: string) => {
          return getChannelById(channelId)
        }))
        .then(elChannel => {
          setChannels([...elChannel])
        })
        .catch(e => console.error(e))
    })
  }, [])

  useEffect(() => {
    getTeamById(id)
      .then(res => setTeam(res))
  }, [])

  return channels.map((channel: Channel) => <Box
    key={channel.id}
    onClick={() => handleActiveBtn(channel.id)}>
    <TeamChannel channelId={channel.id} channelTitle={channel.title} team={team} activeBtn={activeBtn} />
  </Box>)
}

export default TeamChannels;