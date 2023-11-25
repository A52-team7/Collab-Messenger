import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom';
import { userChannel} from '../../services/users.service';
import { addChannel, addMemberToChannel, addTitleToChannel } from '../../services/channels.service';
import { useState } from 'react';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS, TITLE_NAME_LENGTH_MAX, TITLE_NAME_LENGTH_MIN } from '../../common/constants';
import { useContext } from 'react';
import AppContext, { UserState } from '../../context/AppContext';
  

  
  interface ChannelForm {
    title: string;
    members: {[handle:string]: boolean};
  }
  
  const NewChat = (): JSX.Element => {
    
//   const location = useLocation();

//   const channelId = location.state?.channelId;

  const navigate = useNavigate();

  const { userData } = useContext<UserState>(AppContext);
 
  const [channelForm, setChannelForm] = useState<ChannelForm>({title: '', members: {}});



  const updateNewMember = (user: string) => {
    const newMembers = { ...channelForm.members };
    newMembers[user] = true;
    setChannelForm({
      ...channelForm,
      members: newMembers
    })
  }

  const updateTitle = (title: string) => (e: React.ChangeEvent<HTMLInputElement>) =>{
    setChannelForm({
        ...channelForm,
        [title]: e.target.value,
    })
  }

  const onAddNewChannel = () => {
    if(userData === null) return;
    if (channelForm.title.length < TITLE_NAME_LENGTH_MIN || channelForm.title.length > TITLE_NAME_LENGTH_MAX) {
        return alert(`Channel name must be between ${TITLE_NAME_LENGTH_MIN} and ${TITLE_NAME_LENGTH_MAX} characters!`)
    }
    addChannel(userData.handle, channelForm.title, channelForm.members)
        .then(result => {
            Object.keys(result.members).forEach(member => {
                userChannel(result.id, member);
            })
            userChannel(result.id, userData.handle);
            addMemberToChannel(result.id, userData.handle);
            return result;
        })
        .then(res => {
            navigate('/chat', { state: { channelId: res.id } });
        })
        .catch(e => console.log(e));
        
  }



      return (
          <Flex
            align={'center'}
            direction={'column'}
            justify={'center'}
            py={12}>
                            
            <Flex 
            direction={'column'}
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              align={'center'}>
                <Input
                  bg={'grey'}
                  placeholder="Add title" 
                  onChange={updateTitle('title')}/>
              <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember}/>
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onAddNewChannel}>
                  Add
                </Button>
            </Flex>
            <Stack>
                     
            </Stack>
        
          </Flex>
        )
  }
  
  export default NewChat;