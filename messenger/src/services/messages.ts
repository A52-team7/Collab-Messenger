import { ref, push, get, query, equalTo, orderByChild, DataSnapshot, update, onValue } from 'firebase/database';
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

export const addReactionToMessage = (messageId: string, reaction: string, handle: string) => {
    const updateMessageReactions: {[key: string]: boolean} = {};
    updateMessageReactions[`/messages/${messageId}/reactions/${reaction}/${handle}`] = true;

    return update(ref(db), updateMessageReactions);
}

export const getIfUserHasReactedToMessage = (messageId: string, handle: string) => {

    return get(query(ref(db, `messages/${messageId}/reactions`), orderByChild('😆'), equalTo(`${handle}:true`)))
        .then(snapshot => {
            if (!snapshot.exists()) return [];

            return (snapshot);
        });
};

export interface ReactionItem {
    0: string;
    1: string[];
  }
export interface ReactionArray {
    reactions: ReactionItem[];
}

export interface ReactionsListener{(reactions: ReactionArray): void}

export const getMessageReactionsLive = (messageId: string, listener: ReactionsListener)=>{

  return onValue(ref(db ,`messages/${messageId}/reactions`), (snapshot) => {
    if(!snapshot.exists()) return[];
    
    const reactions: ReactionItem[]= Object.keys(snapshot.val()).map((reaction) => {
        return [reaction, Object.keys(snapshot.val()[reaction])] as ReactionItem;
    });
    
    const reactionArray: ReactionArray = {
        reactions: reactions
    };

    return listener(reactionArray);
  })
}