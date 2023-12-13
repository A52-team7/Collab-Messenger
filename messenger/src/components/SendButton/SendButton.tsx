import { Button, Tooltip } from '@chakra-ui/react';
import { useState } from 'react';
import { BsSend } from "react-icons/bs";
import { BsFillSendFill } from "react-icons/bs";

export interface SendButtonProps {
  onSendMessage: (event: React.KeyboardEvent<HTMLTextAreaElement> | React.MouseEvent<HTMLButtonElement>) => void;
}

const SendButton = ({ onSendMessage }: SendButtonProps) => {

  const [visibleColor, setVisibleColor] = useState(false);

  const onSeeColor = () => {
    setVisibleColor(true);
  }

  const onHideColor = () => {
    setVisibleColor(false);
  }

  return (
    <Tooltip hasArrow border={'1px solid black'} label={'Send message'} bg={'rgb(237,254,253)'} color='black'>
      <Button
        ml={-5}
        bg={'none'}
        color={'white'}
        flex={'1 0 auto'}
        onMouseEnter={onSeeColor}
        onMouseLeave={onHideColor}
        _hover={{ bg: 'none' }}
        _focus={{ bg: 'none' }}
        onClick={onSendMessage}>
        {!visibleColor ? (<BsSend size={35} />) : (<BsFillSendFill size={35} />)}
      </Button>
    </Tooltip>
  )
}

export default SendButton;