import { useState, useContext, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import {
  Flex,
  Stack,
  Button,
  Heading,
  Box,
  Input,
  FormControl,
  HStack,
  FormLabel,
  Switch,
  Alert,
  AlertIcon,
  CloseButton,
  AlertTitle,
  useDisclosure,
} from '@chakra-ui/react'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS } from '../../common/constants';
import UsersList from '../UsersList/UsersList';
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext, { UserState } from '../../context/AppContext';
import { createEvent } from '../../services/events.service'
import { Timestamp } from "firebase/firestore";
import { updateUserEvent } from '../../services/users.service'
import { getChannelById, channelMessage } from '../../services/channels.service';
import {addMessage} from '../../services/messages';
import {NEW_EVENT, FOR, ADDED, ADMIN, EVENT } from '../../common/constants';

type ValuePiece = Date;

export type Value = ValuePiece;

interface NewEvent {
  title: string,
  members: { [handle: string]: boolean },
  meetingLink: string,
  createRoom: boolean,
}


const NewEvent = () => {
  const [valueStart, onChangeStart] = useState<Value>(new Date());
  const [valueEnd, onChangeEnd] = useState<Value>(new Date());
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    members: {},
    meetingLink: '',
    createRoom: false,
  })
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);
  const channelId = location.state?.channelId;

  const {
    isOpen: isSave,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })

  useEffect(() => {
    getChannelById(channelId)
    .then((channel) => {
      setNewEvent({
        ...newEvent,
        members:{...channel.members}
      })
    })
  },[channelId])

  const updateNewEventMember = (user: string) => {
    const newMembers = { ...newEvent.members };
    newMembers[user] = true;
    setNewEvent({
      ...newEvent,
      members: newMembers
    })
  }

  const removeNewEventMembers = (member: string) => {
    const updateMembers = { ...newEvent.members }
    delete updateMembers[member]

    setNewEvent({
      ...newEvent,
      members: updateMembers,
    })
  }

  const updateNewEvent = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'createRoom'){
      if(newEvent.createRoom){
        setNewEvent({
          ...newEvent,
          [field]: false,
        })
      }else{
        setNewEvent({
        ...newEvent,
        [field]: true,
      })
      }       
    } else if (field !== 'members') {
      setNewEvent({
        ...newEvent,
        [field]: e.target.value,
      })
    }
  }

  const saveNewEvent = () => {
    if (!newEvent.title) {
      return alert(`Enter team name`)
    }
    if (Object.keys(newEvent.members).length === 0) {
      return alert(`Enter team members`)
    }
    if (userData === null) return alert('Please login');

    const allMembers = { ...newEvent.members }
    allMembers[userData.handle] = true;
    const start = Timestamp.fromDate(valueStart).seconds * 1000
    const end = Timestamp.fromDate(valueEnd).seconds * 1000
    createEvent(newEvent.title, userData.handle, allMembers, start, end, null, newEvent.createRoom, channelId)
      .then(event => {
        Object.keys(event.members).forEach(el => updateUserEvent(el, event.id))
        addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + ADDED + NEW_EVENT + newEvent.title + FOR + (valueStart.toLocaleString("en-GB").slice(0, 17)), ADMIN, channelId, true, EVENT)
        .then(message => {
          channelMessage(channelId, message.id);
         })
        .catch(error => console.error(error.message))
      })
      .then(() =>{
        setNewEvent({
          title: '',
          members: {},
          meetingLink: '',
          createRoom: false,
        })
        onChangeEnd(new Date())
        onChangeStart(new Date())
      })
      .then(() => onOpen())
      .catch(error => console.error(error.message))
      
  }

  console.error(newEvent)
  return (
    <Flex
      maxH={'fit-content'}
      align={'center'}
      justify={'center'}
      mt={{ base: 2, sm: 5 }}
      bg={'none'}
      flexDirection="column"
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'25%'}
        bg={'grey'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={{ base: 1, sm: 6 }}
      >
        <Heading>New event</Heading>
        <FormControl id="title" isRequired>
          <FormLabel textAlign={'center'}>Title</FormLabel>
        <Input
          placeholder='Title'
          _placeholder={{ color: 'gray.500' }}
          type="text"
          bg={'white'}
          rounded="md"
          value={newEvent.title}
          onChange={updateNewEvent('title')} />
          </FormControl>
          <FormControl id="start" isRequired>
        <HStack justifyContent={'space-between'}>
       
          <FormLabel >Start:</FormLabel>
          <DateTimePicker
            amPmAriaLabel="Select AM/PM"
            calendarAriaLabel="Toggle calendar"
            clearAriaLabel="Clear value"
            maxDetail="second"
            nativeInputAriaLabel="Date and time"
            value={valueStart}
            onChange={onChangeStart}
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yy"
            hourPlaceholder="hh"
            minutePlaceholder="mm"
            format="dd/MM/yy HH:mm"
          />
        </HStack>
        </FormControl>
        <FormControl id="end" isRequired>
        <HStack justifyContent={'space-between'}>
        <FormLabel >End:</FormLabel>
          <DateTimePicker amPmAriaLabel="Select AM/PM"
            calendarAriaLabel="Toggle calendar"
            clearAriaLabel="Clear value"
            maxDetail="second"
            nativeInputAriaLabel="Date and time"
            value={valueEnd}
            dayPlaceholder="dd"
            monthPlaceholder="mm"
            yearPlaceholder="yy"
            hourPlaceholder="hh"
            minutePlaceholder="mm"
            format="dd/MM/yy HH:mm"
            onChange={onChangeEnd}
          />
        </HStack>
        </FormControl>
        <FormControl  isRequired>
        <HStack justifyContent={'space-between'}>
          <FormLabel textAlign={'center'} htmlFor='isChecked'>Create a meeting room?</FormLabel>
          <Switch  onChange={updateNewEvent('createRoom')} colorScheme='teal' size='md' isChecked={newEvent.createRoom}/>
          </HStack>
          </FormControl>

          <FormControl id="addMembers" isRequired>
          <FormLabel textAlign={'center'}>Add members</FormLabel>
        <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewEventMember} />
        <Stack h={'15vh'}
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgb(202, 213, 227)',
              borderRadius: '24px',
            },
          }}
        >
          <UsersList members={Object.keys(newEvent.members)} removeChannelMembers={removeNewEventMembers} />
        </Stack>
        </FormControl>

        <FormControl>
        <Box>
          {isSave &&
            <Alert status={'success'}
              textAlign={'center'}
              w={'fit-content'}
              rounded={'xl'}>
              <AlertIcon />
              <Box>
                <AlertTitle>New event added successfully</AlertTitle>
              </Box>
              <CloseButton
                rounded={'xl'}
                onClick={onClose}
              />
            </Alert>}
        </Box>
        </FormControl>
        <Stack spacing={6} direction={['column', 'row']}>
        <Button
          w='full'
          border={'2px solid'}
          borderColor={'teal.500'}
          bg={'none'}
          color={'teal.500'}
          _hover={{ opacity: 0.8 }}
          onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button
          bg={'teal.500'}
          variant={'primaryButton'} w='full'
          _hover={{ opacity: 0.8 }}
          onClick={saveNewEvent}>
          Add Event
        </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}

export default NewEvent;