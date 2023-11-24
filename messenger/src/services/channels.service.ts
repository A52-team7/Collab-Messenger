import { ref, push, get, query, equalTo, orderByChild, update, DataSnapshot, onValue } from 'firebase/database';
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
            members: channel.members ? Object.keys(channel.members) : []
        };
    });
}

export const addChannel = (handle: string, teamId: string | null = null , title: string = "") => {

    return push(
        ref(db, 'channels'),
        {
            creator: handle,
            toTeam: teamId,
            createdOn: Date.now(),
            title,
        },
    )
        .then(result => {
            if(result.key === null) return;
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

export const getChannelsByCreator = (handle: string): Promise<Channel[]> => {

    return get(query(ref(db, 'channels'), orderByChild('creator'), equalTo(handle)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromChannelsDocument(snapshot);
        });
};

export const getChannelsByTeam = (teamId: string): Promise<Channel[]> => {

    return get(query(ref(db, 'channels'), orderByChild('toTeam'), equalTo(teamId)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromChannelsDocument(snapshot);
        });
};

export const getAllChannels = (): Promise<Channel[]> => {

    return get(ref(db, 'channels'))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return [];
            }

            return fromChannelsDocument(snapshot);
        });
};

export const channelMessage = (channelId: string, messageId: string) => {
    const updateChannelMessages: {[key: string]: boolean} = {};
    updateChannelMessages[`/channels/${channelId}/messages/${messageId}`] = true;

    return update(ref(db), updateChannelMessages);
}

export const addMemberToChannel = (channelId: string, memberId: string) => {
    const updateChannelMembers: {[key: string]: boolean} = {};
    updateChannelMembers[`/channels/${channelId}/members/${memberId}`] = true;

    return update(ref(db), updateChannelMembers);
}

export const addTitleToChannel = (channelId: string, title: string) => {
    const updateChannelTitle: {[key: string]: string} = {};
    updateChannelTitle[`/channels/${channelId}/title`] = title;

    return update(ref(db), updateChannelTitle);
}


export interface MessagesListener{(messages: string[]): void}

export const getChannelMessagesLive = (channelId: string, listener: MessagesListener)=>{

  return onValue(ref(db ,`channels/${channelId}/messages`), (snapshot) => {
    if(!snapshot.exists()) return[];
    console.log(snapshot);
    
    const messages= Object.keys(snapshot.val());
    
    return listener(messages);
  })
}

export interface ChannelsListener{(channels: string[]): void}

export const getUserChannelsLive = (handle: string, listener: ChannelsListener)=>{

  return onValue(ref(db ,`users/${handle}/myChannels`), (snapshot) => {
    if(!snapshot.exists()) return[];
    console.log(snapshot);
    
    const channels= Object.keys(snapshot.val());
    
    return listener(channels);
  })
}

