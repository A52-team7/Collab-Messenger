import { useState, useCallback } from 'react';
import {
  useParticipantIds,
  useScreenShare,
  useDailyEvent,
  useLocalSessionId,
} from '@daily-co/daily-react';

import { Flex, Heading, Box } from '@chakra-ui/react';
import Tile from '../Tile/Tile';
import UserMediaError from '../UserMediaError/UserMediaError';

export default function Call() {
  /* If a participant runs into a getUserMedia() error, we need to warn them. */
  const [getUserMediaError, setGetUserMediaError] = useState(false);

  /* We can use the useDailyEvent() hook to listen for daily-js events. Here's a full list
   * of all events: https://docs.daily.co/reference/daily-js/events */
  useDailyEvent(
    'camera-error',
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  /* This is for displaying remote participants: this includes other humans, but also screen shares. */
  const { screens } = useScreenShare();
  const remoteParticipantIds = useParticipantIds({ filter: 'remote' });

  /* This is for displaying our self-view. */
  const localSessionId = useLocalSessionId();
  const isAlone = remoteParticipantIds.length < 1 || screens.length < 1;

  const renderCallScreen = () => (
    // className = { screens.length > 0 ? 'is-screenshare' : 'call' }
    <Box>
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        {/* Your self view */}
        {localSessionId && (
          <Tile
            id={localSessionId}
            isLocal
            isAlone={isAlone}
          />
        )}
        {/* Videos of remote participants and screen shares */}
        {(remoteParticipantIds.length > 0 || screens.length > 0) && (
          <>
            {remoteParticipantIds.map((id, mapIndex) => (
              <Tile key={id} id={id} mapIndex={mapIndex} />
            ))}
            {screens.map((screen) => (
              <Tile key={screen.screenId} id={screen.session_id} isScreenShare />
            ))}
          </>
        )}
      </Flex>
      {
        // When there are no remote participants or screen shares
        (remoteParticipantIds.length < 1) &&
        <Box mt={'auto'} p={10} textAlign={'center'}>
          <Heading color={'rgb(237,254,253)'}>Waiting for others</Heading>
        </Box>
      }
    </Box>
  );

  return getUserMediaError ? <UserMediaError /> : renderCallScreen();
}
