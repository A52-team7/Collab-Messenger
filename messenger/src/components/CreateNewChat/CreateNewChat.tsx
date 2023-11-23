import { Button, Flex, useColorModeValue } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import { addChannel, addMemberToChannel } from '../../services/channels.service';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { userChannel } from '../../services/users.service';


const CreateNewChat = () => {
  
    const {userData} = useContext(AppContext);
    const navigate = useNavigate();

    const onCreate = () => {
        addChannel(userData.handle)
        .then(result => {
            navigate('/chat', { state: { channelId: result.id } });
            userChannel(result.id, userData.handle);
            return addMemberToChannel(result.id, userData.handle);
        })
    }

    return (
    <Flex h="100vh" justifyContent="center" alignItems="center">
        <Button
        px={8}
        bg={useColorModeValue('#151f21', 'gray.900')}
        color={'white'}
        rounded={'md'}
        _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
        }}
        onClick={onCreate}
        >
        Create new chat
        </Button>
    </Flex>
    )
}


export default CreateNewChat;