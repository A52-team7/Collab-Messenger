import {
    Text,
    VStack,
    Avatar,
    Wrap,
    HStack
  } from '@chakra-ui/react'
  import { useState, useEffect, } from 'react';
  import {Author} from '../OneMessage/OneMessage.tsx'
  import { Message } from '../MessagesList/MessagesList.tsx';
  import {getUserByHandle} from '../../services/users.service.ts'

  interface SearchOneMessage{
    message: Message 
  }

const SearchOneMessage = ({message}: SearchOneMessage) => {

    const [authorOfMessage, setAuthorOfMessage] = useState<Author>({
      handle: '',
      uid: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      profilePhoto: ''
    });

    useEffect(() => {
        getUserByHandle(message.author)
          .then(result => setAuthorOfMessage(result.val()))
          .catch(error => console.error(error.message));
      }, []);

      return (
        <VStack align="flex-start" justify="flex-start" w={'fit-content'} maxW ={'350px'}>
            {authorOfMessage && (
            <HStack maxH={'5px'} mt={2} justify={'left'}>
            <Wrap>
            <Avatar size='sm'name={authorOfMessage.firstName + " " + authorOfMessage.lastName} 
            src={authorOfMessage.profilePhoto}  
             />{' '}
            </Wrap>
            <Text color={'white'}>
                {authorOfMessage.firstName} {authorOfMessage.lastName} {message.createdOn.toLocaleString("en-GB").slice(0, 17)}
            </Text>
            </HStack>) }
            <Text color={'white'}  w={'fit-content'} maxW ={'325px'} p={2} mt={2} textAlign="left">{message.content}</Text>
         </VStack>
      )
}

export default SearchOneMessage;