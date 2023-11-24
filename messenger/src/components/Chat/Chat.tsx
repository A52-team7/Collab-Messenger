import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { userMessage } from '../../services/users.service';
import { channelMessage, getChannelById, getChannelMessagesLive } from '../../services/channels.service';
import { addMessage, getMessageById } from '../../services/messages';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import MessagesList, { Message } from '../MessagesList/MessagesList';
import { USER_MESSAGE } from '../../common/constants';
  
  
  
  const Chat = (): JSX.Element => {
    
  const location = useLocation();

  const channelId = location.state?.channelId;

  const {userData} = useContext(AppContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // useEffect(() => {
  //   getChannelById(channelId)
  //   .then(result => {
  //       Promise.all(
  //           Object.keys(result.messages).map((message) => {
  //               return getMessageById(message)
  //               .then(res => res)
  //               .catch(e =>console.error(e));
  //           })
  //       ).then(channelMessages => {
  //           setMessages([...channelMessages]);          
  //       })
  //       .catch(error => console.error(error.message));
  //   }).catch(e =>console.error(e));
  // }, [channelId]);  

  useEffect(() => {
    if(userData === null) return;
   
    getChannelMessagesLive(channelId, (data: string[]) => {
    console.log(data, "data")
    getChannelById(channelId)
      .then(result => {
          Promise.all(
              Object.keys(result.messages).map((message) => {
                  return getMessageById(message)
                  .then(res => res)
                  .catch(e =>console.error(e));
              })
          ).then(channelMessages => {
              setMessages([...channelMessages]);          
          })
          .catch(error => console.error(error.message));
      }).catch(e =>console.error(e));
    }
    )
    console.log(messages, "user")
    },[channelId])
  

  const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(userData === null) return;
    if (event.key === 'Enter') {
        const message = (event.target as HTMLInputElement).value.trim();
        if (message) {
          addMessage(message, userData.handle, channelId, false, USER_MESSAGE)
          .then(result => {
              channelMessage(channelId, result.id);
              userMessage(result.id, userData.handle);          
          })
          .catch(e =>console.error(e));
          (event.target as HTMLInputElement).value = '';
          setNewMessage('');
        }
      }
  }

  const updateNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const onSendMessage = () => {
    if(userData === null) return;
    addMessage(newMessage, userData.handle, channelId, false, USER_MESSAGE)
          .then(result => {
              channelMessage(channelId, result.id);
              userMessage(result.id, userData.handle);          
          })
          .catch(e =>console.error(e));
    setNewMessage('');
  }

      return (
          <Flex
            align={'center'}
            direction={'column'}
            justify={'center'}
            py={12}>
            <Stack
            maxH={'60vh'}
            w={'inherit'}
            overflowY={'scroll'}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'msOverflowStyle': 'none',  /* IE and Edge */
              'scrollbarWidth': 'none',  /* Firefox */
            }}>
              {messages.length > 0 &&
                <MessagesList {...{messages}}/>
              }              
            </Stack>
            <Stack
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              spacing={8}
              align={'center'}
              position= {'fixed'}
              bottom= {'0'}>
              <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
                <Input
                  type={'text'}
                  placeholder={'Write something...'}
                  value={newMessage}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  bg={useColorModeValue('gray.100', 'gray.600')}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('gray.200', 'gray.800'),
                    outline: 'none',
                  }}
                  onKeyDown={handleKeyDownForMessage}
                  onChange={updateNewMessage}
                />
                <Button
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onSendMessage}>
                  Send
                </Button>
              </Stack>
            </Stack>
          </Flex>
        )
  }
  
  export default Chat;