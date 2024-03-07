import { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DailyIframe, { DailyCall, DailyEvent } from '@daily-co/daily-js';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';
import AppContext from '../../context/AppContext';

import { Box, Flex, Textarea } from '@chakra-ui/react';

import { deleteRoom, createRoom } from '../../services/api';
import { getChannelVideoSession, addChannelVideoSession, addEventMeetingLink, removeChannelVideoSession } from '../../services/video.service';
import { pageUrlFromRoomUrl } from '../../services/utils';

import HomeScreen from '../HomeScreen/HomeScreen';
import Call from '../Call/Call';
import Tray from '../Tray/Tray';
import HairCheck from '../HairCheck/HairCheck';

/* We decide what UI to show to users based on the state of the app, which is dependent on the state of the call object. */
const STATE_IDLE = 'STATE_IDLE';
const STATE_CREATING = 'STATE_CREATING';
const STATE_JOINING = 'STATE_JOINING';
const STATE_JOINED = 'STATE_JOINED';
const STATE_LEAVING = 'STATE_LEAVING';
const STATE_ERROR = 'STATE_ERROR';
const STATE_HAIRCHECK = 'STATE_HAIRCHECK';

export const GroupVideoMain = () => {
  const [appState, setAppState] = useState(STATE_IDLE);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [apiError, setApiError] = useState(false);
  const { callObject, setContext } = useContext(AppContext);

  const callObjectRef = useRef<DailyCall | null>(null);
  const roomRef = useRef<string | null>(null);

  const location = useLocation();

  const navigate = useNavigate();
  const channelId = location.state?.channelId;
  const eventId = location.state?.eventId;

  /**
   * Create a new call room. This function will return the newly created room URL.
   * We'll need this URL when pre-authorizing (https://docs.daily.co/reference/rn-daily-js/instance-methods/pre-auth)
   * or joining (https://docs.daily.co/reference/rn-daily-js/instance-methods/join) a call.
   */

  const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
      return createRoom()
      .then((room) => room.url)
      .catch((error) => {
        console.error('Error creating room', error);
        setRoomUrl(null);
        setAppState(STATE_IDLE);
        setApiError(true);
      });
  }, []);

  const startHairCheck = useCallback(async (url: string) => {
    if (callObject) return;
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setContext(prevState => ({
      ...prevState,
      callObject: newCallObject
    }))
    setAppState(STATE_HAIRCHECK);
    await newCallObject.preAuth({ url });
    await newCallObject.startCamera();
  }, []);

  /**
   * Once we pass the hair check, we can actually join the call.
   * We'll pass the username entered during Haircheck to .join().
   */
  const joinCall = useCallback((userName: string) => {
    if (callObject && roomUrl) {
      callObject.join({ url: roomUrl, userName });
      addChannelVideoSession(channelId, roomUrl);
      if (eventId) {
        addEventMeetingLink(eventId, roomUrl)
      }
    }

  }, [callObject, roomUrl]);

  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    // If we're in the error state, we've already "left", so just clean up
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setContext(prevState => ({
          ...prevState,
          callObject: null
        }));
        setAppState(STATE_IDLE);
      })
        .then(() => navigate(`/chat/${channelId}`))
    } else {
      /* This will trigger a `left-meeting` event, which in turn will trigger
      the full clean-up as seen in handleNewMeetingState() below. */
      setAppState(STATE_LEAVING);
      callObject.leave()
        .then(() => navigate(`/chat/${channelId}`))
    }
    if (roomRef.current) {
      deleteRoom(roomRef.current);
      removeChannelVideoSession(channelId);
    }
  }, [callObject, appState]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */

  // I am updating the ref to callObject
  useEffect(() => {
    callObjectRef.current = callObject;
    roomRef.current = roomUrl;
  }, [callObject]);

  
  useEffect(() => {
    return () => {
      if (callObjectRef.current) {
        if (Object.keys(callObjectRef.current.participants()).length === 0 && roomRef.current) {
          deleteRoom(roomRef.current);
          removeChannelVideoSession(channelId);
        }

        callObjectRef.current.destroy()
          .then(() => {
            setContext(prevState => ({
              ...prevState,
              callObject: null
            }));
          })
      }
    }
  }, []);

  // This may be needed if bugs occur!
  // useEffect(() => {
  //   console.log(callObject);

  //   if (callObject) {
  //     callObject.destroy()
  //       .then(() => {
  //         setContext(prevState => ({
  //           ...prevState,
  //           callObject: null
  //         }));
  //       })
  //   }
  // }, [])

  useEffect(() => {
    if (!channelId) navigate('/');
    getChannelVideoSession(channelId)
      .then(url => {
        if (url) {
          startHairCheck(url);
        }
      })
  }, [startHairCheck]);

  useEffect(() => {
    if (roomUrl) {
      const pageUrl = pageUrlFromRoomUrl(roomUrl);
      if (pageUrl === window.location.href) return;
      window.history.replaceState(null, roomUrl, pageUrl);
    }
  }, [roomUrl]);

  useEffect(() => {
    if (!callObject) return;

    const events: DailyEvent[] = ['joined-meeting', 'left-meeting', 'error', 'camera-error'];

    function handleNewMeetingState() {
      if (callObject) {
        switch (callObject.meetingState()) {
          case 'joined-meeting':
            setAppState(STATE_JOINED);
            break;
          case 'left-meeting':
            callObject.destroy().then(() => {
              setRoomUrl(null);
              setContext(prevState => ({
                ...prevState,
                callObject: null
              }));
              setAppState(STATE_IDLE);
            });
            break;
          case 'error':
            setAppState(STATE_ERROR);
            break;
          default:
            break;
        }
      }
    }

    handleNewMeetingState();

    events.forEach((event) => callObject.on(event, handleNewMeetingState));

    return () => {
      events.forEach((event) => callObject.off(event, handleNewMeetingState));
    };
  }, [callObject]);

  const showCall = !apiError && [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(appState);

  const showHairCheck = !apiError && appState === STATE_HAIRCHECK;

  const renderApp = () => {
    // If something goes wrong with creating the room.
    if (apiError) {
      return (
        <Box className="api-error">
          <Textarea>
            OH, NO! We have encountered a problem :(
          </Textarea>
        </Box>
      );
    }

    if (callObject && (showHairCheck || showCall)) {
      return (
        <DailyProvider callObject={callObject}>
          {showHairCheck ? (
            <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
          ) : (
            <Flex h={'calc(100vh - 60px)'} m={'auto'} flexDirection={'column'} justifyContent={'space-between'}>
              <Box>
                <Call />
              </Box>
              <Box>
                <DailyAudio />
              </Box>
              <Box>
                <Tray leaveCall={startLeavingCall} />
              </Box>
            </Flex>
          )}
        </DailyProvider>
      );
    }

    return <HomeScreen createCall={createCall} startHairCheck={startHairCheck} />;
  };

  return (
    <Box>
      {renderApp()}
    </Box>
  );
}

export default GroupVideoMain;