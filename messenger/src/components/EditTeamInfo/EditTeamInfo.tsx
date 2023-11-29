import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue
  } from '@chakra-ui/react';
import { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext, { UserState } from '../../context/AppContext';
import { TITLE_NAME_LENGTH_MIN, TITLE_NAME_LENGTH_MAX } from '../../common/constants';
import { getTeamByName, updateTeamName, updateTeamDescription, addMemberToTeam } from '../../services/teams.service'
import { updateUserTeams, userChannel } from '../../services/users.service';
import { addMemberToChannel } from '../../services/channels.service';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS } from '../../common/constants';
import {Team} from '../CreateTeam/CreateTeam';
import UsersList from '../UsersList/UsersList';


const EditTeamInfo = () => {
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const team = location.state.team;

  const [teamForm, setTeamForm] = useState<Team>({...team})

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
    addMemberToTeam(teamForm.id, user)
    addMemberToChannel(teamForm.generalChannel, user)
    userChannel(teamForm.generalChannel, user)
    updateUserTeams(user, teamForm.id)
  }

  const removeTeamMembers = (member: string) => {
    const updateMembers = { ...teamForm.members }
    delete updateMembers[member]

    setTeamForm({
      ...teamForm,
      members: updateMembers,
    })
  }

  const saveTeam = () => {
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

    if(teamForm.name !== team.name){
    getTeamByName(teamForm.name)
      .then(result => {
        if (result.exists()) {
          return alert(`Team name with name ${teamForm.name} already exist!`);
        } 
        updateTeamName(teamForm.id,teamForm.name)
      }).catch(e => console.log(e))
    }
    updateTeamDescription(team.id, teamForm.description)
    navigate(-1)
  }

    return (
        <Flex
          minH={'100vh'}
          align={'center'}
          justify={'center'}
          bg={useColorModeValue('gray.50', 'gray.800')}>
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
            bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            boxShadow={'lg'}
            p={6}
            my={12}>
            <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
              Edit your team
            </Heading>
            <FormControl id="userName" isRequired>
              <FormLabel>Team name</FormLabel>
              <Input
                placeholder="Write your team name..."
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={teamForm.name}
                onChange={updateNewTeam('name')}
              />
            </FormControl>
            <FormControl id="addMembers" isRequired>
              <FormLabel>Add members</FormLabel>
              <SearchUsers updateNewMember={updateNewMember} searchType={ADD_USERS} />
              <Stack h={'15vh'}
               overflowY={'scroll'}
              >
              <UsersList members={Object.keys(teamForm.members)} removeTeamMembers={removeTeamMembers}/>
              </Stack>
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input
                placeholder="Describe your team or write your motto..."
                _placeholder={{ color: 'gray.500' }}
                type="text"
                value={teamForm.description}
                onChange={updateNewTeam('description')}
              />
            </FormControl>
            <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'red.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'red.500',
                }}
                onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                bg={'blue'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={saveTeam}>
                Save
              </Button>
            </Stack>
          </Stack>
        </Flex>
      )

}

export default EditTeamInfo;