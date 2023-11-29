import { Box, Stack, UnorderedList } from "@chakra-ui/react";
import OneMessage from "../OneMessage/OneMessage";
import { useRef, useEffect } from 'react';

export interface Message {
    id: string;
    content: string;
    author: string;
    createdOn: Date;
    techMessage: boolean;
    typeOfMessage: string;
    toMessage: string;
}

interface MessagesListProps{
    messages: Message[];
    setReplyIsVisible: (bool:boolean) => void;
    setMessageToReply: (messageContent: Message) => void;
}

const MessagesList = ({messages, setReplyIsVisible, setMessageToReply}: MessagesListProps): JSX.Element => {    
    const bottomRef = useRef<Element | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [messages]);
    
    return (
        <>
            <UnorderedList  styleType = 'none' w={'70vw'}>
            {messages.map((message: Message) => (
                <Box key={message.id}>
                    <OneMessage {...{message, setReplyIsVisible, setMessageToReply}}/>
                </Box>
            ))}
            </UnorderedList>
            <Stack ref={bottomRef}/>
        </>
    );
}

export default MessagesList;