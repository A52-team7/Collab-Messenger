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
import {getTeamById, addMemberToTeam} from '../../services/teams.service';
import { FiEdit3, FiUsers, FiXOctagon   } from "react-icons/fi";
import { updateUserTeams} from '../../services/users.service'

export interface IdTeam{
  id:string
}

const MoreOptions = ({id}: IdTeam) => {
  
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
  },[])

  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  if(userData === null) return;

  const addNewChannel = () =>{
      navigate('/new-chat', {state: {team}}) 
  }

  const removeTeam = () =>{
// soon
  }

  return (
    <Flex mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="More server options"
            color={'white'}
            variant='unstyled' _hover={{ transform: 'scale(1.5)', color: 'white' }}
            icon={<BsThreeDotsVertical size={25}  />}
            w="fit-content"
            justifyContent="space-between"
            mt={-4}
          />
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack justifyContent="flex-start">
            <Button
                w="170px"
                variant="ghost"
                leftIcon={<FiUsers  />}
                fontWeight="normal"
                fontSize="sm"
                onClick={addNewChannel}>
                Add channel
              </Button>
              {(team.owner === userData.handle) && 
              (<Button
                w="170px"
                variant="ghost"
                leftIcon={<FiEdit3 />}
                fontWeight="normal"
                fontSize="sm"
                onClick={() => navigate('/edit-team-information', {state:{team}})}>
                Edit team information
              </Button>)}
              {/* {(team.owner === userData.handle) && 
              (<Button
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
              )} */}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default MoreOptions;