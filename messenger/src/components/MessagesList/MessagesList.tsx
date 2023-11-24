import { Box, UnorderedList } from "@chakra-ui/react";
import OneMessage from "../OneMessage/OneMessage";

export interface Message {
    id: string;
    content: string;
    author: string;
    createdOn: Date;
}

interface MessagesListProps{
    messages: Message[];
}

const MessagesList = ({messages}: MessagesListProps): JSX.Element => {    
    return (
        <>
            <UnorderedList styleType = 'none' w={'70vw'}>
            {messages.map((message: Message) => (
                <Box key={message.id}>
                    <OneMessage {...message}/>
                </Box>
            ))}
            </UnorderedList>
        </>
    );
}

export default MessagesList;