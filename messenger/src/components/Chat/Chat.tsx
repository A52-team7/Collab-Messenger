import {
  Flex,
  Stack,
  Button,
  useColorModeValue,
  Heading,
  Textarea,
  Box,
  Input,
  Alert,
  AlertIcon,
  Image,
  Text,
  Tooltip,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { useLocation, useParams } from 'react-router-dom';
import { getUserByHandle, userChannel, userMessage, setAllUsersUnseen } from '../../services/users.service';
import {
  addMemberToChannel,
  channelMessage,
  getChannelById,
  getChannelMembersLive,
  getChannelMessagesLive, getDateOfLeftChannel, getIfChannelIsLeft, removeLeftChannel,
  setChannelToSeen,
  setAllInChannelToUnseen,
  addTitleToChannel,
  getLeftMembersLive,
} from '../../services/channels.service';
import { addMessage, getMessageById } from '../../services/messages';
import { useContext, useEffect, useState, useRef } from 'react';
import AppContext from '../../context/AppContext';
import MessagesList, { Message } from '../MessagesList/MessagesList';
import { ADDED, ADD_PERSON, ADMIN, CHANGED, CHANGE_TITLE, LEFT_CHAT_MESSAGE, TO, USER_MESSAGE } from '../../common/constants';
import UsersDrawer from '../UsersDrawer/UsersDrawer';
import EmojiPopover from '../EmojiPopover/EmojiPopover';
import Reply from '../Reply/Reply';
import TeamInfo from '../TeamInfo/TeamInfo';
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ChatMoreOptions from '../ChatMoreOptions/ChatMoreOptions';
import SendImagePopover from '../SendImagePopover/SendImagePopover';
import { AiOutlineDelete } from "react-icons/ai";
import { FirebaseStorage, StorageReference, getDownloadURL, getStorage, uploadBytes, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import SendButton from '../SendButton/SendButton';
import { FaVideo } from "react-icons/fa";

const Chat = (): JSX.Element => {

  const location = useLocation();

  const params = useParams();

  const [channelId, setChannelId] = useState<string>();

  const team = location.state?.team;

  const { userData } = useContext(AppContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const [replyIsVisible, setReplyIsVisible] = useState(false);
  const [messageToReply, setMessageToReply] = useState<Message>({});

  const [ifIsLeftIsSet, setIfIsLeftIsSet] = useState(false);
  const [isLeft, setIsLeft] = useState<boolean>();
  const [dateOfLeaving, setDateOfLeaving] = useState('');

  const [editTitle, setEditTitle] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');

  const [chatBetweenTwo, setChatBetweenTwo] = useState<boolean>();
  const [ifChatBetweenTwoIsSet, setIfChatBetweenTwoIsSet] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [image, setImage] = useState<string | ArrayBuffer>('');
  const [imageSrc, setImageSrc] = useState<File | null>(null);
  const navigate = useNavigate();

  const [messagesAreLoaded, setMessagesAreLoaded] = useState(false);

  useEffect(() => {
    setChannelId(params.id);
  }, [params.id, params, isLeft]);

  useEffect(() => {
    if (userData === null || !channelId) return;
    const removeListener = getLeftMembersLive(channelId, (data: string[]) => {

      if (Object.values(data).includes(userData.handle)) {
        setIsLeft(true);
        setIfIsLeftIsSet(true);
        getDateOfLeftChannel(userData.handle, channelId)
          .then((res) => {
            setDateOfLeaving(res);
          })
          .catch(e => console.error(e));
      }
    });
    return () => {
      removeListener();
    };
  }, [channelId, userData, isLeft]);


  const [emoji, setEmoji] = useState<string>('');


  useEffect(() => {
    if (emoji) {
      if (!textAreaRef.current) return;
      textAreaRef.current.value += emoji.native;
      setEmoji('');
    }
  }, [emoji]);


  useEffect(() => {
    if (!channelId) return;
    getChannelById(channelId)
      .then(result => {
        setTitle(result.title);
        setNewTitle(result.title);
        setMembers(Object.keys(result.members));

        if (Object.keys(result).includes('isBetweenTwo')) {
          setChatBetweenTwo(true);
          setIfChatBetweenTwoIsSet(true);
          const usersInChat = result.title.split(',');
          const titleToShow = usersInChat.findIndex((user: string) => user !== (userData?.firstName + ' ' + userData?.lastName));

          setTitle(usersInChat[titleToShow]);
        } else {
          setChatBetweenTwo(false);
          setIfChatBetweenTwoIsSet(true);
        }
      }).catch(e => console.error(e));
  }, [channelId]);

  useEffect(() => {
    if (userData === null || !channelId) return;

    setMembers([]);

    const removeListener = getChannelMembersLive(channelId, (data: string[]) => {
      setMembers([...data]);
      if (userData === null) return;
      if (data.includes(userData.handle)) {
        setIsLeft(false);
        setIfIsLeftIsSet(true);
      }
    });
    return () => {
      removeListener();
    };
  }, [channelId, userData]);

  useEffect(() => {
    if (userData === null || !channelId) return;

    setMessages([]);
    setMessagesAreLoaded(false);

    const removeListener = getChannelMessagesLive(channelId, (data: string[]) => {
      if(!data){
        setMessagesAreLoaded(true);
      }else{
      Promise.all(
        data.map((message) => {
          return getMessageById(message)
            .then(res => res)
            .catch(e => console.error(e));
        })
      ).then(channelMessages => {
        if (ifIsLeftIsSet) {
          if (isLeft) {
            const messagesBeforeLeaving = channelMessages.filter((message) => message.createdOn <= dateOfLeaving);
            setMessages([...messagesBeforeLeaving]);
          } else {
            setMessages([...channelMessages]);
          }
        }
      })
        .then(() => setMessagesAreLoaded(true))
        .then(() => setChannelToSeen(channelId, userData.handle))
        .catch(error => console.error(error.message));
    }
    });
    return () => {
      removeListener();
    };
  }, [ifIsLeftIsSet, isLeft, channelId, dateOfLeaving, userData]);

  const uploadImageToFBAndSendAMessage = (): Promise<void> | void => {
    if (imageSrc) {
      return new Promise((resolve, reject) => {
        const storage: FirebaseStorage = getStorage();
        const fileId = uuidv4();
        const folderPath: string = `${channelId}/${fileId}`;
        const storageRef: StorageReference = ref(storage, folderPath);
        uploadBytes(storageRef, imageSrc)
          .then(() => {
            const storageRef: StorageReference = ref(storage, folderPath);
            return storageRef;
          })
          .then(storageRef => {
            const url: Promise<string> = getDownloadURL(storageRef);
            return url;
          })
          .then(url => {
            if (channelId && userData) {
              addMessage(url, userData.handle, channelId, false, USER_MESSAGE)
                .then(result => {
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);
                  setAllInChannelToUnseen(channelId, userData.handle);
                })
                .then(() => {
                  if (userData) {
                    if (team) {
                      setAllUsersUnseen(members, userData.handle, 'teams');
                    } else {
                      setAllUsersUnseen(members, userData.handle, 'chats');
                    }
                  }
                })
                .then(() => {
                  setImageSrc(null);
                })
                .catch(e => console.error(e));
            }
            resolve();
          })
          .catch((err: Error) => {
            console.error(err);
            return reject(err);
          });
      });
    }
  };

  const onSendMessage = (event: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (!textAreaRef.current) return;
      const messageFromArea = textAreaRef.current.value.trim();
      if (!messageFromArea && !imageSrc) {
        return alert(`Enter message first`)
      }
      if (imageSrc) {
        uploadImageToFBAndSendAMessage();
      } else {
        if (channelId && userData) {
          addMessage(messageFromArea, userData.handle, channelId, false, USER_MESSAGE)
            .then(result => {
              channelMessage(channelId, result.id);
              userMessage(result.id, userData.handle);
              setAllInChannelToUnseen(channelId, userData.handle);
            })
            .then(() => {
              if (userData) {
                if (team) {
                  setAllUsersUnseen(members, userData.handle, 'teams');
                } else {
                  setAllUsersUnseen(members, userData.handle, 'chats');
                }
              }
            })
            .then(() => textAreaRef.current.value = '')
            .catch(e => console.error(e));
        }
      }
    }
  }

  const onAddMember = (user: string): void => {
    if (!channelId) return;
    getIfChannelIsLeft(user, channelId)
      .then(result => {
        if (result) {
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
    if (!channelId) return;
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
      if (!channelId) return;
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

  const removeFilePhoto = () => {
    setImageSrc(null);
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
        <Flex w={'inherit'} h={'50px'} mb={8} mt={-10}>
          {!editTitle ? (
            <Flex flex={1}>
              <Heading color={'white'}>{title}</Heading>
              {!chatBetweenTwo &&
                <Button color={'white'} _hover={{ transform: 'scale(1.3)', color: 'white' }} bg={'none'} onClick={onEditTitle}><GrEdit size={20} /></Button>
              }
            </Flex>
          ) : (
            <Flex flex={1}>
              <Input value={newTitle} bg={'rgb(237,254,253)'} h={'10'} onChange={updateNewTitle} onKeyDown={handleKeyDownForTitle} />
              <Button 
                  bg={'teal.100'}
                  opacity={0.9}
                  _hover={{ bg: 'teal.100' }}
                  border={'1px solid'}
                  borderColor={'teal'}
                  color={'teal'} 
                  p={1} 
                  onClick={onUpdateTitle}>
                    <FaCheck size={20} />
              </Button>
              <Button 
                  bg={'teal.100'}
                  opacity={0.9}
                  _hover={{ bg: 'teal.100' }}
                  border={'1px solid'}
                  borderColor={'teal'}
                  color={'teal'}
                  p={1} 
                  onClick={onExitEditTitle}>
                    <IoClose size={25} />
              </Button>
            </Flex>
          )}
          {team && <TeamInfo {...team} />}
          <Button colorScheme='teal' onClick={() => navigate('/video', { state: { channelId: channelId } })}><FaVideo size={25}/></Button>

          {ifChatBetweenTwoIsSet && (
            <>
              {members.length > 0 && !chatBetweenTwo &&
                <UsersDrawer {...UserDrawerProps} />
              }
            </>
          )}
          {channelId && <ChatMoreOptions messages={messages} channelId={channelId} />}
        </Flex>
      }
      <Stack
        maxH={'60vh'}
        w={'inherit'}
      >
        {ifIsLeftIsSet &&
          <Stack
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'black',
              borderRadius: '24px',
            },
          }}>
          {!messagesAreLoaded ? (
            <Center height="100vh">
              <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
              />
            </Center>
          ) : (
            <>
            {messages.length > 0 ?(
              <Box h={'auto'}>
                <MessagesList {...{ messages, setReplyIsVisible, setMessageToReply }} />
              </Box>
            ) : (
            <Center>
              <Image src={'/no_messages.jpg'} h={'420px'} w={'420px'} opacity={0.9}/>
            </Center>
            )}
            </>
          )} 
          </Stack>
        }
      </Stack>
      {isLeft ? (
        <Box mt={50}>
          <Alert status='warning'>
            <AlertIcon />
            {LEFT_CHAT_MESSAGE}
          </Alert>
        </Box>
      ) : (
        <>
          {!replyIsVisible ? (<Stack
            h={'100px'}
            rounded={'xl'}
            w={'60vw'}
            spacing={8}
            align={'center'}
            position={'fixed'}
            bottom={'0'}
          >
            {imageSrc && <Flex
              position="fixed"
              zIndex="9999"
              p={20}
              pr={5}
              backgroundColor="rgba(0, 0, 0, 0.9)"
              mt={'-300px'}
              w={'fit-content'}
              h={'300px'}
            >
              <Image src={image} h={'300px'} mt={'-80px'} />
              <Flex ml={2} mt={-65} textAlign={'center'} justifyContent={'center'}>
                <Text fontWeight={'bold'} fontSize={'sm'} color={'white'} isTruncated>
                  {imageSrc.name}
                </Text>
                <Tooltip hasArrow label={'Remove file'} bg={'rgb(237,254,253)'} color='black'>
                  <Button
                    bg={'none'}
                    size={'sm'}
                    color={'red'}
                    p={0}
                    _hover={{ opacity: 0.7 }}
                    onClick={removeFilePhoto}
                  >
                    <AiOutlineDelete size={23} />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>}
            <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} alignItems={'center'}>
              {channelId && <SendImagePopover setImage={setImage} setImageSrc={setImageSrc}/>}
              <Textarea
                ref={textAreaRef}
                placeholder={'Write something...'}
                color={useColorModeValue('gray.800', 'gray.200')}
                bg={'rgb(237,254,253)'}
                rounded={'xl'}
                border={0}
                resize={'none'}
                _focus={{
                  bg: useColorModeValue('gray.200', 'gray.800'),
                  outline: 'none',
                }}
                white-space='nowrap'
                overflow-wrap='break-word'
                onKeyDown={onSendMessage}
              />
              <EmojiPopover onGetEmoji={onGetEmoji} />
              <SendButton onSendMessage={onSendMessage}/>
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