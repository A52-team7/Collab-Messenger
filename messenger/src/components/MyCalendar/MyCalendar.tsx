import { Box, Button, Stack} from '@chakra-ui/react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppContext, { UserState } from '../../context/AppContext'
import { useContext, useState, useEffect } from 'react';
import { getUserEventLive } from '../../services/users.service'
import { getEventById } from '../../services/events.service'
import { useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';


const localizer = momentLocalizer(moment);

export interface MyEvent {
  id: string,
  title: string,
  creator: string,
  members: { [handle: string]: boolean },
  start: string,
  end: string,
  createdOn: string,
  meetingLink: string,
  createRoom: boolean,
  channelId: string
}

interface EventBoxProps {
  event: MyEvent;
}


const MyEventBox = ({ event } : EventBoxProps) => {
  const navigate = useNavigate();

  return (<Stack overflowY="auto" css={{
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'blue',
      borderRadius: '24px',
    },
  }} >
  <strong>{event.title}</strong>
  <br />
  {event.createRoom && (<Button 
  colorScheme='teal' 
  onClick={() => navigate('/video', { state: { channelId: event.channelId, eventId: event.id } })}>
    Join</Button>)}
   </Stack>)
}


const MyCalendar = () => {
  const [myEvent, setMyEvent] = useState<MyEvent[]>([])
  const { userData } = useContext<UserState>(AppContext);

  useEffect(() => {
    if (userData === null) return;
    getUserEventLive(userData.handle, (data: string[]) => {
      Promise.all(
        data.map((eventId: string) => {
          return getEventById(eventId)
        }))
        .then(elEvent => {
          setMyEvent([...elEvent])
        })
        .catch(e => console.error(e))
    })
  }, [])

  return (
    <Box bg={'grey'} >
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={myEvent}
        style={{ height: "100vh" }}
        components={{
          event: MyEventBox
        }}
      />
    </Box>
  );
}

export default MyCalendar;