import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import React, { useContext } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { channelMessage, getChannelById, removeChat, removeChatForBothUsers } from "../../services/channels.service";
import AppContext from '../../context/AppContext';
import { addMessage } from "../../services/messages";
import { ADMIN, LEFT, REMOVE_PERSON } from "../../common/constants";
import { useNavigate } from "react-router-dom";
import { FiXOctagon   } from "react-icons/fi";

export interface RemoveMessageOrChatProps {
  onDeleteMessage?: () => void;
  channelId?: string;
  isFromChat: boolean;
}

const RemoveMessageOrChat = ({onDeleteMessage, channelId, isFromChat} : RemoveMessageOrChatProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();

    const { userData } = useContext(AppContext);
    const navigate = useNavigate();

    const onDeleteMessageOrChat = () => {
        if(channelId){
            if(userData===null) return;
            getChannelById(channelId)
            .then(channel => {
                if(Object.keys(channel).includes('isBetweenTwo')){                    
                    removeChatForBothUsers(channelId);
                    navigate('/');
                }else{
                    removeChat(channelId, userData.handle);
                    addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + LEFT + channel.title, ADMIN, channelId, true, REMOVE_PERSON)
                    .then(message => {
                    channelMessage(channelId, message.id);
                    })
                    .then(()=> navigate('/'))
                    .catch(error => console.error(error.message));
                    }
            })
            .catch(error => console.error(error.message));
        }else if(onDeleteMessage){
            onDeleteMessage();
        }
    }
  
    return (
      <>
        {!isFromChat ? (
            <Button p={1} variant='unstyled' size={'xs'} color={'white'}  _hover={{ transform: 'scale(1.3)', color: 'white' }} bg={'none'} onClick={onOpen}><AiOutlineDelete size={20} /></Button>
        ) : (
            <Button  
            variant='unstyled' 
            color={'red'} 
            onClick={onOpen} 
            _hover={{ opacity: '0.8' }} 
            leftIcon={<FiXOctagon size={'20px'} />}>Remove chat</Button>
        )}
        
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            {channelId ? (
                <>
                    <AlertDialogHeader>Delete chat?</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to delete the chat? You can't undo this action afterwards.
                    </AlertDialogBody>
                </>
            ) : (
                <>
                    <AlertDialogHeader>Delete message?</AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure you want to delete the message? You can't undo this action afterwards.
                    </AlertDialogBody>
                </>
            )}
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme='red' ml={3} onClick={onDeleteMessageOrChat}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  export default RemoveMessageOrChat;