import { useContext, useState,useEffect } from 'react';
import {getChannelById} from '../../services/channels.service';
import {Channel} from '../MyChatsSideNavBar/MyChatsSideNavBar';
import {getTeamChannelsLive, getTeamById} from '../../services/teams.service'
import {Button, Box} from '@chakra-ui/react';
import AppContext, {UserState} from '../../context/AppContext'
import { useNavigate } from "react-router-dom"
import {Team} from '../CreateTeam/CreateTeam'


export interface Id{
    id:string
  }

const TeamChannels = ({id}: Id) =>{
    const [channels, setChannels] = useState<Channel[]>([])
    const { userData } = useContext<UserState>(AppContext);
    const navigate = useNavigate();
    const [team,setTeam] = useState<Team>({  
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
    generalChannel:'',})

    useEffect(() => {

        getTeamChannelsLive(id, (data: string[]) => {
            Promise.all(
            data.map((channelId: string) =>{
            return getChannelById(channelId)      
             } ))
            .then(elChannel => {
               setChannels([...elChannel])
            })
            .catch(e => console.log(e))
        })
        },[])

    useEffect(() => {
        getTeamById(id)
        .then(res => setTeam(res))
    },[])
        
       
    return (
        <>
        {channels.map((channel: Channel) => {
        return (<Box key={channel.id}>
        <Button variant='ghost' onClick={() => {navigate('/chat', { state: { channelId: channel.id, team: team } })}}>
        {channel.title} 
        </Button>
        </Box>
        )})}
        </>
    )
}

export default TeamChannels;