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
import { Team } from '../CreateTeam/CreateTeam';
import { FcAbout } from "react-icons/fc";
import { User } from '../SearchUsers/SearchUsers';
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar'
import { getTeamTitleLive, getTeamMemberLive, getTeamChannelsLive } from '../../services/teams.service';


const TeamInfo = (team: Team) => {
  const { userData } = useContext<UserState>(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [members, setMembers] = useState<User[]>([])
  const [owner, setOwner] = useState<User>({})
  const [allChannels, setAllChannels] = useState<Channel[]>([])
  const [title,setTitle] = useState<string>(team.name)

  useEffect(() => {
    getTeamMemberLive(team.id, (teamMember) =>{
    getAllUsersData()
      .then(data => {
        const snapshot: User[] = Object.values(data.val());
        const members = Object.keys(teamMember)
        const teamMembers = snapshot.filter((user) => {
          if (members.includes(user.handle) && user.handle !== team.owner) {
            return user;
          }
          if (members.includes(user.handle) && user.handle === team.owner) {
            setOwner(user)
          }
        });
        setMembers(teamMembers)
      })
      .catch(e => console.error(e))
    })

    if (team.channels === undefined) {
      setAllChannels([]);
    } 

      getTeamChannelsLive(team.id, (data) =>{
        console.log(data)
      Promise.all(
        data.map(
          (channel) => {
            return getChannelById(channel)
          }))
        .then(res => {
          if (userData === null) return;

          const myChannel = res.filter(el => {
            if (userData.handle in el.members) {
              return el
            }
          })
          setAllChannels(myChannel)

        })
      })
  }, [team, userData])

  useEffect(() => {
    getTeamTitleLive(team.id, (data) => {
      setTitle(data)
    })
  },[])
  

  return (
    <>
      <Button key={'lg'} variant='unstyled' _hover={{ transform: 'scale(1.5)', color: 'inherit' }} onClick={onOpen}>
        <FcAbout size={30} />
      </Button>
      <Drawer placement={'right'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent minW={'600px'} bg={"RGB(59, 59, 59)"}>
          <DrawerHeader fontSize="3xl" color="white" textAlign="center" borderBottomWidth='1px'>{title}</DrawerHeader>
          <DrawerBody 
          color="white" 
          overflowY="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'black',
                borderRadius: '24px',
              },
            }}>
            <Wrap justify="center">
              <WrapItem>
                <Avatar size='2xl' name={team.name} src={team.teamPhoto} mx="auto" my={10} />{' '}
              </WrapItem>
            </Wrap>
            <Text textAlign="center" mx="auto" my={4} p={2} border={'1px solid rgb(187,125,217)'}>{team.description}</Text>
            <Tabs isFitted variant='enclosed' borderColor={'rgb(187,125,217)'}>
              <TabList mb='1em' >
                <Tab >Owner</Tab>
                <Tab>Members ({members.length})</Tab>
              </TabList>
              <TabPanels borderBottomColor={"blue"}>
                <TabPanel >
                  <HStack justify="left">
                    <Avatar size='sm' name={owner.firstName + ' ' + owner.lastName} src={owner.profilePhoto} my={4} />{' '}
                    <p>{owner.firstName} {owner.lastName}, {owner.email} </p>
                  </HStack>
                </TabPanel>
                <TabPanel>
                  {members.map((member: User) => {
                    return (
                      <HStack justify="left" borderBottomWidth='1px' borderBottomColor={'rgb(187,125,217)'}>
                        <Avatar size='sm' name={member.firstName + ' ' + member.lastName} src={member.profilePhoto} my={4} />{' '}
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
              return (<Text key={channel.id} fontSize="lg" my={4} borderBottomWidth='1px' borderBottomColor={'rgb(187,125,217)'}>{channel.title} </Text>)
            })}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default TeamInfo;