import { useRef } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { DailyVideo, useVideoTrack } from '@daily-co/daily-react';
import { Button } from '@chakra-ui/react';
import './Tile.css';
import { BsArrowsFullscreen } from "react-icons/bs";
import Username from '../Username/Username';

interface TileProps {
  id: string;
  isScreenShare?: boolean;
  mapIndex?: number;
  isLocal?: boolean;
  isAlone?: boolean;
}

const Tile = ({ id, isScreenShare, mapIndex, isLocal, isAlone }: TileProps) => {
  const videoState = useVideoTrack(id);
  const borderColor = (mapIndex + 2) % 2 === 0 ? 'teal.300' : 'rgb(188,124,213)';
  const shareScreenRef = useRef();

  const handleFullScreen = () => {
    if (shareScreenRef.current) {
      if (shareScreenRef.current.requestFullscreen) {
        shareScreenRef.current.requestFullscreen();
      } else if (shareScreenRef.current.mozRequestFullScreen) {
        shareScreenRef.current.mozRequestFullScreen();
      } else if (shareScreenRef.current.webkitRequestFullscreen) {
        shareScreenRef.current.webkitRequestFullscreen();
      } else if (shareScreenRef.current.msRequestFullscreen) {
        shareScreenRef.current.msRequestFullscreen();
      }
    }
  };

  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  if (isLocal) {
    containerCssClasses += ' self-view';
    if (isAlone) {
      containerCssClasses += ' alone';
    }
  }

  return (
    <Box
      hidden={videoState.isOff ? true : false}
      position={'relative'}
      w={isScreenShare ? '60%' : '31%'}
      m={1} p={1}
      border={'2px solid'} borderColor={borderColor}
      rounded={'lg'}>
      <DailyVideo id='DailyVideo' ref={shareScreenRef} automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
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