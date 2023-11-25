import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import UsersList from "../UsersList/UsersList";
import SearchUsers from "../SearchUsers/SearchUsers";
import { ADD_USERS } from "../../common/constants";
import { deleteMemberFromChannel } from "../../services/channels.service";
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import RemoveUser from "../RemoveUser/RemoveUser";

export interface UserDrawerProps{
    members: string[];
    updateNewMember: (user: string) => void;
    id: string
}

const UsersDrawer = ({members, updateNewMember, id}: UserDrawerProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<HTMLElement>(null);

    const {userData} = useContext(AppContext);

    const onLeaveChat = () => {
        if(userData === null) return;
        deleteMemberFromChannel(id, userData.handle);
    }
  
    return (
      <>
        <Button colorScheme='teal' onClick={onOpen}>
            <BsPersonFillAdd size={30}/><Text fontSize='xl'>{members.length}</Text>
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          initialFocusRef={firstField}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Members
            </DrawerHeader>
  
            <DrawerBody>
                <Stack w={'18vw'} mb={20}>
                    <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember}/>
                </Stack>
                <Stack>
                    <UsersList {...{members: members, id: id}}/>
                </Stack>
                <Stack alignItems={'center'}>
                    <RemoveUser onDelete={onLeaveChat} selfRemove={true}/>
                </Stack>
            </DrawerBody>
  
            <DrawerFooter borderTopWidth='1px'>
                <Stack alignItems={'center'} w={'100%'}>
                    <Button variant='outline' mr={3} onClick={onClose}>
                    Cancel
                    </Button>
                </Stack>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

export default UsersDrawer