import { get, set, ref, query, equalTo, orderByChild, update, DataSnapshot, onValue, remove } from 'firebase/database';
import { db } from '../config/firebaseConfig';

export const getUserByHandle = (handle: string): Promise<DataSnapshot> => {
  return get(ref(db, `users/${handle}`));
};

export const createUserHandle = (
  handle: string,
  uid: string,
  email: string | null,
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
    myTeams: '',
    profilePhoto: '',
    myChannels: {},
    status:'Available',
    unseen: {
      chats: false,
      teams: false
    }
  })
};

export const getUserData = (uid: string): Promise<DataSnapshot> => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const updateUserData = (handle: string, key: string, value: string | boolean): Promise<void> => {
  return update(ref(db), { [`users/${handle}/${key}`]: value });
};

export const setAllUsersUnseen = (members: string[], handle: string, key: string): void => {
  members.forEach(member => {
    if (member !== handle) {
      updateUserData(member, `unseen/${key}`, true);
    }
  });
}

export const getAllUsersData = (): Promise<DataSnapshot> => {
  return get(query(ref(db, 'users')));
};

export const getAllUsers = (): Promise<string[]> => {
  return get(ref(db, 'users'))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      return Object.keys(snapshot.val())
    });
};

export const updateUserTeams = (handle: string, idTeam: string): Promise<void> => {
  return update(ref(db), { [`users/${handle}/myTeams/${idTeam}`]: true })
}

export interface TeamsListener { (teams: string[]): void }

export const getUserTeamsLive = (handle: string, listener: TeamsListener) => {

  return onValue(ref(db, `users/${handle}/myTeams`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const teams = Object.keys(snapshot.val());
    return listener(teams)
  })
}

export interface StatusListener { (status: string): void }

export const getUserStatusLive = (handle: string, listener: StatusListener) => {

  return onValue(ref(db, `users/${handle}/status`), (snapshot) => {
    if (!snapshot.exists()) return [];
    const status = snapshot.val();
    return listener(status)
  })
}

export const getAllUserTeams = (handle: string) => {
  return get(ref(db, `users/${handle}/myTeams`))
}

export const userMessage = (id: string, handle: string): Promise<void> => {
  const updateUserMessage: { [key: string]: boolean } = {};
  updateUserMessage[`/users/${handle}/myMessages/${id}`] = true;

  return update(ref(db), updateUserMessage);
}

export const userChannel = (id: string, handle: string): Promise<void> => {
  const updateUserChannel: { [key: string]: boolean } = {};
  updateUserChannel[`/users/${handle}/myChannels/${id}`] = true;

  return update(ref(db), updateUserChannel);
}


export interface ChannelsListener { (channels: string[]): void }

export const getUserChannelsLive = (handle: string, listener: ChannelsListener) => {

  return onValue(ref(db, `users/${handle}/myChannels`), (snapshot) => {
    if (!snapshot.exists()) return [];

    const channels = Object.keys(snapshot.val());

    return listener(channels);
  })
}

export const addUserReactionToMessage = (messageId: string, reaction: string, handle: string) => {
  const updateUserReactionToMessage: { [key: string]: boolean } = {};
  updateUserReactionToMessage[`/users/${handle}/myReactions/${reaction}/${messageId}`] = true;

  return update(ref(db), updateUserReactionToMessage);
}

export const removeUserReactionFromMessage = (messageId: string, reaction: string, handle: string) => {
  remove(ref(db, `users/${handle}/myReactions/${reaction}/${messageId}`));
}

export const updateUserStatus = (handle: string, status: string) => {
  return update(ref(db), {[`/users/${handle}/status`]: status})
}