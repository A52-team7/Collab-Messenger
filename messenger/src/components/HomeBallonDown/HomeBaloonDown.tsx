import {
    Flex,
    Heading,
    Box
  } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { getAllTeams } from '../../services/teams.service';

const HomeBallonDown = () => {
    const [allTeams, setAllTeams] = useState<number | null>(null)


    useEffect(() =>{
        getAllTeams()
        .then((teams) => setAllTeams(Object.keys(teams).length)
         )
    })



    return (
        <Flex mx={'15%'} justifyContent="space-between">
        <Box rounded={'50%'} 
        color="white" 
        bg="RGB(29, 166, 201)" 
        w={'150px'}
        h={'150px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
            <Heading size='sm'>Create your own event!</Heading></Box>
        <Box rounded={'50%'} 
        color="white" 
        bg="RGB(29, 166, 201)" 
        w={'150px'}
        h={'150px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        opacity={'0.9'}>
            <Heading size='sm'>Join one of our {allTeams} teams!</Heading></Box>
        </Flex>
    )
}

export default HomeBallonDown;