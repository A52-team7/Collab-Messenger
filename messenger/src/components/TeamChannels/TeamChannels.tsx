import { useState, useEffect } from 'react';
import { getChannelById } from '../../services/channels.service';
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar';
import { getTeamChannelsLive, getTeamById } from '../../services/teams.service';
import TeamChannel from '../TeamChannel/TeamChannel';
import { Box } from '@chakra-ui/react';
import { Team } from '../CreateTeam/CreateTeam';


export interface Id {
  id: string
}

const TeamChannels = ({ id }: Id) => {
  const [channels, setChannels] = useState<Channel[]>([])

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

  return channels.map((channel: Channel) => <Box key={channel.id}>
    <TeamChannel channelId={channel.id} channelTitle={channel.title} team={team} />
  </Box>)
}

export default TeamChannels;