import { Box, Stack, UnorderedList } from "@chakra-ui/react";
import OneMessage from "../OneMessage/OneMessage";
import AppContext from "../../context/AppContext";
import { useRef, useEffect, useContext } from 'react';

export interface Message {
  id: string;
  content: string;
  author: string;
  createdOn: Date;
  techMessage: boolean;
  typeOfMessage: string;
  toMessage: string;
}

interface MessagesListProps {
  messages: Message[];
  setReplyIsVisible: (bool: boolean) => void;
  setMessageToReply: (messageContent: Message) => void;
}

const MessagesList = ({ messages, setReplyIsVisible, setMessageToReply }: MessagesListProps): JSX.Element => {
  const { userData } = useContext(AppContext);
  const bottomRef = useRef<Element | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <UnorderedList styleType='none'>
        {messages.map((message: Message) => (
          <Box
            display={'flex'}
            flexWrap={'wrap'}
            key={message.id}
            mr={message.author === userData?.handle ? 35 : 0}
            justifyContent={message.author === userData?.handle ? 'flex-end' : 'flex-start'}>
            <OneMessage {...{ message, setReplyIsVisible, setMessageToReply }} />
          </Box>
        ))}
      </UnorderedList>
      <Stack ref={bottomRef} />
    </>
  );
}

export default MessagesList;