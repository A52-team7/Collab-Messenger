// push, get, query, DataSnapshot, onValue, remove
import { DataSnapshot, get, ref, update } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';

export const getChannelVideoSession = (channelId: string) => {
  return get(ref(db, `channels/${channelId}/videoSession`))
    .then((res: DataSnapshot) => {

      return res.val();
    })
    .catch((err: Error) => console.error(err));
}

export const addChannelVideoSession = (channelId: string, sessionUrl: string) => {
  const addChannelSession: { [key: string]: string } = {};
  addChannelSession[`channels/${channelId}/videoSession`] = sessionUrl;

  return update(ref(db), addChannelSession);
}

export const addEventMeetingLink = (eventId: string, sessionUrl: string) => {
  const addEventMeetingLink: { [key: string]: string } = {};
  addEventMeetingLink[`events/${eventId}/meetingLink`] = sessionUrl;

  return update(ref(db), addEventMeetingLink);
}