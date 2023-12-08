import { Button, VStack, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
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
      <Popover isOpen={isOpen} onClose={onClose} >
        <PopoverTrigger>
          <Button colorScheme='teal' onClick={onToggle}>
            <MdMoreHoriz size={30} />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content" borderColor="RGB(59, 59, 59)"  >
            <PopoverArrow borderColor="RGB(59, 59, 59)"/>
            <PopoverBody bg={'RGB(59, 59, 59)'} borderColor={'RGB(59, 59, 59)'} justifyContent="center">
                <VStack>
                <SearchMessage messages={messages} channelId={channelId} />
                <RemoveMessageOrChat channelId={channelId} isFromChat={true}/>
                    
                </VStack>
            </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

export default ChatMoreOptions;