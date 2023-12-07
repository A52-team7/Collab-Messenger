import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import RemoveMessageOrChat from "../RemoveMessageOrChat/RemoveMessageOrChat";
import  { Message } from '../MessagesList/MessagesList.tsx';
import SearchMessage from '../SearchMessage/SearchMessage';

export interface ChatMoreOptionsProps {
  messages: Message[],  
  channelId: string, 
}

const ChatMoreOptions = ({ messages, channelId }: ChatMoreOptionsProps) => {

    const { isOpen, onClose, onToggle } = useDisclosure();
  
    return (
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>
          <Button colorScheme='teal' onClick={onToggle}>
            <MdMoreHoriz size={30} />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content">
            <PopoverArrow />
            <PopoverBody justifyContent="center">
                <Flex>
                    <RemoveMessageOrChat channelId={channelId} isFromChat={true}/>
                    <SearchMessage messages={messages} channelId={channelId} />
                </Flex>
            </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

export default ChatMoreOptions;