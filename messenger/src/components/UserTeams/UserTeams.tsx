import { useContext, useState,useEffect } from 'react';
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
import TeamMoreOptions from '../MoreOptions/MoreOptions'
import AppContext, {UserState} from '../../context/AppContext'
import {getUserTeamsLive} from '../../services/users.service'
import {getTeamById} from '../../services/teams.service'
import {Team} from '../CreateTeam/CreateTeam'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { FiPlusSquare } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const UserTeams = () => {
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();
  const [myTeam, setMyTeam] = useState<Team[]>([])

  useEffect(() => {
    if(userData === null) return;
   
    getUserTeamsLive(userData.handle, (data: string[]) => {
    console.log(data, "data")
    setMyTeam([])
     data.forEach((id: string) => {
      getTeamById(id)
      .then((el: Team) => {
        console.log(el)
        setMyTeam((prevMyTeam) => [...prevMyTeam, el])
    })
     })
    }
    )
    },[userData])

    return (
        <Flex
          justify={'center'}
          >
          <Container>
            <HStack>
            <Heading as='h2' size='lg'>My Teams</Heading>
            <Button variant='ghost' onClick={() => navigate('/new-team', state)}><FiPlusSquare /></Button>
            </HStack>
            <Accordion allowMultiple width="100%" maxW="lg" rounded="lg">
            {myTeam.map((team: Team) =>
                <AccordionItem key={team.id}>
                <HStack>    
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={4}>
                  <Text fontSize="md">{team.name}</Text>
                  <ChevronDownIcon fontSize="24px" />
                </AccordionButton>
                <Tooltip hasArrow label='More options' bg='gray.300' color='black'>
                  <TeamMoreOptions id={team.id} />
                </Tooltip>
                 </HStack>
                <AccordionPanel pb={4}>
                  <Text color="black">
                    Channels
                  </Text>
                </AccordionPanel>
              </AccordionItem>
            )}
            </Accordion>
            </Container>
            </Flex>
    )
}

export default UserTeams;