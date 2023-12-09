import { Box,  } from '@chakra-ui/react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppContext, { UserState } from '../../context/AppContext'
import { useContext, useState, useEffect } from 'react';
import {getUserEventLive} from '../../services/users.service'
import {getEventById} from '../../services/events.service'


const localizer = momentLocalizer(moment);

export interface MyEvent {
    title: string,
    creator: string,
    members: { [handle: string]: boolean },
    start: string,
    end: string,
    createdOn?: string
    meetingLink: string,
}

const MyEventBox = ({event}) => (<div>
    <strong>{event.title}</strong>
    <br />
    {/* Add your button or any other custom content here */}
    {event.meetingLink && (<button>
      <a href={event.meetingLink}>Click me</a></button>)}
    </div>)


const MyCalendar = () => {
    const [myEvent, setMyEvent] = useState<MyEvent[]>([])
    const { userData } = useContext<UserState>(AppContext);

    useEffect(() => {
        if(userData === null) return;
        getUserEventLive(userData.handle, (data: string[]) => {
            Promise.all(
                data.map((eventId: string) => {
                  return getEventById(eventId)
                }))
                .then(elEvent => {
                  console.log(elEvent)
                  setMyEvent([...elEvent])
                })
                .catch(e => console.log(e))
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