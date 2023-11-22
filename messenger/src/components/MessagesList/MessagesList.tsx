import { UnorderedList } from "@chakra-ui/react";
import OneMessage from "../OneMessage/OneMessage";

interface Message {
    id: string;
    content: string;
    author: string;
    createdOn: Date;
}

const MessagesList = (messages: Message[]) => {
    return (
        <>
            <UnorderedList styleType = 'none'>
            {messages.map((message) => (
                <OneMessage key={message.id} message={message.content}/>
            ))}
            </UnorderedList>
        </>
    );
}

export default MessagesList;