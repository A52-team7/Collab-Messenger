import { AspectRatio, Avatar, Box, Button, Flex, Input, Stack, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { Message } from "../MessagesList/MessagesList";
import { addUserReactionToMessage, getUserByHandle, removeUserReactionFromMessage } from "../../services/users.service";
import { GoReply } from "react-icons/go";
import ReactionPopover from "../ReactionPopover/ReactionPopover";
import Linkify from 'react-linkify';
import { AiOutlineEdit } from "react-icons/ai";
import { ADD_PERSON, CHANGE_TITLE, EVENT, REMOVE_PERSON, REPLY } from "../../common/constants";
import { ReactionArray, addReactionToMessage, deleteMessage, getMessageById, getMessageReactionsLive, removeReactionFromMessage, updateContentOfMessage } from "../../services/messages";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoPersonRemoveOutline } from "react-icons/io5";
import ReactionItem from "../ReactionItem/ReactionItem";
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import EmojiPopover from "../EmojiPopover/EmojiPopover";
import RemoveMessageOrChat from "../RemoveMessageOrChat/RemoveMessageOrChat";
import ImageModal from "../ImageModal/ImageModal";
import { MdEventAvailable } from "react-icons/md";

export interface Author {
  handle: string;
  uid: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePhoto: string;
}

export interface OneMessageProps {
  message: Message;
  setReplyIsVisible: (bool: boolean) => void;
  setMessageToReply: (messageContent: Message) => void;
}

