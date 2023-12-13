import { useCallback, useEffect, useState } from 'react';
import {
  useDevices,
  useDaily,
  useDailyEvent,
  DailyVideo,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';
import UserMediaError from '../UserMediaError/UserMediaError';

import { Box, Button, Center, Flex, FormLabel, Heading, Input, Select } from '@chakra-ui/react';

export default function HairCheck({ joinCall, cancelCall }) {
  const localSessionId = useLocalSessionId();
  const initialUsername = useParticipantProperty(localSessionId, 'user_name');
  const { currentCam, currentMic, currentSpeaker, microphones, speakers, cameras, setMicrophone, setCamera, setSpeaker } = useDevices();
  const callObject = useDaily();
  const [username, setUsername] = useState(initialUsername);

  const [getUserMediaError, setGetUserMediaError] = useState(false);

  useEffect(() => {
    setUsername(initialUsername);
  }, [initialUsername]);

  useDailyEvent(
    'camera-error',
    useCallback(() => {
      setGetUserMediaError(true);
    }, []),
  );

  const handleChange = (e) => {
    setUsername(e.target.value);
    callObject.setUserName(e.target.value);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    joinCall(username.trim());
  };

  const updateMicrophone = (e) => {
    setMicrophone(e.target.value);
  };

  const updateSpeakers = (e) => {
    setSpeaker(e.target.value);
  };

  const updateCamera = (e) => {
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
        {localSessionId && <DailyVideo sessionId={localSessionId} mirror />}
      </Box>

      {/* Username */}
      <Box>
        <FormLabel htmlFor="username" fontSize={'12px'} lineHeight={'14px'} m={'1em 0 0.5em 0'}>Your name:</FormLabel>
        <Input
          bg={'white'}
          name="username"
          type="text"
          placeholder="Enter username"
          onChange={handleChange}
          value={username || ' '}
        />
      </Box>

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
          w='full'
          border={'2px solid'}
          borderColor={'teal.500'}
          bg={'none'}
          color={'teal.500'}
          _hover={{ opacity: 0.8 }}
          onClick={cancelCall}
          type="button">
          Back to start
        </Button>
        <Button
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
