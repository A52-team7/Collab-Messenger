import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
    Heading,
  } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom';
import { userChannel, userMessage } from '../../services/users.service';
import { addMemberToChannel, channelMessage, getChannelById, getChannelMembersLive, getChannelMessagesLive } from '../../services/channels.service';
import { addMessage, getMessageById } from '../../services/messages';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import MessagesList, { Message } from '../MessagesList/MessagesList';
import { USER_MESSAGE } from '../../common/constants';
import UsersDrawer from '../UsersDrawer/UsersDrawer';
import { MdMoreHoriz } from "react-icons/md";
import EmojiPopover from '../EmojiPopover/EmojiPopover';
  
  
  
  const Chat = (): JSX.Element => {
    
  const location = useLocation();

  const channelId = location.state?.channelId;

  const {userData} = useContext(AppContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const [emoji, setEmoji] = useState('');

  // console.log(emoji.native);

  useEffect(() => {
    setNewMessage(newMessage => newMessage+ emoji.native);
  }, [emoji]);
  

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
    getChannelById(channelId)
      .then(result => {
          setTitle(result.title);
          setMembers(Object.keys(result.members));
      }).catch(e =>console.error(e));
  }, []);

  useEffect(() => {
    if(userData === null) return;
   
    getChannelMessagesLive(channelId, (data: string[]) => {
        Promise.all(
            data.map((message) => {
                return getMessageById(message)
                .then(res => res)
                .catch(e =>console.error(e));
            })
        ).then(channelMessages => {
            setMessages([...channelMessages]);          
        })
        .catch(error => console.error(error.message));
    })
    },[]);


    useEffect(() => {
      if(userData === null) return;
     
      getChannelMembersLive(channelId, (data: string[]) => {
        return setMembers([...data]);
      })
      },[]);
    
  

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

  const onAddMember = (user: string): void => {
    userChannel(channelId, user);
    addMemberToChannel(channelId, user);
  }

  const onGetEmoji = (emoji: string) => {
    setEmoji(emoji);
  }
 
  const UserDrawerProps = {
    members: members,
    updateNewMember: onAddMember,
    id: channelId
  };

      return (
          <Flex
            align={'center'}
            direction={'column'}
            justify={'center'}
            py={12}>
            <Flex w={'100%'} mb={10} mt={-10}>
              <Flex flex={1}>
                <Heading>{title}</Heading>
              </Flex>
              {members.length > 0 && 
                <UsersDrawer {...UserDrawerProps}/>
              }
              <Button colorScheme='teal'>
                <MdMoreHoriz size={30}/>
              </Button>
            </Flex>
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
                <EmojiPopover onGetEmoji={onGetEmoji}/>
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