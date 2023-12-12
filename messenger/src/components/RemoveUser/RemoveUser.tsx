import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import React from 'react';

interface RemoveUserProps {
    name?: string;
    onDelete: () => void;
    selfRemove: boolean;
}

const RemoveUser = ({name, onDelete, selfRemove}: RemoveUserProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
  
    return (
      <>
        {!selfRemove ? (
            <Button 
            bg={'none'}
            _hover={{ bg: 'teal.300', opacity: 0.8 }} 
            rounded={20} 
            onClick={onOpen}>
            x
            </Button>
        ) : (
            <Button bg={'teal.500'} _hover={{opacity: 0.8 }} rounded={20} onClick={onOpen}>
            Leave chat
            </Button>
        )}
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
            {!selfRemove ? (
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Remove {name}
              </AlertDialogHeader>
                ) : (
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Leave chat
                    </AlertDialogHeader>
                )
            }
  
            {!selfRemove ? (
              <AlertDialogBody>
                    Are you sure you want to remove {name} from the chat? 
              </AlertDialogBody>
            ) : (
                <AlertDialogBody>
                    Are you sure you want to leave the chat? 
                </AlertDialogBody>
            )
            }
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                {!selfRemove ? (
                <Button colorScheme='red' onClick={onDelete} ml={3}>
                  Delete
                </Button>
                ) : (
                  <Button colorScheme='red' onClick={onDelete} ml={3}>
                  Leave
                </Button>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }

  export default RemoveUser;