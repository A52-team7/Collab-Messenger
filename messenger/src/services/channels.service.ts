import { ref, push, get, query, update, DataSnapshot, onValue, remove } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';


interface Channel {
  id: string;
  createdOn: Date;
  messages: string[];
  members: string[];
}

export const fromChannelsDocument = (snapshot: DataSnapshot): Channel[] => {
  const channelsDocument = snapshot.val();

  return Object.keys(channelsDocument).map(key => {
    const channel = channelsDocument[key];

    return {
      ...channel,
      id: key,
      createdOn: new Date(channel.createdOn),
      messages: channel.messages ? Object.keys(channel.messages) : [],
      members: channel.members ? Object.keys(channel.members) : [],
    };
  });
}

export const addChannel = (handle: string, title: string, members: object, teamId: string | null = null) => {
  let seenBy: { [key: string]: boolean } = {};
  seenBy = { ...members }
  Object.entries(seenBy).forEach(([key]) => {
    key === handle ? seenBy[key] = true : seenBy[key] = false;
  });

  return push(
    ref(db, 'channels'),
    {
      creator: handle,
      toTeam: teamId,
      createdOn: Date.now(),
      title,
      members: members,
      seenBy: seenBy,
    },
  )
    .then(result => {
      if (result.key === null) return;
      return getChannelById(result.key);
    })
    .catch(e => console.log(e));
};

export const getChannelById = (id: string) => {

  return get(ref(db, `channels/${id}`))
    .then((result: DataSnapshot) => {
      if (!result.exists()) {
        throw new Error(`Channel with id ${id} does not exist!`);
      }

      const channel = result.val();
      channel.id = id;
      channel.createdOn = new Date(channel.createdOn);
      if (!channel.messages) channel.messages = [];
      if (!channel.members) channel.members = [];

      return channel;
    })
    .catch(e => console.log(e));
};

export const getAllChannels = () => {

  return get(ref(db, 'channels'))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromChannelsDocument(snapshot);
    });
};

export const channelMessage = (channelId: string, messageId: string) => {
  const updateChannelMessages: { [key: string]: boolean } = {};
  updateChannelMessages[`/channels/${channelId}/messages/${messageId}`] = true;

  return update(ref(db), updateChannelMessages);
}

export const addMemberToChannel = (channelId: string, memberId: string) => {
  const updateChannelMembers: { [key: string]: boolean } = {};

  updateChannelMembers[`/channels/${channelId}/members/${memberId}`] = true;
  updateChannelMembers[`/channels/${channelId}/seenBy/${memberId}`] = false;

  return update(ref(db), updateChannelMembers);
}

export const deleteMemberFromChannel = (channelId: string, handle: string) => {
  remove(ref(db, `channels/${channelId}/members/${handle}`));
  addMemberToLeftTheChannel(channelId, handle);
  const updateLeftChannelsOfUser: { [key: string]: number } = {};
  updateLeftChannelsOfUser[`/users/${handle}/leftChannels/${channelId}`] = Date.now();

  return update(ref(db), updateLeftChannelsOfUser);
}

const addMemberToLeftTheChannel = (channelId: string, handle: string) => {
  const updateLeftTheChannel: { [key: string]: boolean } = {};
  updateLeftTheChannel[`/channels/${channelId}/leftTheChannel/${handle}`] = true;

  return update(ref(db), updateLeftTheChannel);
}

//used when you want to add user who has been removed from that chat
export const removeLeftChannel = (channelId: string, handle: string) => {
  remove(ref(db, `/users/${handle}/leftChannels/${channelId}`));
  remove(ref(db, `/channels/${channelId}/leftTheChannel/${handle}`));
}

export interface LeftMembersListener { (leftMembers: string[]): void }

export const getLeftMembersLive = (channelId: string, listener: LeftMembersListener) => {

  return onValue(ref(db, `channels/${channelId}/leftTheChannel`), (snapshot) => {
    if (!snapshot.exists()) return [];

    const leftMembers = Object.keys(snapshot.val());

    return listener(leftMembers);
  })
}

