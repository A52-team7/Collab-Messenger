import { ref, push, get, DataSnapshot, update, onValue, remove } from 'firebase/database';
import { db } from '../config/firebaseConfig.ts';
import { Message } from '../components/MessagesList/MessagesList.tsx';
import { removeUserReactionFromMessage } from './users.service.ts';



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
      if (result.key === null) return;
      return getMessageById(result.key);
    })
    .catch(e => console.error(e));
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
      if (result.key === null) return;
      return getMessageById(result.key);
    })
    .catch(e => console.error(e));
};

export const addReplyToMessage = (messageId: string, replyId: string) => {
  const updateMessageReplies: { [key: string]: boolean } = {};
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
    .catch(e => console.error(e));
};

export const addReactionToMessage = (messageId: string, reaction: string, handle: string) => {
  const updateMessageReactions: { [key: string]: boolean } = {};
  updateMessageReactions[`/messages/${messageId}/reactions/${reaction}/${handle}`] = true;

  return update(ref(db), updateMessageReactions);
}

export const removeReactionFromMessage = (messageId: string, reaction: string, handle: string) => {
  remove(ref(db, `messages/${messageId}/reactions/${reaction}/${handle}`));
}

export interface ReactionItemInterface {
  0: string;
  1: string[];
}
export interface ReactionArray {
  reactions: ReactionItemInterface[] | null;
}

export interface ReactionsListener { (reactions: ReactionArray): void }

export const getMessageReactionsLive = (messageId: string, listener: ReactionsListener) => {

  return onValue(ref(db, `messages/${messageId}/reactions`), (snapshot) => {
    if (!snapshot.exists()) return listener({ reactions: null });

    const reactions: ReactionItemInterface[] = Object.keys(snapshot.val()).map((reaction) => {
      return [reaction, Object.keys(snapshot.val()[reaction])] as ReactionItemInterface;
    });

    const reactionArray: ReactionArray = {
      reactions: reactions
    };

    return listener(reactionArray);
  })
}

export const deleteMessage = (messageId: string) => {
  getMessageById(messageId)
    .then((message) => {

      remove(ref(db, `users/${message.author}/myMessages/${messageId}`));

      remove(ref(db, `channels/${message.toChannel}/messages/${messageId}`));

      if (Object.keys(message).includes('reactions')) {
        const reactionsOfMessage: ReactionItemInterface[] = Object.keys(message.reactions).map((reaction) => {
          return [reaction, Object.keys(message.reactions[reaction])];
        });

        reactionsOfMessage.map(reaction => {
          (reaction[1]).map(user => removeUserReactionFromMessage(messageId, reaction[0], user));
        });
      }

      remove(ref(db, `messages/${messageId}`));

    })
    .catch(e => console.error(e));
}

export const updateContentOfMessage = (messageId: string, content: string) => {
  const updateMessageContent: { [key: string]: string } = {};
  updateMessageContent[`/messages/${messageId}/content`] = content;

  return update(ref(db), updateMessageContent);
}