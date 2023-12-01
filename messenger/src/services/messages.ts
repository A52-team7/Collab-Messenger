import { ref, push, get, query, equalTo, orderByChild, DataSnapshot, update } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';


interface Message {
    id: string;
    createdOn: Date;
}

export const fromMessagesDocument = (snapshot: DataSnapshot): Message[] => {
    const messagesDocument = snapshot.val();

    return Object.keys(messagesDocument).map(key => {
        const message = messagesDocument[key];

        return {
            ...message,
            id: key,
            createdOn: new Date(message.createdOn),
        };
    });
}

export const addMessage = (content: string, handle: string, channelId: string, isTech: boolean, typeOfMessage: string) => {

    return push(
        ref(db, 'messages'),
        {
            author: handle,
            toChannel: channelId,
            content,
            createdOn: Date.now(),
            techMessage: isTech,
            typeOfMessage,
        },
    )
        .then(result => {
            if(result.key === null) return;
            return getMessageById(result.key);
        })
        .catch(e => console.log(e));
};


export const addReply = (content: string, handle: string, channelId: string, toMessage: string, isTech: boolean, typeOfMessage: string) => {

    return push(
        ref(db, 'messages'),
        {
            author: handle,
            toChannel: channelId,
            toMessage,
            content,
            createdOn: Date.now(),
            techMessage: isTech,
            typeOfMessage,
        },
    )
        .then(result => {
            if(result.key === null) return;
            return getMessageById(result.key);
        })
        .catch(e => console.log(e));
};

export const addReplyToMessage = (messageId: string, replyId: string) => {
    const updateMessageReplies: {[key: string]: boolean} = {};
    updateMessageReplies[`/messages/${messageId}/replies/${replyId}`] = true;

    return update(ref(db), updateMessageReplies);
}

export const getMessageById = (id: string) => {

    return get(ref(db, `messages/${id}`))
        .then(result => {
            if (!result.exists()) {
                throw new Error(`Message with id ${id} does not exist!`);
            }

            const message = result.val();
            message.id = id;
            message.createdOn = new Date(message.createdOn);

            return message;
        })
        .catch(e => console.log(e));
};


export const getMessagesByAuthor = (handle: string): Promise<Message[]> => {

    return get(query(ref(db, 'messages'), orderByChild('author'), equalTo(handle)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromMessagesDocument(snapshot);
        });
};

export const getMessagesByChannel = (channelId: string): Promise<Message[]> => {

    return get(query(ref(db, 'messages'), orderByChild('author'), equalTo(channelId)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return fromMessagesDocument(snapshot);
        });
};

export const getAllMessages = (): Promise<Message[]> => {

    return get(ref(db, 'messages'))
        .then(snapshot => {
            if (!snapshot.exists()) {
                return [];
            }

            return fromMessagesDocument(snapshot);
        });
};

// export const addReactionToMessage = (messageId: string, reaction: string) => {
//     if(ref(db), `/messages/${messageId}/reactions/${reaction}`)
//     const updateChannelTitle: {[key: string]: string} = {};
//     updateChannelTitle[`/channels/${channelId}/title`] = title;

//     return update(ref(db), updateChannelTitle);
// }

