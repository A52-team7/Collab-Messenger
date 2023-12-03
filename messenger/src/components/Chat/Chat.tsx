import {
  Flex,
  Stack,
  Button,
  useColorModeValue,
  Heading,
  Textarea,
  Box,
  Text,
  Input,
} from '@chakra-ui/react'
import { useLocation, useParams } from 'react-router-dom';
import { getUserByHandle, userChannel, userMessage } from '../../services/users.service';
import {
  addMemberToChannel,
  channelMessage,
  getChannelById,
  getChannelMembersLive,
  getChannelMessagesLive, getDateOfLeftChannel, getIfChannelIsLeft, removeLeftChannel,
  setChannelToSeen,
  setAllInChannelToUnseen,
  addTitleToChannel
} from '../../services/channels.service';
import { addMessage, getMessageById } from '../../services/messages';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import MessagesList, { Message } from '../MessagesList/MessagesList';
import { ADDED, ADD_PERSON, ADMIN, CHANGED, CHANGE_TITLE, LEFT_CHAT_MESSAGE, TO, USER_MESSAGE } from '../../common/constants';
import UsersDrawer from '../UsersDrawer/UsersDrawer';
import { MdMoreHoriz } from "react-icons/md";
import EmojiPopover from '../EmojiPopover/EmojiPopover';
import Reply from '../Reply/Reply';
import TeamInfo from '../TeamInfo/TeamInfo';
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { BsSend } from "react-icons/bs";
import { BsFillSendFill } from "react-icons/bs";


