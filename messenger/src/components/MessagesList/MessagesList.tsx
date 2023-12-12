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
  toChannel: string;
  reactions: [];
}

interface MessagesListProps {
  messages: Message[];
  setReplyIsVisible: (bool: boolean) => void;
  setMessageToReply: (messageContent: Message) => void;
}

const MessagesList = ({ messages, setReplyIsVisible, setMessageToReply }: MessagesListProps): JSX.Element => {
  const { userData } = useContext(AppContext);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight - container.clientHeight;
    }
  }, [messages]);

  console.error('i am messages list');

  return (
    <UnorderedList styleType='none'>
      {messages.map((message: Message) => (
        <Box
          display={'flex'}
          ref={containerRef}
          flexWrap={'wrap'}
          key={message.id}
          mr={message.author === userData?.handle ? 35 : 0}
          justifyContent={message.author === userData?.handle ? 'flex-end' : 'flex-start'}>
          <OneMessage {...{ message, setReplyIsVisible, setMessageToReply }} />
        </Box>
      ))}
      <Stack ref={containerRef} />  
    </UnorderedList>  
  );
}

export default MessagesList;