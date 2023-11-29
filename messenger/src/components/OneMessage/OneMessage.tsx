import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { Message } from "../MessagesList/MessagesList";
import { getUserByHandle } from "../../services/users.service";
import { GoReply } from "react-icons/go";
import ReactionPopover from "../ReactionPopover/ReactionPopover";
import Linkify from 'react-linkify';
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineEdit } from "react-icons/ai";
import { REPLY } from "../../common/constants";
import { getMessageById } from "../../services/messages";
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
  setReplyIsVisible: (bool:boolean) => void;
  setMessageToReply: (messageContent: Message) => void;
}

const OneMessage = ({message, setReplyIsVisible, setMessageToReply}: OneMessageProps) => {

    const {userData} = useContext(AppContext);

    const [authorOfMessage, setAuthorOfMessage] = useState<Author>();
    const [isReply, setIsReply] = useState(false);
    const [toMessage, setToMessage] = useState<Message>({});
    const [authorOfToMessage, setAuthorOfToMessage] = useState('');
    const [visibleOptions, setVisibleOptions] = useState(false);

    useEffect(() => {
      if(message.typeOfMessage === REPLY){
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
      getUserByHandle(message.author)
      .then(result => setAuthorOfMessage(result.val()))
      .catch(error => console.error(error.message));
    }, []);
    

    if(userData === null) return;
    const flexAlignment = message.author===userData.handle ? 'flex-end' : 'flex-start';


    const onReply = () => {
      setReplyIsVisible(true);
      setMessageToReply(message);
    }

    const onSeeOptions = () => {
      setVisibleOptions(true);
    }

    const onHideOptions = () => {
      setVisibleOptions(false);
    }
    
return(
    <Flex direction={'column'} justifyContent={flexAlignment} onMouseEnter={onSeeOptions} onMouseLeave={onHideOptions}>
        {isReply && (
            <Flex maxW={'500px'}>
                <Text pr={2} noOfLines={1}>Replied to: {authorOfToMessage}: {toMessage.content}</Text>
            </Flex>
          )}
        {authorOfMessage && <Flex>
            <Text pl='7px' pr='7px' mr='10px'  rounded='md' bg='teal.400'>{authorOfMessage.firstName} {authorOfMessage.lastName}</Text>
            <Text fontSize='sm' pr={5}>{message.createdOn.toLocaleString("en-GB").slice(0, 17)}</Text>
        </Flex> 
        }  
        <Flex alignItems={'center'}>
            <Box
              pt='10px'
              pb='10px'
              pl='20px'
              pr='20px'
              color='white'
              mb='4'
              bg='teal.500'
              rounded='md'
              shadow='md'
              // minW={'350px'}
              maxW={'80%'}
              w={'fit-content'} 
            >
            <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
              <a href={decoratedHref} target="_blank" key={key} rel="noopener noreferrer">
                {decoratedText}
              </a>
            )}>
              {message.content}
            </Linkify>
            </Box> 
            {visibleOptions && (
            <Flex>
              <ReactionPopover/>
              <Button p={1} size={'xs'} bg={'none'} onClick={onReply}><GoReply size={20}/></Button>
              {message.author===userData.handle && (
                <>
                  <Button p={1} size={'xs'} bg={'none'}><AiOutlineEdit size={20}/></Button>
                  <Button p={1} size={'xs'} bg={'none'}><AiOutlineDelete size={20}/></Button>
                </>
              )}
            </Flex>
            )}
          </Flex>
    </Flex>   
)
}

export default OneMessage;