import { Box } from '@chakra-ui/react';
import { DailyVideo, useVideoTrack } from '@daily-co/daily-react';
import Username from '../Username/Username';

const Tile = ({ id, isScreenShare, isLocal, isAlone }) => {
  const videoState = useVideoTrack(id);

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
    <Box m={1} p={1} maxW={'50%'} className={containerCssClasses} border={'2px solid'} borderColor={'teal.300'} rounded={'lg'}>
      <DailyVideo automirror sessionId={id} type={isScreenShare ? 'screenVideo' : 'video'} />
      {!isScreenShare && <Username id={id} isLocal={isLocal} />}
    </Box>
  );
}

export default Tile;