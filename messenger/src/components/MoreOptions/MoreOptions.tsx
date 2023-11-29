import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  IconButton,
  Button,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect,useState } from 'react';
import AppContext, {UserState} from '../../context/AppContext';
import {Team} from '../CreateTeam/CreateTeam';
import {getTeamById, updateTeamChannel, addMemberToTeam} from '../../services/teams.service';
import { FiEdit3, FiUsers, FiXOctagon   } from "react-icons/fi";
import {TEAM_MORE_OPTIONS} from '../../common/constants'
import { addChannel } from '../../services/channels.service';
import {userChannel, updateUserTeams} from '../../services/users.service'
import {Channel} from '../MyChatsSideNavBar/MyChatsSideNavBar'
import UsersDrawer from '../UsersDrawer/UsersDrawer'


export interface IdTeam{
  id:string
}

const MoreOptions = ({id}: IdTeam) => {
  console.log(id, 'More')
  
  const [team, setTeam] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
  })

  useEffect(() =>{
    getTeamById(id)
    .then(res => {
      return setTeam(res);
    })
    .catch(e => console.log(e));

  },[])

  console.log(team);
  

  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  if(userData === null) return;


  const addNewChannel = () =>{
    console.log(id,'nav')
      navigate('/new-chat', {state: {id}}) 
  }

  const addNewMember =(user: string) => {
    updateUserTeams(user, team.id);
    addMemberToTeam(team.id, user);
  }



  const removeTeam = () =>{
// soon
  }

  const UserDrawerProps = {
    members: Object.keys(team.members),
    updateNewMember: addNewMember,
    team: team,
  };

  return (
    <Flex justifyContent="center" mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="More server options"
            icon={<BsThreeDotsVertical />}
            variant="solid"
            w="fit-content"
          />
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack>
            <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiUsers  />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={addNewChannel}>
                Add channel
              </Button>
              <UsersDrawer {...UserDrawerProps}/>
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiEdit3 />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={() => navigate('/edit-team-information')}>
                Edit team information
              </Button>
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiXOctagon  />}
                justifyContent="space-between"
                fontWeight="normal"
                colorScheme="red"
                fontSize="sm"
                onClick={removeTeam}>
                Remove team
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default MoreOptions;