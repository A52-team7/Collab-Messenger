import {
    Button,
    Text,
    Flex,
    VStack,
    WrapItem,
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

    const [authorOfMessage, setAuthorOfMessage] = useState<Author>({});

    useEffect(() => {
        getUserByHandle(message.author)
          .then(result => setAuthorOfMessage(result.val()))
          .catch(error => console.error(error.message));
      }, []);

      return (
        <Flex >
            <VStack >
            {authorOfMessage && (
            <HStack maxH={'5px'} mt={2}>
            <Wrap>
            <Avatar size='sm'name={authorOfMessage.firstName + " " + authorOfMessage.lastName} 
            src={authorOfMessage.profilePhoto}  
             />{' '}
            </Wrap>
            <Text color={'white'}>
                {authorOfMessage.firstName} {authorOfMessage.lastName} {message.createdOn.toLocaleString("en-GB").slice(0, 17)}
            </Text>
            </HStack>) }
            <Text color={'white'} maxH={'10px'}>{message.content}</Text>
            </VStack>
        </Flex>
      )

}

export default SearchOneMessage;