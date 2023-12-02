import {
    Button,
    Flex,
    Heading,
    Input,
    Stack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    useDisclosure,
    Avatar,
    Text,
    Wrap,
    WrapItem,
    Tabs, TabList, TabPanels, Tab, TabPanel
  } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react'
import AppContext, { UserState } from '../../context/AppContext';
import { getAllUsersData } from '../../services/users.service';
import { getChannelById } from '../../services/channels.service';
import {Team} from '../CreateTeam/CreateTeam';
import { FcAbout } from "react-icons/fc";
import {User} from '../SearchUsers/SearchUsers';
import {Channel} from '../MyChatsSideNavBar/MyChatsSideNavBar'


const TeamInfo = (team: Team) => {
  const { userData } = useContext<UserState>(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [members, setMembers] = useState<User[]>([])
  const [owner, setOwner] = useState<User>({})
  const [allChannels, setAllChannels] = useState<Channel[]>([])

  useEffect(() =>{
    getAllUsersData()
    .then(data =>{
        const snapshot: User[] = Object.values(data.val());
        const members = Object.keys(team.members)
        const teamMembers = snapshot.filter((user) => {
            if (members.includes(user.handle) && user.handle !== team.owner) {
              return user;
            }
            if(members.includes(user.handle) && user.handle === team.owner ){
                setOwner(user)
            }
          });
          setMembers(teamMembers)
    })
    .catch(e => console.log(e))

    if (team.channels === undefined){
      setAllChannels([]);
    }else{
       Promise.all(
        Object.keys(team.channels).map(
      (channel) => {
        return getChannelById(channel)
      }))
      .then(res => {
        if(userData === null) return;
        
        const myChannel = res.filter(el => {
          if(userData.handle in el.members){
            return el
          }
        })
        setAllChannels(myChannel)

      })
      console.log(allChannels)
    }
  },[team,userData])

  return (
    <>
      <Button  key={'lg'} variant='ghost' onClick={onOpen}>
      <FcAbout size={30} />
      </Button>
      <Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>{team.name}</DrawerHeader>
          <DrawerBody>
            <Wrap>
            <WrapItem>
            <Avatar size='2xl' name={team.name} src={team.teamPhoto} />{' '}
            </WrapItem>
            </Wrap>
            <Text>{team.description}</Text>
            <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
            <Tab>Owner</Tab>
            <Tab>Members ({members.length})</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
            <p>{owner.firstName} {owner.lastName}, {owner.email} </p>
            </TabPanel>
            <TabPanel>
            {members.map((member: User) => {
             return (<Text key={member.handle}>{member.firstName} {member.lastName}, {member.email} </Text>)
            })}
            </TabPanel>
            </TabPanels>
            </Tabs>
            <Heading as='h6' size='xs'>
            Channels
            </Heading>
            {allChannels.map(channel => {
              return (<Text key={channel.id}>{channel.title} </Text>)
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default TeamInfo;