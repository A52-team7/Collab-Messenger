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
import {getTeamById} from '../../services/teams.service';
import { FiEdit3, FiUsers, FiXOctagon   } from "react-icons/fi";
import {TEAM_MORE_OPTIONS} from '../../common/constants'

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
  })

  useEffect(() =>{
    getTeamById(id)
    .then(res => setTeam(res))

  },[])

  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  if(userData === null) return;


  const addChannel = () =>{


  }


  const addOrRemoveNewMember =() => {
    if(userData.handle === team.owner){
    return navigate('/add-remove-members', { state: id })
    }else{ 
      return alert(`Only the team's owner should be able to add to or remove other users from the team`)
    }
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
              {}
            <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiUsers  />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={addChannel}>
                Add channel
              </Button>
              <Button
                w="194px"
                variant="ghost"
                rightIcon={<FiUsers  />}
                justifyContent="space-between"
                fontWeight="normal"
                fontSize="sm"
                onClick={addOrRemoveNewMember}>
                Add/Remove members
              </Button>
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