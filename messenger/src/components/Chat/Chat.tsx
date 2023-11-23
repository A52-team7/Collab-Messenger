import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { getUserByHandle, userChannel, userMessage } from '../../services/users.service';
import { addMemberToChannel, addTitleToChannel, channelMessage, getChannelById, getChannelMessagesLive } from '../../services/channels.service';
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
  const [isVisible, setIsVisible] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newUser, setNewUser] = useState('');
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
  
  const handleKeyDownForTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const title = (event.target as HTMLInputElement).value.trim();
      if (title) {
        addTitleToChannel(channelId, title);
        (event.target as HTMLInputElement).value = '';
        setNewTitle('');
      }
    }
  };

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
        setNewUser('');
      }
    }
  };

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

  const onVisible = () => {
    setIsVisible(false);
  }

  const updateNewTitle= (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value)
  }

  const updateNewUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(e.target.value)
  }

  const updateNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
  }

  const onAddTitle = () => {
    addTitleToChannel(channelId, newTitle);
    setNewTitle('');
  }

  const onAddUser = () => {
    getUserByHandle(newUser)
        .then(result => {
            userChannel(channelId, result.val().handle);
            addMemberToChannel(channelId, result.val().handle);            
        })
        .catch(e =>console.error(e));
    setNewUser('');
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
              {isVisible && <Flex 
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              pt='5'
              pb='5'
              pl='10'
              pr='10'
              align={'center'}>
              <Input
                  bg={'grey'}
                  placeholder="Add title"
                  value={newTitle}
                  onKeyDown={handleKeyDownForTitle} 
                  onChange={updateNewTitle}/>
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onAddTitle}>
                  Add
                </Button>
              </Flex>
              }
            {isVisible && <Flex 
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              align={'center'}>
              <Input
                  bg={'grey'}
                  placeholder="Search for Users"
                  value={newUser}
                  onKeyDown={handleKeyDownForUser}
                  onChange={updateNewUser} />
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onAddUser}>
                  Add
                </Button>
            </Flex>
            }
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
                  onClick={onVisible}
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