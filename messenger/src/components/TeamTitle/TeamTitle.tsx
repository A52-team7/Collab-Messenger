import { Wrap, Avatar, WrapItem, Box} from '@chakra-ui/react';
import { getTeamTitleLive, getTeamPhotoLive} from '../../services/teams.service';
import { useState, useEffect } from 'react';

interface Id {
    id: string
    teamName: string, 
}

const TeamTitle = ({id, teamName} : Id ) =>{
    const [title,setTitle] = useState<string>(teamName)
    const [teamPhoto, setTeamPhoto] = useState<string>()

    useEffect(() => {
        getTeamTitleLive(id, data =>{
            return setTitle(data)
        })
        getTeamPhotoLive(id, data =>{
            return setTeamPhoto(data)
        })

    },[])

    return (
    <>
        <Wrap>
        <WrapItem>
        <Avatar size='sm' name={title} src={teamPhoto} />{' '}
        </WrapItem>
        </Wrap>
        <Box color={'white'} fontSize="md">{title}</Box>
    </>
    )
} 

export default TeamTitle;