import { Button } from "@chakra-ui/button";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { BsEmojiGrin } from "react-icons/bs";

export interface EmojiPopoverProps {
    onGetEmoji:  (emoji: string) => void;
}

const EmojiPopover = ({onGetEmoji}: EmojiPopoverProps) => {
    return(
        <Popover>
        <PopoverTrigger>
            <Button><BsEmojiGrin size={30}/></Button>
        </PopoverTrigger>
        <PopoverContent w={'fit-content'}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Emojis!</PopoverHeader>
            <PopoverBody>
                <Picker data={data} onEmojiSelect={onGetEmoji} />
            </PopoverBody>
        </PopoverContent>
        </Popover>
    )
}

export default EmojiPopover;