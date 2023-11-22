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
import {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext, {UserState} from '../../context/AppContext'; 
import {TEAM_NAME_LENGTH_MIN, TEAM_NAME_LENGTH_MAX} from '../../common/constants';
import {getTeamByName, createTeam } from '../../services/teams.service'
import {getAllUsers, updateUserTeams} from '../../services/users.service'

export interface Team {
  uid?: string,
  name: string,
  owner: string,
  members: { [handle: string]: boolean },
  description: string,
  createdOn?: string,
  channels?: {[id: string]: boolean} 
}

const Team = () => {
  const { userData } = useContext<UserState>(AppContext); 
  const [teamForm, setTeamForm] = useState<Team>({
    name: '',
    owner: '',
    members: {},
    description: '',
  }) 
  const [searchValue, setSearchValue] = useState<string>('')
  const navigate = useNavigate();

const updateNewTeam =(field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>{
  if(field !== 'members'){
  setTeamForm({
    ...teamForm,
    [field]: e.target.value,
  })} else{
    const newMembers = {...teamForm.members};
    newMembers[e.target.value] = true;

    setTeamForm({
      ...teamForm,
      members: newMembers
    })
  }
}

const updateNewMember = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    const searchItem = (event.target as HTMLInputElement).value.trim();
    if(userData === null) return alert('Please login') ;
    if(userData.handle === searchItem){
      return alert('You try to add your user')
    }

    getAllUsers()
    .then(allUsersName => {
    if(allUsersName.includes(searchItem.toLowerCase())){
      const newMembers = {...teamForm.members};
      newMembers[searchItem] = true;
    setTeamForm({
      ...teamForm,
      members: newMembers
    })
    setSearchValue('')
    }else{
      return alert(`Not found this user ${searchItem}`)
    }
    })
}}

const removeTeamMembers = (member: string) =>{
  const updateMembers = {...teamForm.members}
  delete updateMembers[member]

  setTeamForm({
    ...teamForm,
    members: updateMembers,    
  })
}
 
const saveNewTeam = () =>{
  if(!teamForm.name){
    return alert(`Enter team name`)
  }
  if(teamForm.name.length < TEAM_NAME_LENGTH_MIN || teamForm.name.length > TEAM_NAME_LENGTH_MAX){
    return alert(`Team name must be between ${TEAM_NAME_LENGTH_MIN} and ${TEAM_NAME_LENGTH_MAX} characters!`)
  }
  if(Object.keys(teamForm.members).length === 0){
   return alert(`Enter team members`)
  }

  getTeamByName(teamForm.name)
    .then(result => {
      if (result.exists()) {
        return alert(`Team name with name ${teamForm.name} already exist!`);
      }
      if(userData === null) return alert('Please login');
      const allMembers = {...teamForm.members}
      allMembers[userData.handle] = true;
      return createTeam(teamForm.name, userData.handle, allMembers, teamForm.description);
  }).then(team => {
    Object.keys(teamForm.members).forEach((member: string) => updateUserTeams(member, team.id));
    setTeamForm({
      name: '',
      owner: '',
      members: {},
      description: '',
    })
    if(userData === null) return alert('Please login');
    updateUserTeams(userData.handle, team.id)
  })
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
              Create your new team
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
              {/* <Input
                placeholder="Add members"
                _placeholder={{ color: 'gray.500' }}
                type="text"
                onClick={updateNewMember}
              /> */}
               <Input
                placeholder="Add members"
                _placeholder={{ color: 'gray.500' }}
                value = {searchValue}
                onChange={(e)=>setSearchValue(e.target.value)}
                onKeyDown={updateNewMember} />

              <Flex direction={'row'}>
              {Object.keys(teamForm.members).map((member) => (
                <Tag key={member} bg={'baseBlue'} colorScheme="blue" w={'fit-content'}>
                <TagLabel>{member}</TagLabel>
                <TagCloseButton onClick={() => removeTeamMembers(member)} />
                </Tag>
              ))}
              </Flex>
            </FormControl>
            <FormControl id="description" isRequired>
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
                onClick={saveNewTeam}>
                Submit
              </Button>
            </Stack>
          </Stack>
        </Flex>
      ) 
}

export default Team;