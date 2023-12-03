import {
  Flex,
  Stack,
  Input,
  Button,
  useColorModeValue,
  FormLabel,
  Select,
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom';
import { userChannel } from '../../services/users.service';
import { addChannel, addMemberToChannel } from '../../services/channels.service';
import { useState, useEffect } from 'react';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS, TITLE_NAME_LENGTH_MAX, TITLE_NAME_LENGTH_MIN } from '../../common/constants';
import { useContext } from 'react';
import AppContext, { UserState } from '../../context/AppContext';
import UsersList from '../UsersList/UsersList';
import { Team } from '../CreateTeam/CreateTeam';
import { getTeamById, updateTeamChannel } from '../../services/teams.service';

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

  const [isPrivate, setIsPrivate] = useState<string>('Private')

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
      bg={'lightBlue'}
    // align={'center'}
    // direction={'center'}
    // justify={'center'}
    // py={12}
    // maxW={'600px'}
    >

      <Flex

        direction={'column'}
        boxShadow={'2xl'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        //w={'60vw'}
        p={10}>
        <FormLabel>Add title</FormLabel>
        <Input
          bg={'grey'}
          mb={5}
          placeholder="Add title"
          onChange={updateTitle('title')} />
        {team && <FormLabel>Privacy</FormLabel>}
        <Stack mb={5} w={'500px'}> 
        {team &&
        (<Select defaultValue="Private" onClick={(e: React.MouseEvent<HTMLSelectElement>)=> privacyChange(e.target.value)} >
        <option value='Standard'>Standard-Everyone on the team has access</option>
        <option value='Private'>Private-Specific teammates have access</option>
        </Select>)}
        </Stack>  
        {(isPrivate === '' || isPrivate === 'Private') && <FormLabel>Add members</FormLabel>}
        <Stack mb={5} w={'500px'}>
          {(team && isPrivate === 'Private') ? (
            <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} team={team} />
          ) : (team && isPrivate ==='Standard') ? null :(<SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} />)}
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