import { ref, push, get, query, equalTo, orderByChild, update, DataSnapshot } from 'firebase/database';
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

export const addChannel = (handle: string, teamId: string | null = null , title: string = ""): Promise<any> => {

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

            return getChannelById(result.key);
        })
        .catch(e => console.log(e));
};

export const getChannelById = (id: string): Promise<any> => {

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


