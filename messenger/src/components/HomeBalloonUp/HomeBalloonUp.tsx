import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Box
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { getAllChannels } from '../../services/channels.service';
import { getAllUsersData } from '../../services/users.service';
import { getAllTeams } from '../../services/teams.service';

const HomeBallonUp = () => {
    const [allChannels, setAllChannels] = useState<number | null>(null)
    const [allUsers, setAllUsers] = useState<number | null>(null)


    useEffect(() =>{
        getAllChannels()
        .then((channels) => setAllChannels(Object.keys(channels).length)
         )
    })

    useEffect(() =>{
        getAllUsersData()
        .then((users) => setAllUsers(Object.keys(users).length)
         )
    })


    return (
        <Flex mx={'15%'} p={'5%'} justifyContent="space-between">
        <Box rounded={'50%'} 
        color="white" 
        bg="RGB(27, 246, 214)" 
        w={'150px'}
        h={'150px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
            <Heading size='sm'>Here you can find over {allChannels} chats!</Heading> </Box>
        <Box rounded={'50%'} 
        color="white" 
        bg="RGB(27, 246, 214)" 
        w={'150px'}
        h={'150px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
            <Heading size='sm'>Text with over {allUsers} people!</Heading> </Box>
        </Flex>
    )
}

export default HomeBallonUp;