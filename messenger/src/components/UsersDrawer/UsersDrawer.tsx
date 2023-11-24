import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Stack, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import UsersList from "../UsersList/UsersList";
import AddUser from "../AddUser/AddUser";

export interface UserDrawerProps{
    members: string[];
    updateNewMember: (user: string) => void;
    channelId: string
}

const UsersDrawer = ({members, updateNewMember, channelId}: UserDrawerProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<HTMLElement>(null);
  
    return (
      <>
        <Button colorScheme='teal' onClick={onOpen}>
            <BsPersonFillAdd size={30}/>
        </Button>
        <Drawer
          isOpen={isOpen}
          placement='right'
          initialFocusRef={firstField}
          onClose={onClose}
        >
          <DrawerOverlay />
          <DrawerContent h={400}>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>
              Members
            </DrawerHeader>
  
            <DrawerBody>
                <Stack>
                    <UsersList {...{members: members, channelId: channelId}}/>
                </Stack>
              <Stack spacing='24px' m={10} alignItems={'center'}>
                <Box>
                  <AddUser updateNewMember={updateNewMember}/>
                </Box>
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