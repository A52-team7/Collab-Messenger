import {
    Button,
    Heading,
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
    HStack,
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
      <Button  key={'lg'} variant='unstyled' _hover={{ transform: 'scale(1.5)', color: 'inherit' }} onClick={onOpen}>
      <FcAbout size={30} />
      </Button>
      <Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent minW={'600px'}>
          <DrawerHeader fontSize="3xl" textAlign="center" borderBottomWidth='1px'>{team.name}</DrawerHeader>
          <DrawerBody>
            <Wrap justify="center">
            <WrapItem>
            <Avatar size='2xl' name={team.name} src={team.teamPhoto} mx="auto" my={10} />{' '}
            </WrapItem>
            </Wrap>
            <Text textAlign="center" mx="auto" my={4} border={'1px solid gray'}>{team.description}</Text>
            <Tabs isFitted variant='enclosed'>
            <TabList mb='1em'>
            <Tab>Owner</Tab>
            <Tab>Members ({members.length})</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
             <HStack justify="left">
            <Avatar size='sm' name={owner.firstName + ' ' + owner.lastName} src={owner.profilePhoto} my={4}/>{' '}
            <p>{owner.firstName} {owner.lastName}, {owner.email} </p>
            </HStack> 
            </TabPanel>
            <TabPanel>
            {members.map((member: User) => {
             return (
             <HStack justify="left" borderBottomWidth='1px'>
             <Avatar size='sm' name={member.firstName + ' ' + member.lastName} src={member.profilePhoto}my={4} />{' '} 
             <Text key={member.handle} my={4} >{member.firstName} {member.lastName}, {member.email} </Text>
             </HStack>)
            })}
            </TabPanel>
            </TabPanels>
            </Tabs>
            <Heading fontSize="xl" mt={7}>
            Channels:
            </Heading>
            {allChannels.map(channel => {
              return (<Text key={channel.id} fontSize="lg" my={4} borderBottomWidth='1px'>{channel.title} </Text>)
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default TeamInfo;