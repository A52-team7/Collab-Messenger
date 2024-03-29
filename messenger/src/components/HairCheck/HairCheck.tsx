import { useCallback, useState } from 'react';
import {
  useDevices,
  // useDaily,
  useDailyEvent,
  DailyVideo,
  useLocalSessionId,
  // useParticipantProperty,
} from '@daily-co/daily-react';
import UserMediaError from '../UserMediaError/UserMediaError';
import AppContext from '../../context/AppContext';
import { useContext } from 'react';

import { Box, Button, Center, Flex, FormLabel, Heading, Select } from '@chakra-ui/react';

export default function HairCheck({ joinCall, cancelCall }: {joinCall: (username: string) => void, cancelCall: () => void}) {
  const localSessionId = useLocalSessionId();
  // const initialUsername = useParticipantProperty(localSessionId, 'user_name');
  const { currentCam, currentMic, currentSpeaker, microphones, speakers, cameras, setMicrophone, setCamera, setSpeaker } = useDevices();
  // const callObject = useDaily();
  const { userData } = useContext(AppContext);
  const username = userData?.firstName + ' ' + userData?.lastName;

  const [getUserMediaError, setGetUserMediaError] = useState(false);

  useDailyEvent(
    'camera-error',
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  const handleJoin = (e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    joinCall(username.trim());
  };

  const updateMicrophone = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMicrophone(e.target.value);
  };

  const updateSpeakers = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpeaker(e.target.value);
  };

  const updateCamera = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCamera(e.target.value);
  };

  return getUserMediaError ? (
    <UserMediaError />
  ) : (
    <Flex
      bg={'grey'}
      border={'1px solid grey'}
      p={'1rem'}
      borderRadius={'4px'}
      maxW={'600px'}
      direction={'column'}
      m={'auto'}
      justifyContent={'center'}
      onSubmit={handleJoin}>
      <Center>
        <Heading mb={5} size='lg'>Setup your hardware</Heading>
      </Center>

      {/* Video preview */}
      <Box m={'auto'} maxW={'425px'}>
        {localSessionId && <DailyVideo sessionId={localSessionId} mirror type='video'/>}
      </Box>

      {/* Username */}
      {/* Microphone select */}
      <Box>
        <FormLabel htmlFor="micOptions" fontSize={'12px'} lineHeight={'14px'} m={'1em 0 0.5em 0'}>Microphone:</FormLabel>
        <Select name="micOptions" bg={'white'} onChange={updateMicrophone} value={currentMic?.device?.deviceId}>
          {microphones.map((mic) => (
            <option key={`mic-${mic.device.deviceId}`} value={mic.device.deviceId}>
              {mic.device.label}
            </option>
          ))}
        </Select>
      </Box>

      {/* Speakers select */}
      <Box>
        <FormLabel htmlFor="speakersOptions" fontSize={'12px'} lineHeight={'14px'} m={'1em 0 0.5em 0'}>Speakers:</FormLabel>
        <Select name="speakersOptions" bg={'white'} onChange={updateSpeakers} value={currentSpeaker?.device?.deviceId}>
          {speakers.map((speaker) => (
            <option key={`speaker-${speaker.device.deviceId}`} value={speaker.device.deviceId}>
              {speaker.device.label}
            </option>
          ))}
        </Select>
      </Box>

      {/* Camera select */}
      <Box>
        <FormLabel htmlFor="cameraOptions" fontSize={'12px'} lineHeight={'14px'} m={'1em 0 0.5em 0'}>Camera:</FormLabel>
        <Select name="cameraOptions" bg={'white'} onChange={updateCamera} value={currentCam?.device?.deviceId}>
          {cameras.map((camera) => (
            <option key={`cam-${camera.device.deviceId}`} value={camera.device.deviceId}>
              {camera.device.label}
            </option>
          ))}
        </Select>
      </Box>

      <Flex mt={5}>
        <Button
          mr={2}
          w='full'
          border={'2px solid'}
          borderColor={'teal.500'}
          bg={'none'}
          color={'teal.500'}
          _hover={{ opacity: 0.8 }}
          onClick={cancelCall}
          type="button">
          Back
        </Button>
        <Button
          ml={2}
          bg={'teal.500'}
          color={'white'}
          w='full'
          _hover={{ opacity: 0.8 }}
          onClick={handleJoin}
          type="submit">
          Join call
        </Button>
      </Flex>
    </Flex>
  );
}
