import { useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { DailyVideo, useVideoTrack } from '@daily-co/daily-react';
import { Button } from '@chakra-ui/react';
import { BsArrowsFullscreen } from "react-icons/bs";
import Username from '../Username/Username';

interface TileProps {
  id: string;
  isScreenShare?: boolean;
  mapIndex?: number;
  isLocal?: boolean;
  isAlone?: boolean;
}

interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const Tile = ({ id, isScreenShare, mapIndex, isLocal }: TileProps) => {
  const videoState = useVideoTrack(id);
  const borderColor = mapIndex ? (mapIndex + 2) % 2 === 0 ? 'teal.300' : 'rgb(188,124,213)' : '';
  const shareScreenRef = useRef<HTMLVideoElement | null>(null);

const handleFullScreen = () => {
  const videoElem = shareScreenRef.current as ExtendedHTMLVideoElement;
  if (videoElem) {
    if (videoElem.requestFullscreen) {
      videoElem.requestFullscreen();
    } else if (videoElem.mozRequestFullScreen) {
      videoElem.mozRequestFullScreen();
    } else if (videoElem.webkitRequestFullscreen) {
      videoElem.webkitRequestFullscreen();
    } else if (videoElem.msRequestFullscreen) {
      videoElem.msRequestFullscreen();
    }
  }
};

  return (
    <Box
      hidden={videoState.isOff ? true : false}
      position={'relative'}
      w={isScreenShare ? '60%' : '31%'}
      m={1} p={1}
      border={'2px solid'} borderColor={borderColor}
      rounded={'lg'}>
      <DailyVideo fit='cover' style={{ width: '100%', height: '100%' }} ref={shareScreenRef} automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
      {!isScreenShare && <Username id={id} isLocal={isLocal} />}
      {isScreenShare &&
        <Button
          position={'absolute'}
          bottom={2}
          left={'50%'}
          transform={'translateX(-50%)'}
          onClick={handleFullScreen}>
          <Text mr={3}>Fullscreen</Text>
          <BsArrowsFullscreen size={20} />
        </Button>
      }
    </Box>
  );
}

export default Tile;