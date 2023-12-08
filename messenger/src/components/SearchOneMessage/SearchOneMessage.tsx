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
  import { Link, useHistory } from 'react-router-dom';

  interface SearchOneMessage{
    message: Message 
  }

const SearchOneMessage = ({message}: SearchOneMessage) => {

    const [authorOfMessage, setAuthorOfMessage] = useState<Author>({});

    useEffect(() => {
        getUserByHandle(message.author)
          .then(result => setAuthorOfMessage(result.val()))
          .catch(error => console.error(error.message));

        console.log(authorOfMessage)
      }, []);

      const handleJumpToChat = (channelId: string, messageId: string) => {
        // Navigate to the Chat component with the selected channel and message
        history.push(`/chat/${channelId}/${messageId}`);
      };

      return (
        <Flex>
            <VStack >
            {authorOfMessage && (
            <HStack>
            <Wrap>
            <WrapItem>
            <Avatar size='sm'name={authorOfMessage.firstName + " " + authorOfMessage.lastName} 
            src={authorOfMessage.profilePhoto}  
             />{' '}
            </WrapItem>
            </Wrap>
            <Text color={'white'}>
                {authorOfMessage.firstName} {authorOfMessage.lastName} {message.createdOn.toLocaleString("en-GB").slice(0, 17)}
            </Text>
            <Link to={`/chat/${message.toChannel}/${message.id}`}>
            <Button onClick={() => handleJumpToChat(message.toChannel, message.id)}>Jump</Button>
            </Link>
            </HStack>) }
            <Text color={'white'}>{message.content}</Text>
            </VStack>
        </Flex>
      )

}

export default SearchOneMessage;