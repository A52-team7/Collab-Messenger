import React, { useCallback, useState } from 'react';
import {
  useAppMessage,
  useAudioTrack,
  useDaily,
  useLocalSessionId,
  useScreenShare,
  useVideoTrack,
} from '@daily-co/daily-react';

// import MeetingInformation from '../MeetingInformation/MeetingInformation';
// import VideoChat from '../VideoChat/VideoChat';

import { Box, Flex, Button, } from '@chakra-ui/react';
import {
  CameraOn,
  Leave,
  CameraOff,
  MicrophoneOff,
  MicrophoneOn,
  Screenshare,
  // Info,
  // ChatIcon,
  // ChatHighlighted,
} from './Icons';

export default function Tray({ leaveCall }) {
  const callObject = useDaily();
  const { isSharingScreen, startScreenShare, stopScreenShare } = useScreenShare();

  // const [showMeetingInformation, setShowMeetingInformation] = useState(false);
  // const [showChat, setShowChat] = useState(false);
  // const [newChatMessage, setNewChatMessage] = useState(false);

  const localSessionId = useLocalSessionId();
  const localVideo = useVideoTrack(localSessionId);
  const localAudio = useAudioTrack(localSessionId);
  const mutedVideo = localVideo.isOff;
  const mutedAudio = localAudio.isOff;

  /* When a remote participant sends a message in the chat, we want to display a differently colored
   * chat icon in the Tray as a notification. By listening for the `"app-message"` event we'll know
   * when someone has sent a message. */
  // useAppMessage({
  //   onAppMessage: useCallback(() => {
  //     /* Only light up the chat icon if the chat isn't already open. */
  //     if (!showChat) {
  //       setNewChatMessage(true);
  //     }
  //   }, [showChat])
  // });

  const toggleVideo = useCallback(() => {
    if (callObject) callObject.setLocalVideo(mutedVideo);
  }, [callObject, mutedVideo]);

  const toggleAudio = useCallback(() => {
    if (callObject) callObject.setLocalAudio(mutedAudio);
  }, [callObject, mutedAudio]);

  const toggleScreenShare = () => isSharingScreen ? stopScreenShare() : startScreenShare();

  // const toggleMeetingInformation = () => {
  //   setShowMeetingInformation(!showMeetingInformation);
  // };

  // const toggleChat = () => {
  //   setShowChat(!showChat);
  //   if (newChatMessage) {
  //     setNewChatMessage(!newChatMessage);
  //   }
  // };

  return (
    <Box w={{ md: '100%', lg: '90%', xl: '80%' }} p={1} m={'auto'} rounded={'lg'} px={{ base: 0, md: 0, lg: 0, xl: 10 }}>
      {/* <VideoChat showChat={showChat} toggleChat={toggleChat} /> */}
      <Flex mx={{ base: 0, md: 1 }} justifyItems={'flex-end'} justifyContent={'space-between'}>
        <Button size={{ sm: 'sm', md: 'md', lg: 'md' }} bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={toggleVideo}>
          {mutedVideo ? <CameraOff /> : <CameraOn />}
          {mutedVideo ? 'Turn camera on' : 'Turn camera off'}
        </Button>
        <Button size={{ sm: 'sm', md: 'md', lg: 'md' }} bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={toggleAudio}>
          {mutedAudio ? <MicrophoneOff /> : <MicrophoneOn />}
          {mutedAudio ? 'Unmute mic' : 'Mute mic'}
        </Button>
        <Button size={{ sm: 'sm', md: 'md', lg: 'md' }} bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={toggleScreenShare}>
          <Screenshare />
          {isSharingScreen ? 'Stop sharing screen' : 'Share screen'}
        </Button>
        <Button size={{ sm: 'sm', md: 'md', lg: 'md' }} bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={leaveCall}>
          <Leave /> Leave call
        </Button>
        {/* <Button bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={toggleMeetingInformation}>
          <Info />
          {showMeetingInformation ? 'Hide info' : 'Show info'}
        </Button> */}
        {/* <Button bg={'rgb(237,254,253)'} _hover={{ bg: 'teal.300' }} onClick={toggleChat}>
          {newChatMessage ? <ChatHighlighted /> : <ChatIcon />}
          {showChat ? 'Hide chat' : 'Show chat'}
        </Button> */}
      </Flex>
    </Box>
  );
}
