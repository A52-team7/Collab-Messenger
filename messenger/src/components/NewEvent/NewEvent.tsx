import { useState, useContext } from 'react';
import DateTimePicker from 'react-datetime-picker';
import {
  Flex,
  Stack,
  Button,
  useColorModeValue,
  Heading,
  Textarea,
  Box,
  Input,
  Alert,
  AlertIcon,
  Image,
  Text,
  Tooltip,
  FormControl,
  HStack,
  FormLabel,
} from '@chakra-ui/react'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADD_USERS } from '../../common/constants';
import UsersList from '../UsersList/UsersList';
import { useNavigate } from 'react-router-dom';
import AppContext, { UserState } from '../../context/AppContext';
import { createEvent } from '../../services/events.service'
import { Timestamp } from "firebase/firestore";
import { updateUserEvent } from '../../services/users.service'

type ValuePiece = Date;

export type Value = ValuePiece;

interface NewEvent {
  title: string,
  members: { [handle: string]: boolean },
  meetingLink: string,
}


const NewEvent = () => {
  const [valueStart, onChangeStart] = useState<Value>(new Date());
  const [valueEnd, onChangeEnd] = useState<Value>(new Date());
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    members: {},
    meetingLink: ''
  })
  const navigate = useNavigate();
  const { userData } = useContext<UserState>(AppContext);

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
    if (field !== 'members') {
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
    // const start =Math.floor(valueStart.getTime() / 1000);
    // const end = Math.floor(valueEnd.getTime() / 1000);
    // const start = valueStart.unix();
    // const end = valueStart.unix();
    const start = Timestamp.fromDate(valueStart).seconds * 1000
    const end = Timestamp.fromDate(valueEnd).seconds * 1000
    createEvent(newEvent.title, userData.handle, allMembers, start, end, newEvent.meetingLink)
      .then(event => {
        Object.keys(event.members).forEach(el => updateUserEvent(el, event.id))
      })
    //Timestamp.fromDate(valueEnd).seconds
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
        maxW={'fit-content'}
        bg={'grey'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={{ base: 1, sm: 6 }}
      >
        <Heading>New event</Heading>
        <Input
          placeholder='Title'
          _placeholder={{ color: 'gray.500' }}
          type="text"
          bg={'white'}
          rounded="md"
          value={newEvent.title}
          onChange={updateNewEvent('title')} />
        <HStack >
          <Text>Start:</Text>
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
        <HStack>
          <Text>End:</Text>
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
        <Input placeholder='Meeting link'
          _placeholder={{ color: 'gray.500' }}
          type="text"
          bg={'white'}
          rounded="md"
          value={newEvent.meetingLink}
          onChange={updateNewEvent('meetingLink')} />
        <SearchUsers searchType={ADD_USERS} updateNewMember={updateNewEventMember} />
        <Stack h={'15vh'}
          overflowY={'scroll'}
        >
          <UsersList members={Object.keys(newEvent.members)} removeChannelMembers={removeNewEventMembers} />
        </Stack>
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
    </Flex>
  )
}

export default NewEvent;