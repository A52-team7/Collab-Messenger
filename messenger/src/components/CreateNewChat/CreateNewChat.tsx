import { Button, Flex, Stack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { addChannel, addMemberToChannel, getChannelById, getUserChannelsLive } from '../../services/channels.service';
import { useContext, useState } from 'react';
import AppContext from '../../context/AppContext';
import { userChannel } from '../../services/users.service';
import MyChatsList from '../MyChatsList/MyChatsList';

export interface Channel {
    id: string;
    title: string;
    creator: string;
    members: [];
    messages: [];
    createdOn: Date;
}

const CreateNewChat = () => {
  
    const {userData} = useContext(AppContext);
    const navigate = useNavigate();

    const [channels, setChannels] = useState<Channel[]>([])
    const [show, setShow] = useState(false);

    const onShow = () => {
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
            })
            setShow(true);
    }
    console.log(channels);
    
    

    const onCreate = () => {
        if(userData === null) return;
        addChannel(userData.handle)
        .then(result => {
            navigate('/chat', { state: { channelId: result.id } });
            userChannel(result.id, userData.handle);
            return addMemberToChannel(result.id, userData.handle);
        })
    }

    return (
        <Flex direction={'column'}>
            <Flex justifyContent={'center'}>
                <Button
                px={8}
                rounded={'md'}
                onClick={onShow}
                >
                My chats
                </Button>
                <Button
                px={8}
                rounded={'md'}
                onClick={onCreate}
                >
                New
                </Button>
            </Flex>
            {show && (
            <Stack>
                 <MyChatsList {...{channels}}/> 
            </Stack>           
            )}
        </Flex>
    )
}


export default CreateNewChat;