import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { VscReactions } from "react-icons/vsc";

export interface ReactionPopoverProps {
    onAddReaction: (reaction: string) => void;
}

const ReactionPopover = ({ onAddReaction }: ReactionPopoverProps) => {

    const { isOpen, onClose, onToggle } = useDisclosure();
  
    const onReaction = (reaction: string) => {
      onAddReaction(reaction);
      onClose();
    };
  
    return (
      <Popover isOpen={isOpen} onClose={onClose} placement="top">
        <PopoverTrigger>
          <Button p={1} size="xs" bg="none" onClick={onToggle}>
            <VscReactions size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content">
            <PopoverArrow />
            <PopoverBody justifyContent="center">
                <Flex>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction('👍')}>
                        👍
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction('❤️')}>
                        ❤️
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction('😆')}>
                        😆
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction('😍')}>
                        😍
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction('😲')}>
                        😲
                    </Button>
                </Flex>
            </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

export default ReactionPopover;