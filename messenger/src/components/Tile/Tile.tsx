import { Box } from '@chakra-ui/react';
import { DailyVideo, useVideoTrack } from '@daily-co/daily-react';
import Username from '../Username/Username';

const Tile = ({ id, isScreenShare, mapIndex, isLocal, isAlone }) => {
  const videoState = useVideoTrack(id);
  const borderColor = (mapIndex + 2) % 2 === 0 ? 'teal.300' : 'rgb(188,124,213)'

  let containerCssClasses = isScreenShare ? 'tile-screenshare' : 'tile-video';

  if (isLocal) {
    containerCssClasses += ' self-view';
    if (isAlone) {
      containerCssClasses += ' alone';
    }
  }

  /* If a participant's video is muted, hide their video and
  add a different background color to their tile. */
  if (videoState.isOff) {
    containerCssClasses += ' no-video';
  }

  return (
    <Box
      minW={'30%'} maxW={'50%'}
      m={1} p={1}
      border={'2px solid'} borderColor={borderColor}
      rounded={'lg'}>
      <DailyVideo automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
      {!isScreenShare && <Username id={id} isLocal={isLocal} />}
    </Box>
  );
}

export default Tile;