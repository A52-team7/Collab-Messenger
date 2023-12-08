import { get, ref, query, equalTo, orderByChild,  push } from 'firebase/database'
import { db } from '../config/firebaseConfig';

export const createEvent = (title: string, creator: string, members: object, start: string, end: string) => {
    return push(
        ref(db, 'events'),
        {
            title,
            creator,
            members,
            start,
            end,
            createdOn: Date.now()
        },
    )
        .then(result => {
            if(result.key === null) return;

            return getEventById(result.key);
        })
        .catch(e => console.log(e))
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
            return event;
        });
};



