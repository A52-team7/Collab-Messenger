import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    Tag,
    TagLabel,
    TagCloseButton,
  } from '@chakra-ui/react'
import { IdTeam } from "../MoreOptions/MoreOptions"
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect,useState } from 'react';

const AddOrRemoveMember ({id}: IdTeam) =>{
const [members, setMembers] = useState<string[]>([])
const [searchValue, setSearchValue] = useState<string>('')

const updateMember =(field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>{
    // if(field !== 'members'){
    // setMembers({
    //   ...teamForm,
    //   [field]: e.target.value,
    // })} else{
    //   const newMembers = {...teamForm.members};
    //   newMembers[e.target.value] = true;
  
    //   setMembers()
    // }
  }

const removeTeamMembers =() =>{

}

return(
        <>
        <Input
                placeholder="Add members"
                _placeholder={{ color: 'gray.500' }}
                value = {}
                onChange={(e)=>setSearchValue(e.target.value)}
                onKeyDown={updateMembers} />

              <Flex direction={'row'}>
              {members.map((member) => (
                <Tag key={member} bg={'baseBlue'} colorScheme="blue" w={'fit-content'}>
                <TagLabel>{member}</TagLabel>
                <TagCloseButton onClick={() => removeTeamMembers(member)} />
                </Tag>
              ))}
              </Flex>
        </>
    )
 }
