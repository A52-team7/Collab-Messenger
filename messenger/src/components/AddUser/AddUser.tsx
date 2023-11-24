import { Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import AddUsersSearch from "../AddUsersSearch/AddUsersSearch";
import { AddUserSearchProps } from "../UsersDrawer/UsersDrawer";


const AddUser = ({ updateNewMember }: AddUserSearchProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    
    return (
        <>
            <Button pl={10} pr={10} onClick={onOpen}>Add users</Button>
                        
            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Add users</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <AddUsersSearch updateNewMember={updateNewMember}/>
                    </FormControl>
                </ModalBody>
        
                <ModalFooter>
                    <Button colorScheme='blue' mr={3}>
                    Save
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
        
    
}

export default AddUser;