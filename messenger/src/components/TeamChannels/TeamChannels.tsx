import { useContext, useState, useEffect } from 'react';
import { getChannelById, setChannelToSeen } from '../../services/channels.service';
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar';
import { getTeamChannelsLive, getTeamById } from '../../services/teams.service'
import { Button, Box } from '@chakra-ui/react';
import AppContext, { UserState } from '../../context/AppContext'
import { useNavigate } from "react-router-dom"
import { Team } from '../CreateTeam/CreateTeam'


export interface Id {
  id: string
}

const TeamChannels = ({ id }: Id) => {
  const [channels, setChannels] = useState<Channel[]>([])
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
    generalChannel: '',
  })

  useEffect(() => {

    getTeamChannelsLive(id, (data: string[]) => {
      Promise.all(
        data.map((channelId: string) => {
          return getChannelById(channelId)
        }))
        .then(elChannel => {
          setChannels([...elChannel])
        })
        .catch(e => console.log(e))
    })
  }, [])

  useEffect(() => {
    getTeamById(id)
      .then(res => setTeam(res))
  }, [])

  const handleOpenChannel = (id: string) => {
    if (userData) {
      navigate('/chat', { state: { channelId: id, team: team } })
      setChannelToSeen(id, userData?.handle);
    }
  };

  return (
    <>
      {channels.map((channel: Channel) => {
        let userHasSeen: boolean = false;
        Object.entries(channel.seenBy).map(([key, value]) => {
          if (key === userData?.handle && value === true) userHasSeen = true;
        });

        return (<Box key={channel.id}>
          <Button bg={userHasSeen ? 'green' : 'red'} variant='ghost' onClick={() => handleOpenChannel(channel.id)}>
            {channel.title} ({userHasSeen ? 'seen' : 'not seen'})
          </Button>
        </Box>
        )
      })}
    </>
  )
}

export default TeamChannels;