import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
    useEditable,
    useStatStyles,
  } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { getUserByHandle, userChannel, userMessage } from '../../services/users.service';
import { addMemberToChannel, channelMessage, getChannelById } from '../../services/channels.service';
import { addMessage, getMessageById } from '../../services/messages';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import MessagesList from '../MessagesList/MessagesList';
  
  
  
  
  const Chat = (): JSX.Element => {

    
  const location = useLocation();

  const channelId = location.state?.channelId;

  const {userData} = useContext(AppContext);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    getChannelById(channelId)
    .then(result => {
        Promise.all(
            Object.keys(result.messages).map((message) => {
                return getMessageById(message);
            })
        ).then(channelMessages => {
            setMessages([...channelMessages]);
            console.log(channelMessages);
            
        })
        .catch(error => console.error(error.message));

    }).catch(e =>console.error(e));
  }, [channelId])
  
  const handleKeyDownForUser = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const userHandle = (event.target as HTMLInputElement).value.trim();
      if (userHandle) {
        getUserByHandle(userHandle)
        .then(result => {
            userChannel(channelId, result.val().handle);
            addMemberToChannel(channelId, result.val().handle);            
        })
        .catch(e =>console.error(e));
        (event.target as HTMLInputElement).value = '';
      }
    }
  };

  const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        const message = (event.target as HTMLInputElement).value.trim();
        if (message) {
          addMessage(message, userData.handle, channelId)
          .then(result => {
              channelMessage(channelId, result.id);
              userMessage(result.id, userData.handle);          
          })
          .catch(e =>console.error(e));
          (event.target as HTMLInputElement).value = '';
        }
      }
  }

  
      return (
          <Flex
            align={'center'}
            direction={'column'}
            justify={'center'}
            py={12}>
            <Flex 
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              spacing={8}
              align={'center'}>
              <Input
                  bg={'grey'}
                  placeholder="Search for Users"
                  onKeyDown={handleKeyDownForUser} />
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}>
                  Add
                </Button>
            </Flex>
            <Stack h={'50vh'}>
                {/* <MessagesList messages={messages}/> */}
            </Stack>
            <Stack
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              spacing={8}
              align={'center'}>
              <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
                <Input
                  type={'text'}
                  placeholder={'Write something...'}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  bg={useColorModeValue('gray.100', 'gray.600')}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('gray.200', 'gray.800'),
                    outline: 'none',
                  }}
                  onKeyDown={handleKeyDownForMessage}
                />
                <Button
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}>
                  Send
                </Button>
              </Stack>
            </Stack>
          </Flex>
        )
  }
  
  export default Chat;