const Chat = (): JSX.Element => {

  const location = useLocation();

  const params = useParams();  
  
  const [channelId, setChannelId] = useState<string>();
  
  const team = location.state?.team;
  
  const { userData } = useContext(AppContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const [replyIsVisible, setReplyIsVisible] = useState(false);
  const [messageToReply, setMessageToReply] = useState<Message>({});

  const [ifIsLeftIsSet, setIfIsLeftIsSet] = useState(false);
  const [isLeft, setIsLeft] = useState<boolean>();
  const [dateOfLeaving, setDateOfLeaving] = useState('');

  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const [visibleColor, setVisibleColor] = useState(false);

  useEffect(() => {
    setChannelId(params.id);
  }, [params.id, params])

  useEffect(() => {
    if(userData === null || !channelId) return;
    getIfChannelIsLeft(userData.handle, channelId)
    .then((result) => {
      setIsLeft(result);
      setIfIsLeftIsSet(true);
      if(result){
        getDateOfLeftChannel(userData.handle, channelId)
        .then((res) => {
          setDateOfLeaving(res);
        })
        .catch(e => console.error(e));
      }
    })
    .catch(e => console.error(e));
  }, [channelId, userData]);
  

  const [emoji, setEmoji] = useState<string>('');


  useEffect(() => {
    if (emoji) {
      setNewMessage(newMessage => newMessage + emoji.native);
    }
  }, [emoji]);


  useEffect(() => {
    if(!channelId) return;
    getChannelById(channelId)
      .then(result => {
        setTitle(result.title);
        setNewTitle(result.title);
        setMembers(Object.keys(result.members));
      }).catch(e => console.error(e));
  }, [channelId]);

  useEffect(() => {
    if (userData === null || !channelId) return;

    setMessages([]); 

    const removeListener = getChannelMessagesLive(channelId, (data: string[]) => {
      Promise.all(
        data.map((message) => {
          return getMessageById(message)
            .then(res => res)
            .catch(e => console.error(e));
        })
      ).then(channelMessages => {
        if(ifIsLeftIsSet){
          if(isLeft){
          const messagesBeforeLeaving = channelMessages.filter((message) => message.createdOn <= dateOfLeaving);
          setMessages([...messagesBeforeLeaving]);
          }else{
            setMessages([...channelMessages]);
          }
        }
      })
        .then(() => setChannelToSeen(channelId, userData.handle))
        .catch(error => console.error(error.message));
    });
    return () => {
      removeListener();
    };
  }, [ifIsLeftIsSet, isLeft, channelId, dateOfLeaving, userData]);


  useEffect(() => {
    if (userData === null || !channelId) return;

    getChannelMembersLive(channelId, (data: string[]) => {
      return setMembers([...data]);
    })
  }, [channelId, userData]);

  const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (userData === null) return;
    if (event.key === 'Enter') {
      const message = (event.target as HTMLTextAreaElement).value.trim();
      if (!message) {
        return alert(`Enter message first`)
      }
      if (channelId) {
        addMessage(message, userData.handle, channelId, false, USER_MESSAGE)
          .then(result => {
            channelMessage(channelId, result.id);
            userMessage(result.id, userData.handle);
            setAllInChannelToUnseen(channelId, userData.handle);
          })
          .catch(e => console.error(e));
        (event.target as HTMLTextAreaElement).value = '';
        setNewMessage('');
      }
    }
  }

  const updateNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value)
  }

  const onSendMessage = () => {
    if (userData === null || !channelId) return;
    if (!newMessage) {
      return alert(`Enter message first`)
    }
    addMessage(newMessage, userData.handle, channelId, false, USER_MESSAGE)
      .then(result => {
        channelMessage(channelId, result.id);
        userMessage(result.id, userData.handle);
      })
      .catch(e => console.error(e));
    setNewMessage('');
  }

  const onAddMember = (user: string): void => {
    if(!channelId) return;
    getIfChannelIsLeft(user, channelId)
    .then(result => {
      if(result){
        removeLeftChannel(channelId, user);
      }
      userChannel(channelId, user);
      addMemberToChannel(channelId, user);
      getUserByHandle(user)
      .then(result => result.val())
      .then(res => {
        getChannelById(channelId)
        .then(channel => {
          addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + ADDED + res.firstName + ' ' + res.lastName + TO + channel.title, ADMIN, channelId, true, ADD_PERSON)
          .then(message => {
            channelMessage(channelId, message.id);
          })
          .catch(error => console.error(error.message));
        })
        .catch(error => console.error(error.message));
      })
      .catch(error => console.error(error.message));
    })
  }

  const onGetEmoji = (emoji: string) => {
    setEmoji(emoji);
  }

  const updateNewTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  }

  const onEditTitle = () => {
    setEditTitle(true);
  }

  const onExitEditTitle = () => {
    setEditTitle(false);
  }

  const onUpdateTitle = () => {
    if(!channelId) return;
    addTitleToChannel(channelId, newTitle)
    .then(() => {
      addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + CHANGED + newTitle, ADMIN, channelId, true, CHANGE_TITLE)
      .then(message => {
        channelMessage(channelId, message.id);
      })
      .catch(error => console.error(error.message));
    })
    .catch(error => console.error(error.message));
    setTitle(newTitle);
    setEditTitle(false);
  }

  const handleKeyDownForTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if(!channelId) return;
      const title = (event.target as HTMLInputElement).value.trim();
      addTitleToChannel(channelId, title)
      .then(() => {
        addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + CHANGED + newTitle, ADMIN, channelId, true, CHANGE_TITLE)
        .then(message => {
          channelMessage(channelId, message.id);
        })
        .catch(error => console.error(error.message));
      })
      .catch(error => console.error(error.message));
      setTitle(newTitle);
      setEditTitle(false);
    }
  }

  const onSeeColor = () => {
    setVisibleColor(true);
  }

  const onHideColor = () => {
    setVisibleColor(false);
  }


  const UserDrawerProps = {
    members: members,
    updateNewMember: onAddMember,
    channelId: channelId,
    team: team,
  }  

  return (
    <Flex
      w={'100%'}
      maxW={'100vw'}
      align={'center'}
      direction={'column'}
      justify={'center'}
      pl={30}
      py={12}>
      {!isLeft && 
        <Flex w={'inherit'} mb={10} mt={-10}>
          {!editTitle ? (
          <Flex flex={1}>
            <Heading>{title}</Heading>
            <Button bg={'none'} onClick={onEditTitle}><GrEdit size={20}/></Button>
          </Flex>
          ) : (
            <Flex flex={1}>
              <Input value={newTitle} bg={'grey'} h={'10'} onChange={updateNewTitle} onKeyDown={handleKeyDownForTitle}/>              
              <Button p={1} onClick={onUpdateTitle}><FaCheck size={20}/></Button>
              <Button p={1} onClick={onExitEditTitle}><IoClose size={25}/></Button>
            </Flex>
          )}
          {team && <TeamInfo {...team}/> }
          {members.length > 0 &&
            <UsersDrawer {...UserDrawerProps} />
          }
          <Button colorScheme='teal'>
            <MdMoreHoriz size={30} />
          </Button>
        </Flex>
      }
      <Stack
        maxH={'60vh'}
        w={'inherit'}
        overflowY={'scroll'}
      >
        {ifIsLeftIsSet && 
          <>
            {messages.length > 0 &&
            <Box h={'100vh'}>
              <MessagesList {...{ messages, setReplyIsVisible, setMessageToReply }} />
            </Box>
            }
          </>
        }
      </Stack>
      {isLeft ? (
        <Box>
          <Text>{LEFT_CHAT_MESSAGE}</Text>
        </Box>
      ): (
        <>
          {!replyIsVisible ? (<Stack
            // boxShadow={'2xl'}
            // bg={useColorModeValue('white', 'gray.700')}
            rounded={'xl'}
            w={'60vw'}
            p={10}
            spacing={8}
            align={'center'}
            position={'fixed'}
            bottom={'0'}>
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} h={'7vh'}>
              <Textarea
                mt={-3}
                placeholder={'Write something...'}
                value={newMessage}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={useColorModeValue('gray.100', 'gray.600')}
                rounded={'xl'}
                border={0}
                resize={'none'}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }}
                onKeyDown={handleKeyDownForMessage}
                onChange={updateNewMessage}
              />
              <EmojiPopover onGetEmoji={onGetEmoji} />
              <Button
                ml={-5}
                bg={'none'}
                color={'white'}
                flex={'1 0 auto'}
                onMouseEnter={onSeeColor} 
                onMouseLeave={onHideColor}
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                onClick={onSendMessage}>
                {!visibleColor ? (<BsSend size={35}/>) : (<BsFillSendFill size={35}/>)}
              </Button>
            </Stack>
          </Stack>
          ) : (
            <>
              {channelId && (<Reply channelId={channelId} messageToReply={messageToReply} setReplyIsVisible={setReplyIsVisible} />)}
            </>
          )}
        </>
      )}
    </Flex>
  )
}

export default Chat;