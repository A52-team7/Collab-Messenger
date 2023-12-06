import { AspectRatio, Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { Message } from "../MessagesList/MessagesList";
import { addUserReactionToMessage, getUserByHandle, removeUserReactionFromMessage } from "../../services/users.service";
import { GoReply } from "react-icons/go";
import ReactionPopover from "../ReactionPopover/ReactionPopover";
import Linkify from 'react-linkify';
import { AiOutlineEdit } from "react-icons/ai";
import { ADD_PERSON, CHANGE_TITLE, REMOVE_PERSON, REPLY } from "../../common/constants";
import { ReactionArray, addReactionToMessage, deleteMessage, getMessageById, getMessageReactionsLive, removeReactionFromMessage, updateContentOfMessage } from "../../services/messages";
import { IoPersonAddSharp } from "react-icons/io5";
import { IoPersonRemoveOutline } from "react-icons/io5";
import ReactionItem from "../ReactionItem/ReactionItem";
import RemoveMessage from "../RemoveMessage/RemoveMessage";
import { GrEdit } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import EmojiPopover from "../EmojiPopover/EmojiPopover";
export interface Author {
  handle: string;
  uid: string;
  email: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
  const [toMessage, setToMessage] = useState<Message>({});
  const [authorOfToMessage, setAuthorOfToMessage] = useState('');
  // const [visibleOptions, setVisibleOptions] = useState(false);

  const [reactions, setReactions] = useState<ReactionArray | null>(null);

  const [editMessage, setEditMessage] = useState<boolean>(false);
  const [contentOfMessage, setContentOfMessage] = useState<string>('');

  const [emoji, setEmoji] = useState<string>('');


  useEffect(() => {
    if (emoji) {
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
      .then(result => setAuthorOfMessage(result.val()))
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

  const onGetEmoji = (emoji: string) => {
    setEmoji(emoji);
  }

  return (
    <>
      {message.techMessage ? (
        <Flex position={'relative'} w={'100%'} justifyContent={'center'} alignItems={'center'}>
          {message.typeOfMessage === ADD_PERSON && <IoPersonAddSharp color={'white'} />}
          {message.typeOfMessage === REMOVE_PERSON && <IoPersonRemoveOutline color={'white'} />}
          {message.typeOfMessage === CHANGE_TITLE && <GrEdit color={'white'} />}
          <Text ml={2} color={'white'}>{message.content}</Text>
        </Flex>
      ) : (
        <Flex position={'relative'} direction={'column'} justifyContent={flexAlignment} mb={5}
        // onMouseEnter={onSeeOptions} onMouseLeave={onHideOptions}
        >
          {isReply && (
            <Flex maxW={'500px'} bg='teal.300' rounded='md' w={'fit-content'}>
              <Text color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} ><GoReply size={20} /></Text>
              <Text pr={2} noOfLines={1}>{authorOfToMessage}: {toMessage.content}</Text>
            </Flex>
          )}
          {authorOfMessage && <Flex>
            <Text pl='7px' pr='7px' mr='10px' rounded='md'
              // bg='white'
              // bg={message.author === userData?.handle ? 'rgb(43,237,230)' : 'rgb(180,125,211)'}
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
                bg={message.author === userData?.handle ? 'rgb(105,90,121)' : 'teal.500'}
                rounded={'md'}
                shadow={'md'}
                minW={'230px'}
                maxW={'660px'}
                w={'fit-content'}
              >
                <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                  <>
                  {!decoratedHref.includes('youtube') ? (
                    <a href={decoratedHref} target="_blank" key={key} rel="noopener noreferrer">
                      {decoratedText}
                    </a>
            ) : (
                    <AspectRatio w='640px' h={'360px'} ratio={1} ml={'-10px'} mr={'-10px'}>
                    <iframe
                      title={decoratedText}
                      src={decoratedHref}
                      allowFullScreen
                      />
                    </AspectRatio>
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
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} bg={'none'} onClick={onReply}><GoReply size={20} /></Button>
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} bg={'none'} onClick={onEditMessage}><AiOutlineEdit size={20} /></Button>
                    <RemoveMessage onDeleteMessage={onDeleteMessage} />
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
                    <Button p={1} size={'xs'} color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} bg={'none'} onClick={onReply}><GoReply size={20} /></Button>
                  </Flex>
                }
              </Box>
            ) : (
              <Flex mb={8}>
                <Input value={contentOfMessage} bg={'grey'} h={'10'} w={500} onChange={updateNewMessage} onKeyDown={handleKeyDownForMessage} />
                <EmojiPopover onGetEmoji={onGetEmoji} />
                <Button p={1} color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} onClick={onUpdateMessage}><FaCheck size={20} /></Button>
                <Button p={1} color={'white'} _hover={{ transform: 'scale(1.5)', color: 'white' }} onClick={onExitEditMessage}><IoClose size={25} /></Button>
              </Flex>
            )}
          </Flex>
          {reactions &&
            <Flex mt={'-28px'}>
              {reactions.reactions !== null && reactions.reactions.map((reaction) => (
                <Box key={reaction[0]}>
                  <ReactionItem reaction={reaction} onAddReaction={onAddReaction} onRemoveReaction={onRemoveReaction} />
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