import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const getUserByHandle = (handle: string): Promise<DataSnapshot> => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (
  handle: string, 
  uid: string, 
  email: string, 
  firstName: string, 
  lastName: string, 
  phoneNumber: string): Promise<void> => {

  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    firstName,
    lastName,
    phoneNumber,
    teams: '',
    profilePhoto: '',
    channels: {}
  })
};

export const getUserData = (uid: string): Promise<DataSnapshot> => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserData = (handle: string, key: string, value: string): Promise<void> => {
  return update(ref(db), { [`users/${handle}/${key}`]: `${value}` });
}

export const getAllUsers = (): Promise<string[]> => {
  return get(ref(db, 'users'))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      return Object.keys(snapshot.val())
    });
};
