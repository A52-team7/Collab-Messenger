import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

export interface RemoveMessageProps {
  onDeleteMessage: () => void;
}

const RemoveMessage = ({onDeleteMessage} : RemoveMessageProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
  
    return (
      <>
        {/* <Button onClick={onOpen}>Discard</Button> */}
        <Button p={1} size={'xs'} color={'white'}  _hover={{ transform: 'scale(1.5)', color: 'white' }} bg={'none'} onClick={onOpen}><AiOutlineDelete size={20} /></Button>
        <AlertDialog
          motionPreset='slideInBottom'
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered
        >
          <AlertDialogOverlay />
  
          <AlertDialogContent>
            <AlertDialogHeader>Delete message?</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete the message? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme='red' ml={3} onClick={onDeleteMessage}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  export default RemoveMessage;