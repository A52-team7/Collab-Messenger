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
    generalChannel: '',
  })

  useEffect(() =>{
    getTeamById(id)
    .then(res => {
      return setTeam(res);
    })
    .catch(e => console.log(e));
    console.log(team, 'more');
  },[])


  

  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  if(userData === null) return;


  const addNewChannel = () =>{
      navigate('/new-chat', {state: {team}}) 
  }

  const addNewMember =(user: string) => {
    updateUserTeams(user, team.id);
    addMemberToTeam(team.id, user);
  }



  const removeTeam = () =>{
// soon
  }

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
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiEdit3 />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={() => navigate('/edit-team-information', {state:{team}})}>
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