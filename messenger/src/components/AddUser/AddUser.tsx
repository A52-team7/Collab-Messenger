import { Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import SearchUsers from "../SearchUsers/SearchUsers";
import { AddUserSearchProps } from "../UsersDrawer/UsersDrawer";
import { ADD_USERS } from "../../common/constants";


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
              {/*
              !!!IMPORTANT!!!
              Когато си довършиш имплементацията тук и добавиш "теам" като пропс на SearchUsers,
              пушни и ми пиши да довърша да ти търси само по Тийм мембъри :)
              */}
              <SearchUsers updateNewMember={updateNewMember} searchType={ADD_USERS} />
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