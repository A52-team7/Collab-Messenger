import { Button, Flex, Stack, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { addChannel, addMemberToChannel, addTitleToChannel, getChannelById } from '../../services/channels.service';
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { getUserChannelsLive, userChannel } from '../../services/users.service';
import MyChatsList from '../MyChatsList/MyChatsList';

export interface Channel {
    id: string;
    title: string;
    creator: string;
    members: [];
    messages: [];
    createdOn: Date;
}

const MyChatsSideNavBar = () => {
  
    const {userData} = useContext(AppContext);
    const navigate = useNavigate();

    const [channels, setChannels] = useState<Channel[]>([]);

    useEffect(() => {
        if(userData === null) return;
   
        getUserChannelsLive(userData.handle, (data: string[]) => {
            console.log(data, "data")
            Promise.all(
             data.map((id: string) => {
              return getChannelById(id)
              .then(res => res)
              .catch(e =>console.error(e));
             })
             ).then(channelMessages => {
                setChannels([...channelMessages]);          
            })
            .catch(error => console.error(error.message));
            });
            console.log(channels);
            
    }, [userData]);
    console.log(channels);
    
    

    const onCreate = () => {
        navigate('/new-chat' );
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
                 <MyChatsList {...{channels}}/> 
            </Stack>           
        </Flex>
    )
}


export default MyChatsSideNavBar;