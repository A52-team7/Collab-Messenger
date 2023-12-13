import { Box, Button, } from '@chakra-ui/react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppContext, { UserState } from '../../context/AppContext'
import { useContext, useState, useEffect } from 'react';
import { getUserEventLive } from '../../services/users.service'
import { getEventById } from '../../services/events.service'
import { useNavigate } from 'react-router-dom';


const localizer = momentLocalizer(moment);

export interface MyEvent {
  id: string,
  title: string,
  creator: string,
  members: { [handle: string]: boolean },
  start: string,
  end: string,
  createdOn?: string,
  meetingLink: string,
  createRoom?: boolean,
  channelId: string
}

const MyEventBox = ({ event }) => {
  const navigate = useNavigate();

  return (<Box>
  <strong>{event.title}</strong>
  <br />
  {/* Add your button or any other custom content here */}
  {event.createRoom && (<Button 
  colorScheme='teal' 
  onClick={() => navigate('/video', { state: { channelId: event.channelId, eventId: event.id } })}>
    Join</Button>)}
   </Box>)
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
    <Box bg={'white'} >
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