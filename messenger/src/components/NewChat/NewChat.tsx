import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
    FormLabel,
  } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom';
import { userChannel} from '../../services/users.service';
import { addChannel, addMemberToChannel } from '../../services/channels.service';
import { useState, useEffect } from 'react';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS, TITLE_NAME_LENGTH_MAX, TITLE_NAME_LENGTH_MIN } from '../../common/constants';
import { useContext } from 'react';
import AppContext, { UserState } from '../../context/AppContext';
import UsersList from '../UsersList/UsersList';
import {Team} from '../CreateTeam/CreateTeam';
import { getTeamById, updateTeamChannel } from '../../services/teams.service';
   
  interface ChannelForm {
    title: string;
    members: {[handle:string]: boolean};
  }
 

  const NewChat = (): JSX.Element => {
    
  const location = useLocation();

  const team = location.state?.team;

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

  const removeChannelMembers = (member: string) => {
    const updateMembers = { ...channelForm.members }
    delete updateMembers[member]

    setChannelForm({
      ...channelForm,
      members: updateMembers,
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
    if (!channelForm.title) {
        return alert(`Enter title`)
      }
    if (channelForm.title.length < TITLE_NAME_LENGTH_MIN || channelForm.title.length > TITLE_NAME_LENGTH_MAX) {
        return alert(`Channel name must be between ${TITLE_NAME_LENGTH_MIN} and ${TITLE_NAME_LENGTH_MAX} characters!`)
    }
    if (Object.keys(channelForm.members).length === 0) {
        return alert(`Enter channel members`)
    }
    if(team){
      addChannel(userData.handle, channelForm.title, channelForm.members, team.id)
          .then(result => {
              Object.keys(result.members).forEach(member => {
                  userChannel(result.id, member);
              })
              userChannel(result.id, userData.handle);
              addMemberToChannel(result.id, userData.handle);
              if(team.id !== null){
                updateTeamChannel(team.id, result.id)
              }

              return result;
          })
          .then(res => {
              navigate('/chat', { state: { channelId: res.id, team: team } });
          })
          .catch(e => console.log(e));
    }else{
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
              p={10}>
                <FormLabel>Add title</FormLabel>
                <Input
                  bg={'grey'}
                  mb={5}
                  placeholder="Add title" 
                  onChange={updateTitle('title')}/>
                  <FormLabel>Add members</FormLabel>
                  <Stack mb={5} w={'100%'}>
                    {team ? (
                      <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} team={team}/>
                    ) : (<SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember}/>)}                                       
                  </Stack>
                  <Stack h={'31vh'}
                    overflowY={'scroll'}
                    >
                    <UsersList members={Object.keys(channelForm.members)} removeChannelMembers={removeChannelMembers}/>
                </Stack>
                <Stack w={'100%'} alignItems={'center'}>
                    <Button
                        pl={35}
                        pr={35}
                        bg={'blue'}
                        rounded={'full'}
                        color={'white'}
                        w={'fit-content'}
                        flex={'1 0 auto'}
                        _hover={{ bg: 'blue.500' }}
                        _focus={{ bg: 'blue.500' }}
                        onClick={onAddNewChannel}>
                        Add chat
                    </Button>
                </Stack>
            </Flex>
            <Stack>
                     
            </Stack>
        
          </Flex>
        )
  }
  
  export default NewChat;