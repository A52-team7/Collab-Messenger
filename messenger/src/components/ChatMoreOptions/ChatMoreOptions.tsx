import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { MdMoreHoriz } from "react-icons/md";
import RemoveMessageOrChat from "../RemoveMessageOrChat/RemoveMessageOrChat";

export interface ChatMoreOptionsProps {
    channelId: string;
}

const ChatMoreOptions = ({ channelId }: ChatMoreOptionsProps) => {

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
                    
                </Flex>
            </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

export default ChatMoreOptions;