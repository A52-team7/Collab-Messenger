import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Tag,
  TagLabel,
  TagCloseButton,
} from '@chakra-ui/react'
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext, { UserState } from '../../context/AppContext';
import { TITLE_NAME_LENGTH_MIN, TITLE_NAME_LENGTH_MAX } from '../../common/constants';
import { getTeamByName, createTeam, updateTeamChannel, updateGeneralTeamChannel } from '../../services/teams.service'
import { updateUserTeams, userChannel } from '../../services/users.service';
import { addChannel } from '../../services/channels.service';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS } from '../../common/constants';
import UsersList from '../UsersList/UsersList';

export interface Team {
  id: string,
  name: string,
  owner: string,
  members: { [handle: string]: boolean },
  description: string,
  createdOn?: string,
  channels?: { [id: string]: boolean },
  generalChannel: string,
  teamPhoto?: string,
}

const CreateTeam = () => {
  const { userData } = useContext<UserState>(AppContext);
  const [teamForm, setTeamForm] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
    generalChannel:'',
  })

  const navigate = useNavigate();

  const updateNewTeam = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field !== 'members') {
      setTeamForm({
        ...teamForm,
        [field]: e.target.value,
      })
    } else {
      const newMembers = { ...teamForm.members };
      newMembers[e.target.value] = true;

      setTeamForm({
        ...teamForm,
        members: newMembers
      })
    }
  }

  const updateNewMember = (user: string) => {
    const newMembers = { ...teamForm.members };
    newMembers[user] = true;
    setTeamForm({
      ...teamForm,
      members: newMembers
    })
  }

  const removeTeamMembers = (member: string) => {
    const updateMembers = { ...teamForm.members }
    delete updateMembers[member]

    setTeamForm({
      ...teamForm,
      members: updateMembers,
    })
  }

  const saveNewTeam = () => {
    if (!teamForm.name) {
      return alert(`Enter team name`)
    }
    if (teamForm.name.length < TITLE_NAME_LENGTH_MIN || teamForm.name.length > TITLE_NAME_LENGTH_MAX) {
      return alert(`Team name must be between ${TITLE_NAME_LENGTH_MIN} and ${TITLE_NAME_LENGTH_MAX} characters!`)
    }
    if (Object.keys(teamForm.members).length === 0) {
      return alert(`Enter team members`)
    }
    if (userData === null) return alert('Please login');

    getTeamByName(teamForm.name)
      .then((result) => {
        if (result.exists()) {
          return alert(`Team name with name ${teamForm.name} already exist!`);
        }
        if (userData === null) return alert('Please login');
        const allMembers = { ...teamForm.members }
        allMembers[userData.handle] = true;
        return createTeam(teamForm.name, userData.handle, allMembers, teamForm.description);
      }).then(team => {
        Object.keys(team.members).forEach((member: string) => updateUserTeams(member, team.id));
        setTeamForm({
          id: '',
          name: '',
          owner: '',
          members: {},
          description: '',
          generalChannel:'',
        })
        updateUserTeams(userData.handle, team.id)
        addChannel(userData.handle, 'General',team.members, team.id)
          .then(channel => {
            Object.keys(team.members).forEach((member: string) => userChannel(channel.id, member))
            updateTeamChannel(team.id, channel.id);
            updateGeneralTeamChannel(team.id, channel.id);
          })
      }).catch(e => console.log(e))
  }

  return (
    <Flex
      maxH={'fit-content'}
      align={'center'}
      justify={'center'}
      mt={{ base: 2, sm: 5 }}
      bg={'none'}
      >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'fit-content'}
        bg={'grey'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={{ base: 1, sm: 6 }}
        >
        <Heading textAlign={'center'} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          Create your new team
        </Heading>
        <FormControl id="userName" isRequired>
          <FormLabel textAlign={'center'}>Team name</FormLabel>
          <Input
            placeholder="Write your team name..."
            _placeholder={{ color: 'gray.500' }}
            type="text"
            bg={'white'}
            rounded="md"
            value={teamForm.name}
            onChange={updateNewTeam('name')}
          />
        </FormControl>
        <FormControl id="addMembers" isRequired>
          <FormLabel textAlign={'center'}>Add members</FormLabel>
          {/*HERE IS THE INPUT FOR ADDING USERS!*/}
          <SearchUsers updateNewMember={updateNewMember} searchType={ADD_USERS} />
          <Stack h={'15vh'}
          overflowY={'scroll'}
          >
          <UsersList members={Object.keys(teamForm.members)} removeChannelMembers={removeTeamMembers}/>
          </Stack>
        </FormControl>
        <FormControl id="description">
          <FormLabel textAlign={'center'}>Description</FormLabel>
          <Input
            placeholder="Describe your team or write your motto..."
            _placeholder={{ color: 'gray.500' }}
            type="text"
            bg={'white'}
            rounded="md"
            value={teamForm.description}
            onChange={updateNewTeam('description')}
          />
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            w='full'
            border={'2px solid'}
            borderColor={'teal.500'}
            bg={'none'}
            color={'teal.500'}
            _hover={{ opacity: 0.8 }}
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            bg={'teal.500'}
            variant={'primaryButton'} w='full'
            _hover={{ opacity: 0.8 }}
            onClick={saveNewTeam}>
            Add Team
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default CreateTeam;