export const getIfChannelIsLeft = (handle: string, channelId: string) => {

  return get(query(ref(db, `users/${handle}/leftChannels`)))
    .then(snapshot => {
      if (snapshot.exists() && Object.keys(snapshot.val()).includes(channelId)) {
        return true;
      }
      return false;
    });
};

export const getDateOfLeftChannel = (handle: string, channelId: string) => {

  return get(query(ref(db, `users/${handle}/leftChannels`)))
    .then(snapshot => {
      if (snapshot.exists() && Object.keys(snapshot.val()).includes(channelId)) {
        return snapshot.val()[channelId];
      }
    });
};

export const addTitleToChannel = (channelId: string, title: string) => {
  const updateChannelTitle: { [key: string]: string } = {};
  updateChannelTitle[`/channels/${channelId}/title`] = title;

  return update(ref(db), updateChannelTitle);
}

export interface MessagesListener { (messages: string[]): void }

export const getChannelMessagesLive = (channelId: string, listener: MessagesListener) => {

  return onValue(ref(db, `channels/${channelId}/messages`), (snapshot) => {
    if (!snapshot.exists()) return [];

    const messages = Object.keys(snapshot.val());

    return listener(messages);
  })
}

export interface MembersListener { (members: string[]): void }

export const getChannelMembersLive = (channelId: string, listener: MembersListener) => {

  return onValue(ref(db, `channels/${channelId}/members`), (snapshot) => {
    if (!snapshot.exists()) return [];

    const members = Object.keys(snapshot.val());

    return listener(members);
  })
}

export const setChannelToSeen = (channelId: string, memberId: string): Promise<void> => {
  const updateSeen: { [key: string]: boolean } = {};
  updateSeen[`/channels/${channelId}/seenBy/${memberId}`] = true;

  return update(ref(db), updateSeen);
}

export const setAllInChannelToUnseen = (channelId: string, senderUsername: string): void => {
  get(ref(db, `channels/${channelId}/members`))
    .then((data) => {
      let seenUnseenMembers: { [key: string]: boolean } = {};
      seenUnseenMembers = { ...data.val() };
      Object.entries(seenUnseenMembers).forEach(([key]) => {
        key === senderUsername ? seenUnseenMembers[key] = true : seenUnseenMembers[key] = false;
      })

      return seenUnseenMembers;
    })
    .then((seenUnseenMembers) => {
      update(ref(db, `channels/${channelId}/seenBy`), seenUnseenMembers);
    })
    .catch((error: Error) => console.error(error));
}

export interface SeenListener { (user: boolean): void }
export const getChannelSeenLive = (channelId: string, user: string, listener: SeenListener) => {
  onValue(ref(db, `channels/${channelId}/seenBy/${user}`), (snapshot) => {
    listener(snapshot.val());
  })
}


export interface unseenListener { (data: { chats: boolean, teams: boolean }): void }
export const unseenTeamsChats = (handle: string, listener: unseenListener) => {
  return onValue(ref(db, `users/${handle}/unseen`), (snapshot) => {
    if (!snapshot.exists()) return;
    listener(snapshot.val());
  });
}

export interface TitleListener { (title: string): void }
export const getChannelTitleLive = (channelId: string, listener: TitleListener) => {

  return onValue(ref(db, `channels/${channelId}/title`), (snapshot) => {
    if (!snapshot.exists()) return '';

    const title = snapshot.val();

    return listener(title);
  })
}

export const chatBetweenTwo = (channelId: string) => {
  const updateChaTIsBetweenTwo: { [key: string]: boolean } = {};
  updateChaTIsBetweenTwo[`/channels/${channelId}/isBetweenTwo`] = true;

  return update(ref(db), updateChaTIsBetweenTwo);
}