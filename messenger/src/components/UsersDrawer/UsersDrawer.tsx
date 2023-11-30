import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Stack, Text, useDisclosure } from "@chakra-ui/react"
import React from 'react';
import { BsPersonFillAdd } from "react-icons/bs";
import UsersList from "../UsersList/UsersList";
import SearchUsers from "../SearchUsers/SearchUsers";
import { ADD_USERS, ADMIN, LEFT, REMOVE_PERSON } from "../../common/constants";
import { channelMessage, deleteMemberFromChannel, getChannelById } from "../../services/channels.service";
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import RemoveUser from "../RemoveUser/RemoveUser";
import { deleteMemberFromTeam } from "../../services/teams.service";
import {Team} from '../CreateTeam/CreateTeam'
import { addMessage } from "../../services/messages";
import { useNavigate } from "react-router-dom";

export interface UserDrawerProps{
    members: string[];
    updateNewMember: (user: string) => void;
    channelId?: string; 
    team?: Team;
}

const UsersDrawer = ({members, updateNewMember, channelId, team}: UserDrawerProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const firstField = React.useRef<HTMLElement>(null);

    const {userData} = useContext(AppContext);

    const navigate = useNavigate();
    
    const onLeaveChatOrTeam = () => {
        if(userData === null) return;
        if(channelId){
        deleteMemberFromChannel(channelId, userData.handle);
        getChannelById(channelId)
            .then(channel => {
                addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + LEFT + channel.title, ADMIN, channelId, true, REMOVE_PERSON)
                .then(message => {
                channelMessage(channelId, message.id);
                })
                .then(() => navigate('/'))
                .catch(error => console.error(error.message));
            })
            .catch(error => console.error(error.message));
      } else if(team){
        deleteMemberFromTeam(team.id, userData.handle);
      }

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
                {team ? (
                      <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember} team={team}/>
                    ) : (<SearchUsers searchType={ADD_USERS} updateNewMember={updateNewMember}/>)}
                </Stack>
                <Stack>
                  {channelId && (
                    <UsersList {...{members: members, channelId: channelId}}/>
                  )}
                </Stack>
                <Stack alignItems={'center'}>
                    {team && team?.owner !== userData?.handle ? ( 
                    <RemoveUser onDelete={onLeaveChatOrTeam} selfRemove={true}/>
                    ) : (
                      <RemoveUser onDelete={onLeaveChatOrTeam} selfRemove={true}/>
                    )}
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
  };

export default UsersDrawer