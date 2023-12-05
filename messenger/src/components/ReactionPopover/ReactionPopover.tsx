import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from "@chakra-ui/react";
import { VscReactions } from "react-icons/vsc";
import { ASTONISHED, HEART, HEART_EYES, LIKE, SMILE } from "../../common/constants";

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
          <Button p={1} size="xs" color={'white'}  _hover={{ transform: 'scale(1.5)', color: 'white' }} bg="none" onClick={onToggle}>
            <VscReactions size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent w="fit-content">
            <PopoverArrow />
            <PopoverBody justifyContent="center">
                <Flex>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction(LIKE)}>
                        {LIKE}
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction(HEART)}>
                        {HEART}
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction(SMILE)}>
                        {SMILE}
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction(HEART_EYES)}>
                        {HEART_EYES}
                    </Button>
                    <Button bg="none" p={1} size="md" onClick={() => onReaction(ASTONISHED)}>
                        {ASTONISHED}
                    </Button>
                </Flex>
            </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  };

export default ReactionPopover;