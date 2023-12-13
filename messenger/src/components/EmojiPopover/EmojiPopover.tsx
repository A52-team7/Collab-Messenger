import { Button } from "@chakra-ui/button";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import { Tooltip } from "@chakra-ui/react";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { BsEmojiLaughing } from "react-icons/bs";
import { BsEmojiLaughingFill } from "react-icons/bs";
import { useState } from 'react';

export interface EmojiPopoverProps {
  onGetEmoji: (emoji: string) => void;
}

const EmojiPopover = ({ onGetEmoji }: EmojiPopoverProps) => {

  const [visibleColor, setVisibleColor] = useState(false);

  const onSeeColor = () => {
    setVisibleColor(true);
  }

  const onHideColor = () => {
    setVisibleColor(false);
  }


  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Tooltip hasArrow border={'1px solid black'} label={'Select emojis'} bg={'rgb(237,254,253)'} color='black'>
          <Button
            bg={'none'}
            color={'white'}
            onMouseEnter={onSeeColor}
            onMouseLeave={onHideColor}
            _hover={{ bg: 'none' }}
            _focus={{ bg: 'none' }}>
            {!visibleColor ? (<BsEmojiLaughing size={35} />) : (<BsEmojiLaughingFill size={35} />)}
          </Button>
        </Tooltip>

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