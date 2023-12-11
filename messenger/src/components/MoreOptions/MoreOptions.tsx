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
import { useContext, useEffect, useState } from 'react';
import AppContext, { UserState } from '../../context/AppContext';
import { Team } from '../CreateTeam/CreateTeam';
import { getTeamById } from '../../services/teams.service';
import { FiEdit3, FiUsers } from "react-icons/fi";

export interface IdTeam {
  id: string
}

const MoreOptions = ({ id }: IdTeam) => {

  const [team, setTeam] = useState<Team>({
    id: '',
    name: '',
    owner: '',
    members: {},
    description: '',
    generalChannel: '',
  })

  useEffect(() => {
    getTeamById(id)
      .then(res => {
        return setTeam(res);
      })
      .catch(e => console.error(e));
  }, [])

  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  if (userData === null) return;

  const addNewChannel = () => {
    navigate('/new-chat', { state: { team } })
  }

  return (
    <Flex mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          <IconButton
            aria-label="More server options"
            color={'white'}
            variant='unstyled'
            icon={<BsThreeDotsVertical size={25} />}
            w="fit-content"
            justifyContent="space-between"
            mt={-4}
          />
        </PopoverTrigger>
        <PopoverContent w="fit-content" borderColor="RGB(59, 59, 59)" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow borderColor="RGB(59, 59, 59)" />
          <PopoverBody bg={'RGB(59, 59, 59)'} >
            <Stack justifyContent="flex-start">
              <Button
                w="170px"
                variant='unstyled'
                color={'white'}
                leftIcon={<FiUsers />}
                fontWeight="normal"
                fontSize="sm"
                _hover={{ opacity: '0.8' }}
                onClick={addNewChannel}>
                Add channel
              </Button>
              {(team.owner === userData.handle) &&
                (<Button
                  w="170px"
                  variant='unstyled'
                  color={'white'}
                  leftIcon={<FiEdit3 />}
                  fontWeight="normal"
                  fontSize="sm"
                  _hover={{ opacity: '0.8' }}
                  onClick={() => navigate('/edit-team-information', { state: { team } })}>
                  Edit team information
                </Button>)}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  )
}

export default MoreOptions;