const OneMessage = ({ message, setReplyIsVisible, setMessageToReply }: OneMessageProps) => {

  const { userData } = useContext(AppContext);

  const [authorOfMessage, setAuthorOfMessage] = useState<Author>();
  const [isReply, setIsReply] = useState(false);
  const [toMessage, setToMessage] = useState<Message>({
    id: '',
    content: '',
    author: '',
    createdOn: '',
    techMessage: false,
    typeOfMessage: '',
    toMessage: '',
    toChannel: '',
    reactions: []});
  const [authorOfToMessage, setAuthorOfToMessage] = useState('');
  // const [visibleOptions, setVisibleOptions] = useState(false);

  const [reactions, setReactions] = useState<ReactionArray | null>(null);

  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [contentOfMessage, setContentOfMessage] = useState<string>('');

  const [imageSrc, setImageSrc] = useState('');

  const [emoji, setEmoji] = useState<object | null>(null);


  useEffect(() => {
    if (emoji && 'native' in emoji) {
      setContentOfMessage(message => message + emoji.native);
    }
  }, [emoji]);

  useEffect(() => {
    if (message.typeOfMessage === REPLY) {
      getMessageById(message.toMessage)
        .then(result => {
          setToMessage(result);
          getUserByHandle(result.author)
            .then(res => res.val())
            .then(r => setAuthorOfToMessage(r.firstName + ' ' + r.lastName))
            .catch(error => console.error(error.message));
        })
        .catch(error => console.error(error.message));
      setIsReply(true);
    }
  }, []);

  useEffect(() => {
    setContentOfMessage(message.content);
  }, []);


  useEffect(() => {
    getUserByHandle(message.author)
      .then(result => {
        setAuthorOfMessage(result.val());
        if(result.val().profilePhoto){
          setImageSrc(result.val().profilePhoto);
        }
      })
      .catch(error => console.error(error.message));
  }, []);

  useEffect(() => {
    if (userData === null) return;
    getMessageReactionsLive(message.id, (data: ReactionArray) => {
      setReactions(data);
    })

  }, [message.id, userData]);


  if (userData === null) return;
  const flexAlignment = message.author === userData.handle ? 'flex-end' : 'flex-start';


  const onReply = () => {
    setReplyIsVisible(true);
    setMessageToReply(message);
  }

  // const onSeeOptions = () => {
  //   setVisibleOptions(true);
  // }

  // const onHideOptions = () => {
  //   setVisibleOptions(false);
  // }

  const onAddReaction = (reaction: string) => {
    addReactionToMessage(message.id, reaction, userData.handle);
    addUserReactionToMessage(message.id, reaction, userData.handle);
  }

  const onRemoveReaction = (reaction: string) => {
    removeReactionFromMessage(message.id, reaction, userData.handle);
    removeUserReactionFromMessage(message.id, reaction, userData.handle);
  }

  const onDeleteMessage = () => {
    deleteMessage(message.id);
  }

  const updateNewMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentOfMessage(e.target.value);
  }

  const onEditMessage = () => {
    setEditMessage(true);
  }

  const onExitEditMessage = () => {
    setEditMessage(false);
  }

  const onUpdateMessage = () => {
    updateContentOfMessage(message.id, contentOfMessage);
    setEditMessage(false);
  }

  const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const messageContent = (event.target as HTMLInputElement).value.trim();
      updateContentOfMessage(message.id, messageContent);
      setEditMessage(false);
    }
  }

  const onGetEmoji = (emoji: object | null) => {
    setEmoji(emoji);
  }

  return (
    <>
      {message.techMessage ? (
        <Flex position={'relative'} w={'100%'} justifyContent={'center'} alignItems={'center'}>
          {message.typeOfMessage === ADD_PERSON && <IoPersonAddSharp color={'white'} />}
          {message.typeOfMessage === REMOVE_PERSON && <IoPersonRemoveOutline color={'white'} />}
          {message.typeOfMessage === CHANGE_TITLE && <GrEdit color={'white'} />}
          {message.typeOfMessage === EVENT && <MdEventAvailable color={'white'} />}
          <Text ml={2} color={'white'}>{message.content}</Text>
        </Flex>
      ) : (
        <Flex position={'relative'} direction={'column'} justifyContent={flexAlignment} mb={10}
        // onMouseEnter={onSeeOptions} onMouseLeave={onHideOptions}
        >
          {isReply && (
            <Flex maxW={'270px'} bg={message.author === userData?.handle ? 'rgb(186,124,215)' : 'teal.300'} rounded='md' w={'fit-content'}>
              <Text color={'white'}><GoReply size={20} /></Text>
              <Text pr={2} noOfLines={1}>{authorOfToMessage}: {toMessage.content}</Text>
            </Flex>
          )}
          {authorOfMessage && <Flex alignItems={'center'}>
            <Avatar size={'sm'} name={(authorOfMessage.firstName + ' ' + authorOfMessage.lastName)} src={imageSrc} />
            <Text pl='7px' pr='7px' mr='6px' rounded='md'
              color={'white'}
              fontWeight={'bold'}
            >{authorOfMessage.firstName} {authorOfMessage.lastName}</Text>
            <Text fontSize='sm' color={'white'} pr={5}>{message.createdOn.toLocaleString("en-GB").slice(0, 17)}</Text>
          </Flex>
          }
          <Flex alignItems={'center'}>
            {!editMessage ? (
              <Box
                pt={'10px'}
                pb={'10px'}
                pl={'20px'}
                pr={'20px'}
                color={'white'}
                mb={'4'}
                bg={message.author === userData?.handle ? 'rgb(121 103 141)' : 'teal.500'}
                rounded={'md'}
                shadow={'md'}
                minW={'300px'}
                maxW={'660px'}
                w={'fit-content'}
              >
                <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                  <>
                    {decoratedHref.includes('youtube') ? (
                      <AspectRatio w='640px' h={'360px'} ratio={1} ml={'-10px'} mr={'-10px'}>
                        <iframe title={decoratedText} src={decoratedHref} allowFullScreen />
                      </AspectRatio>
                      ) : (
                    <>
                      {decoratedHref.startsWith('https://firebasestorage') ? (
                        <Box h={'350px'}>
                          <ImageModal imageSrc={decoratedHref}/>
                        </Box>
                      ) : (
                        <>
                          {decoratedHref.includes('giphy') ? (
                            <Stack position="relative">
                              <AspectRatio w='350px' ratio={1}>
                                <iframe title={decoratedText} src={decoratedHref} allowFullScreen />
                              </AspectRatio>
                              <Box position="absolute" top="0" left="0" w="100%" h="100%" />
                            </Stack>
                          ) : (
                            <a href={decoratedHref} target="_blank" key={key} rel="noopener noreferrer">
                              {decoratedText}
                            </a>
                          )}
                        </>
                      )}
                    </>
                    )}
                  </>
                )}>
                  {contentOfMessage}
                </Linkify>
                
                {/* {visibleOptions &&  */}
                {message.author === userData.handle &&
                  <Flex position={'absolute'}
                    top={'60%'}
                    left={'-111px'}
                  // transform={'translateY(-50%)'}
                  >
                    <ReactionPopover onAddReaction={onAddReaction} />
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.3)', color: 'white' }} bg={'none'} onClick={onReply}><GoReply size={20} /></Button>
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.3)', color: 'white' }} bg={'none'} onClick={onEditMessage}><AiOutlineEdit size={20} /></Button>
                    <RemoveMessageOrChat onDeleteMessage={onDeleteMessage} isFromChat={false} />
                  </Flex>
                }
                {/* {visibleOptions &&  */}
                {message.author !== userData.handle &&
                  <Flex position={'absolute'}
                    top={'60%'}
                    right={'-55px'}
                    // transform={'translateY(-50%)'}
                    bg={'none'}
                  >
                    <ReactionPopover onAddReaction={onAddReaction} />
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.3)', color: 'white' }} bg={'none'} onClick={onReply}><GoReply size={20} /></Button>
                  </Flex>
                }
              </Box>
            ) : (
              <Flex mb={8}>
                <Input value={contentOfMessage} bg={'rgb(237,254,253)'} h={'10'} w={500} onChange={updateNewMessage} onKeyDown={handleKeyDownForMessage} />
                <EmojiPopover onGetEmoji={onGetEmoji} />
                <Button 
                  p={1}
                  bg={'teal.100'}
                  opacity={0.9}
                  _hover={{ bg: 'teal.100' }}
                  border={'1px solid'}
                  borderColor={'teal'}
                  color={'teal'}  
                  onClick={onUpdateMessage}>
                  <FaCheck size={20} />
                </Button>
                <Button 
                  p={1}
                  bg={'teal.100'}
                  opacity={0.9}
                  _hover={{ bg: 'teal.100' }}
                  border={'1px solid'}
                  borderColor={'teal'}
                  color={'teal'}
                  onClick={onExitEditMessage}>
                  <IoClose size={25} />
                </Button>
              </Flex>
            )}
          </Flex>
          {reactions &&
            <Flex mt={'-28px'}>
              {reactions.reactions !== null && reactions.reactions.map((reaction) => (
                <Box key={reaction[0]}>
                  <ReactionItem reaction={reaction} onAddReaction={onAddReaction} onRemoveReaction={onRemoveReaction} isOnUserMessage={message.author === userData?.handle}/>
                </Box>
              ))}
            </Flex>
          }
        </Flex>
      )}
    </>
  )
}

export default OneMessage;