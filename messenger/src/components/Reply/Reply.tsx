import { Button, Flex, Stack, Text, Textarea, useColorModeValue } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import EmojiPopover from "../EmojiPopover/EmojiPopover";
import AppContext from "../../context/AppContext";
import { addReply, addReplyToMessage } from "../../services/messages";
import { REPLY } from "../../common/constants";
import { channelMessage } from "../../services/channels.service";
import { userMessage } from "../../services/users.service";
import { Message } from "../MessagesList/MessagesList";
import { BsSend } from "react-icons/bs";
import { BsFillSendFill } from "react-icons/bs";

export interface ReplyProps {
    channelId: string;
    messageToReply: Message;
    setReplyIsVisible: (bool:boolean) => void;
}

const Reply = ({channelId, messageToReply, setReplyIsVisible} : ReplyProps) => {

    const {userData} = useContext(AppContext);
    const [newMessage, setNewMessage] = useState<string>('');

    const [emoji, setEmoji] = useState<string>('');

    const [visibleColor, setVisibleColor] = useState(false);


  useEffect(() => {
    if(emoji){
      setNewMessage(newMessage => newMessage+ emoji.native);
    }
  }, [emoji]);

    const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(userData === null) return;
        if (event.key === 'Enter') {
            const message = (event.target as HTMLInputElement).value.trim();
            if (!message) {
              return alert(`Enter message first`)
            } else {
              addReply(message, userData.handle, channelId, messageToReply.id, false, REPLY)
              .then(result => {
                  addReplyToMessage(messageToReply.id, result.id);
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);          
              })
              .catch(e =>console.error(e));
              (event.target as HTMLTextAreaElement).value = '';
              setNewMessage('');
              setReplyIsVisible(false);
            }
          }
      }
    
      const updateNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
      }
    
      const onSendMessage = () => {
        if(userData === null) return;
        if (!newMessage) {
          return alert(`Enter message first`)
        }
        addReply(newMessage, userData.handle, channelId, messageToReply.id, false, REPLY)
              .then(result => {
                addReplyToMessage(messageToReply.id, result.id);
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);          
              })
              .catch(e =>console.error(e));
        setNewMessage('');
        setReplyIsVisible(false);
      }

      const onGetEmoji = (emoji: string) => {
        setEmoji(emoji);
      }

      const onCloseReply = () => {
        setReplyIsVisible(false);
      }

      const onSeeColor = () => {
        setVisibleColor(true);
      }
    
      const onHideColor = () => {
        setVisibleColor(false);
      }

    return(
        <Stack
        // boxShadow={'2xl'}
        // bg={useColorModeValue('white', 'gray.700')}
        // rounded={'xl'}
        w={'60vw'}
        p={10}
        spacing={8}
        align={'center'}
        position= {'fixed'}
        bottom= {'0'}>
        <Flex maxW={'80%'}  mt={'-15px'} bg={'gray.100'} pl={5} pr={3}>
            <Text alignContent={'center'} noOfLines={1}> Reply to: {messageToReply.content}</Text>
            <Button bg={'teal'} rounded={20} ml={3} size={'xs'} onClick={onCloseReply}>X</Button>
        </Flex>
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
          <EmojiPopover onGetEmoji={onGetEmoji}/>
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
    )
}

export default Reply;