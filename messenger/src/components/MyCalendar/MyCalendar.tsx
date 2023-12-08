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
    createdOn: string
}

const MyEventBox = ({event}) => (<div>
    <strong>{event.title}</strong>
    <br />
    {/* Add your button or any other custom content here */}
    <button onClick={() => alert(`Button clicked for ${event.title}`)}>Click me</button>
    </div>)


const MyCalendar = () => {
    const [myEvent, setMyEvent] = useState<MyEvent[]>([])
    const { userData } = useContext<UserState>(AppContext);

    const events=[
        {
          id: 1,
          title: "Event 1",
          start: new Date("2023/12/6 09:30"),
          end: new Date("2023/12/6 10:30"),
        },
        {
          id: 2,
          title: "Event 2",
          start: new Date("2023/12/8 10:00"),
          end: new Date("2023/12/8 11:00"),
        },
    ]

    useEffect(() => {
        if(userData === null) return;
        getUserEventLive(userData.handle, (data: string[]) => {
            Promise.all(
                data.map((eventId: string) => {
                  return getEventById(eventId)
                }))
                .then(elEvent => {
                  setMyEvent([...elEvent])
                })
                .catch(e => console.log(e))
    })
    }, [userData])
    

    return (
        <Box bg={'white'} >
          <Calendar
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            events={events}
            style={{ height: "100vh" }}
            components={{
              event: MyEventBox
            }}
          />
        </Box>
      );
} 

export default MyCalendar;