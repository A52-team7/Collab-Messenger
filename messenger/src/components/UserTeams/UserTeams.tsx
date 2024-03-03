import { useContext, useState, useEffect } from 'react';
import {
  HStack,
  Tooltip,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Flex,
  Text,
  Container,
  Heading,
} from '@chakra-ui/react';
import MoreOptions from '../MoreOptions/MoreOptions'
import AppContext, { UserState } from '../../context/AppContext'
import { getUserTeamsLive } from '../../services/users.service'
import { getTeamById } from '../../services/teams.service'
import { Team } from '../CreateTeam/CreateTeam'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import TeamChannels from '../TeamChannels/TeamChannels'
import TeamTitle from '../TeamTitle/TeamTitle';

interface UserTeamsProps {
  onClose: () => void;
}

const UserTeams = ({ onClose }: UserTeamsProps) => {
  const { userData } = useContext<UserState>(AppContext);
  const [myTeam, setMyTeam] = useState<Team[]>([]);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (userData === null) return;

    getUserTeamsLive(userData.handle, (data: string[]) => {
      Promise.all(
        data.map((teamId: string) => {
          return getTeamById(teamId)
        }))
        .then(elTeam => {
          setMyTeam([...elTeam])
        })
        .catch(e => console.error(e))
    })

  }, [userData])

  return (
    <Flex
      justify={'center'}
    >
      <Container>
        <HStack justify="space-between">
          <Heading color={'white'} as='h2' size='lg' textAlign="left">My Teams</Heading>
          <Button variant='unstyled' color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} onClick={() => navigate('/new-team')}><FiPlusSquare size={20} /></Button>
        </HStack>
        <Accordion allowMultiple
          width="100%"
          maxW="lg"
          rounded="lg"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'black',
              borderRadius: '24px',
            },
          }}>
          {myTeam.length > 0 ? myTeam.map((team: Team) => {
            return (<AccordionItem key={team.id}>
              <HStack>
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}>
                  <TeamTitle id={team.id} teamName={team.name} />
                  {/* <Wrap>
                    <WrapItem>
                      <Avatar size='sm' name={team.name} src={team.teamPhoto} />{' '}
                    </WrapItem>
                  </Wrap> 
                  <Text color={'white'} fontSize="md">{team.name}</Text> */}
                  <ChevronDownIcon fontSize="24px" />
                </AccordionButton>
                <Tooltip hasArrow label='More options' bg='gray.300' color='white'>
                  <MoreOptions id={team.id} />
                </Tooltip>
              </HStack>
              <AccordionPanel onClick={() => onClose()} pb={4}>
                <TeamChannels id={team.id} />
              </AccordionPanel>
            </AccordionItem>
            )
          }) : <Text>No Teams</Text>}
        </Accordion>
      </Container>
    </Flex>
  )
}

export default UserTeams;