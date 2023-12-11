// query, equalTo, orderByChild,
import { get, ref, push } from 'firebase/database'
import { db } from '../config/firebaseConfig';

export const createEvent = (title: string, creator: string, members: object, start: number, end: number, meetingLink: string) => {
  return push(
    ref(db, 'events'),
    {
      title,
      creator,
      members,
      start,
      end,
      meetingLink,
      createdOn: Date.now()
    },
  )
    .then(result => {
      if (result.key === null) return;

      return getEventById(result.key);
    })
    .catch(e => console.error(e))
};

export const getEventById = (id: string) => {
  return get(ref(db, `events/${id}`))
    .then(result => {
      if (!result.exists()) {
        throw new Error(`Event with id ${id} does not exist!`);
      }
      const event = result.val();
      event.id = id;
      event.createdOn = new Date(event.createdOn);
      event.start = new Date(event.start)
      event.end = new Date(event.end)
      return event;
    });
};



