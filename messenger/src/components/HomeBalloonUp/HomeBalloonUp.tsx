import {
  Flex,
  Heading,
  Box,
  Text
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { getAllChannels } from '../../services/channels.service';
import { getAllUsersData } from '../../services/users.service';
import { getAllTeams } from '../../services/teams.service';

const HomeBallonUp = () => {
  const [allChannels, setAllChannels] = useState<number | null>(null)
  const [allUsers, setAllUsers] = useState<number | null>(null)
  const [allTeams, setAllTeams] = useState<number | null>(null)


  useEffect(() => {
    getAllChannels()
      .then((channels) => setAllChannels(Object.keys(channels).length)
      )
  })

  useEffect(() => {
    getAllUsersData()
      .then((users) => {
        console.log(users.val());

        setAllUsers(Object.keys(users.val()).length);
      }
      )
  })

  useEffect(() => {
    getAllTeams()
      .then((teams) => setAllTeams(Object.keys(teams).length)
      )
  })


  return (
    <Flex>
      <Box rounded={'50%'}
        mt={150}
        ml={90}
        color="white"
        bg="none"
        w={'200px'}
        h={'200px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}>
        <Heading size='lg'>Here you can find over<Text as='span' color={"RGB(27, 246, 214)"}> {allChannels} chats</Text>!</Heading> </Box>
      <Box rounded={'50%'}
        mt={35}
        ml={25}
        color="white"
        bg="none"
        w={'200px'}
        h={'200px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
        <Heading size='lg'>Text with over <Text as='span' color={"RGB(27, 246, 214)"}>{allUsers} people</Text>!</Heading> </Box>
      <Box rounded={'50%'}
        mt={195}
        ml={2}
        color="white"
        bg="none"
        w={'200px'}
        h={'200px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
        <Heading size='lg'>Join one of our <Text as='span' color={"RGB(27, 246, 214)"}>{allTeams} teams</Text>!</Heading></Box>
    </Flex>
  )
}

export default HomeBallonUp;