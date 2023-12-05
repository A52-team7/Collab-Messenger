import {
  Flex,
  Stack,
  Input,
  Button,
  FormLabel,
  Select,
  Heading,
  FormControl
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom';
import { userChannel } from '../../services/users.service';
import { addChannel, getAllChannels } from '../../services/channels.service';
import { useState } from 'react';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS, TITLE_NAME_LENGTH_MAX, TITLE_NAME_LENGTH_MIN } from '../../common/constants';
import { useContext } from 'react';
import AppContext, { UserState } from '../../context/AppContext';
import UsersList from '../UsersList/UsersList';
import { updateTeamChannel } from '../../services/teams.service';

interface ChannelForm {
  title: string;
  members: { [handle: string]: boolean };
}


const NewChat = (): JSX.Element => {

  const location = useLocation();

  const team = location.state?.team;

  const navigate = useNavigate();

  const { userData } = useContext<UserState>(AppContext);

  const [channelForm, setChannelForm] = useState<ChannelForm>({ title: '', members: {} });

  const [isPrivate, setIsPrivate] = useState<string>('Private');

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

  const updateTitle = (title: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelForm({
      ...channelForm,
      [title]: e.target.value,
    })
  }

  const onAddNewChannel = () => {
    if (userData === null) return;
    if (!channelForm.title) {
      return alert(`Enter title`)
    }
    if (channelForm.title.length < TITLE_NAME_LENGTH_MIN || channelForm.title.length > TITLE_NAME_LENGTH_MAX) {
      return alert(`Channel name must be between ${TITLE_NAME_LENGTH_MIN} and ${TITLE_NAME_LENGTH_MAX} characters!`)
    }
    if (Object.keys(channelForm.members).length === 0) {
      return alert(`Enter channel members`)
    }
    const members = { ...channelForm.members, [userData.handle]: true };
    if (team) {
      addChannel(userData.handle, channelForm.title, members, team.id)
        .then(result => {
          Object.keys(result.members).forEach(member => {
            userChannel(result.id, member);
          })
          userChannel(result.id, userData.handle);
          if (team.id !== null) {
            updateTeamChannel(team.id, result.id)
          }

          return result;
        })
        .then(res => {
          navigate(`/chat/${res.id}`, { state: { team: team } });
        })
        .catch(e => console.log(e));
    } else {
      getAllChannels()
      .then(allChannels => {
        const onlyChats = allChannels.filter(channel => !Object.keys(channel).includes('toTeam'));
        const existingChat = onlyChats.map(channel => {
          const set1 = new Set(channel.members);
          const set2 = new Set(Object.keys(members));

          const areEqual = set1.size === set2.size && [...set1].every(value => set2.has(value));    
          return areEqual;      
        });

        if(!existingChat.includes(true)){
    
          addChannel(userData.handle, channelForm.title, members)
            .then(result => {
              Object.keys(result.members).forEach(member => {
                userChannel(result.id, member);
              })
              userChannel(result.id, userData.handle);
              return result;
            })
            .then(res => {
              navigate(`/chat/${res.id}`);
            })
            .catch(e => console.log(e));
        }else{
          const index = existingChat.findIndex(el => el === true);
          const chatToNavigate = (onlyChats[index]);
          
          navigate(`/chat/${chatToNavigate.id}`);
        }
      })
      .catch(error => console.error(error.message));
    }
  }

  const privacyChange =(privacyValue: string) =>{
    setChannelForm({...channelForm, members: {}})
    if (privacyValue === 'Standard') {
      setIsPrivate('Standard');
      setChannelForm({...channelForm, members: team.members})
    } else if (privacyValue === 'Private') {
      setIsPrivate('Private');
    }
  }

  return (
    <Flex
      maxH={'fit-content'}
      align={'center'}
      justify={'center'}
      mt={{ base: 2, sm: 5 }}
      bg={'none'}
    // align={'center'}
    // direction={'center'}
    // justify={'center'}
    // py={12}
    // maxW={'600px'}
    >
      
      <Flex
        direction={'column'}
        boxShadow={'2xl'}
        bg={'grey'}
        rounded={'xl'}
        //w={'60vw'}
        p={{ base: 1, sm: 6 }}>
        {team ? (<Heading textAlign={'center'} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }} mb={'4'}>
          Add new channel
        </Heading>) : (<Heading textAlign={'center'} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Add new chat
        </Heading>)}
        <FormControl id="addTitle" isRequired>
        <FormLabel textAlign={'center'}>Add title</FormLabel>
        <Input
          bg={'white'}
          mb={5}
          rounded="md"
          placeholder="Add title"
          onChange={updateTitle('title')} />
          </FormControl>
        <Stack mb={5} w={'500px'}> 
        {team && (<FormControl id="privacy" isRequired><FormLabel textAlign={'center'}>Privacy</FormLabel>
        <Select defaultValue="Private" bg={'white'} onClick={(e: React.MouseEvent<HTMLSelectElement>)=> privacyChange(e.target.value)} >
        <option value='Standard'>Standard-Everyone on the team has access</option>
        <option value='Private'>Private-Specific teammates have access</option>
        </Select>
        </FormControl>)}
        </Stack>  
        {(isPrivate === '' || isPrivate === 'Private') && 
        (<FormControl id="addMembers" isRequired>
          <FormLabel textAlign={'center'}>Add members</FormLabel>
          </FormControl>)}
        <Stack mb={5} w={'500px'}>
          {(team && isPrivate === 'Private') ? 
          (<SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} team={team} />)
           : (team && (isPrivate ==='Standard')) ? null :(<SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} />)}
        </Stack>
        {(isPrivate === 'Private') && (<Stack h={'31vh'}
          overflowY={'scroll'}
        >
        <UsersList members={Object.keys(channelForm.members)} removeChannelMembers={removeChannelMembers} />
        </Stack>)}
        <Stack alignItems={'center'}>
          <Button
            bg={'green.400'}
            maxW={'100px'}
            variant={'primaryButton'} w='full'
            _hover={{ opacity: 0.8 }}
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