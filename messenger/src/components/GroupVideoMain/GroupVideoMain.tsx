import './GroupVideoMain.css';

import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DailyIframe, { DailyCall } from '@daily-co/daily-js';
import { DailyAudio, DailyProvider } from '@daily-co/daily-react';

import { Box, Flex } from '@chakra-ui/react'

import api from '../../services/api';
import { getChannelVideoSession, addChannelVideoSession } from '../../services/video.service';
import { roomUrlFromPageUrl, pageUrlFromRoomUrl } from '../../services/utils';

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
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [apiError, setApiError] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();
  const channelId = location.state?.channelId;

  /**
   * Create a new call room. This function will return the newly created room URL.
   * We'll need this URL when pre-authorizing (https://docs.daily.co/reference/rn-daily-js/instance-methods/pre-auth)
   * or joining (https://docs.daily.co/reference/rn-daily-js/instance-methods/join) a call.
   */
  const createCall = useCallback(() => {
    setAppState(STATE_CREATING);
    return api
      .createRoom()
      .then((room) => room.url)
      .catch((error) => {
        console.error('Error creating room', error);
        setRoomUrl(null);
        setAppState(STATE_IDLE);
        setApiError(true);
      });
  }, []);

  const startHairCheck = useCallback(async (url: string) => {
    const newCallObject = DailyIframe.createCallObject();
    setRoomUrl(url);
    setCallObject(newCallObject);
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
    }

  }, [callObject, roomUrl]);

  const startLeavingCall = useCallback(() => {
    if (!callObject) return;
    // If we're in the error state, we've already "left", so just clean up
    if (appState === STATE_ERROR) {
      callObject.destroy().then(() => {
        setRoomUrl(null);
        setCallObject(null);
        setAppState(STATE_IDLE);
      });
    } else {
      /* This will trigger a `left-meeting` event, which in turn will trigger
      the full clean-up as seen in handleNewMeetingState() below. */
      setAppState(STATE_LEAVING);
      callObject.leave();
    }
    navigate(`/chat/${channelId}`);
  }, [callObject, appState]);

  /**
   * If a room's already specified in the page's URL when the component mounts,
   * join the room.
   */
  useEffect(() => {
    if (!channelId) navigate('/');
    getChannelVideoSession(channelId)
      .then(url => {
        if (url) {
          startHairCheck(url);
        }
      })
  }, [startHairCheck]);

  /**
   * Update the page's URL to reflect the active call when roomUrl changes.
   */
  useEffect(() => {
    if (roomUrl) {
      const pageUrl = pageUrlFromRoomUrl(roomUrl);
      if (pageUrl === window.location.href) return;
      window.history.replaceState(null, null, pageUrl);
    }
  }, [roomUrl]);

  /**
   * Update app state based on reported meeting state changes.
   *
   * NOTE: Here we're showing how to completely clean up a call with destroy().
   * This isn't strictly necessary between join()s, but is good practice when
   * you know you'll be done with the call object for a while, and you're no
   * longer listening to its events.
   */
  useEffect(() => {
    if (!callObject) return;

    const events = ['joined-meeting', 'left-meeting', 'error', 'camera-error'];

    function handleNewMeetingState() {
      if (callObject) {
        switch (callObject.meetingState()) {
          case 'joined-meeting':
            setAppState(STATE_JOINED);
            break;
          case 'left-meeting':
            callObject.destroy().then(() => {
              setRoomUrl(null);
              setCallObject(null);
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

    // Use initial state
    handleNewMeetingState();

    /*
     * Listen for changes in state.
     * We can't use the useDailyEvent hook (https://docs.daily.co/reference/daily-react/use-daily-event) for this
     * because right now, we're not inside a <DailyProvider/> (https://docs.daily.co/reference/daily-react/daily-provider)
     * context yet. We can't access the call object via daily-react just yet, but we will later in Call.js and HairCheck.js!
     */
    events.forEach((event) => callObject.on(event, handleNewMeetingState));

    // Stop listening for changes in state
    return () => {
      events.forEach((event) => callObject.off(event, handleNewMeetingState));
    };
  }, [callObject]);

  /**
   * Show the call UI if we're either joining, already joined, or have encountered
   * an error that is _not_ a room API error.
   */
  const showCall = !apiError && [STATE_JOINING, STATE_JOINED, STATE_ERROR].includes(appState);

  /* When there's no problems creating the room and startHairCheck() has been successfully called,
   * we can show the hair check UI. */
  const showHairCheck = !apiError && appState === STATE_HAIRCHECK;

  const renderApp = () => {
    // If something goes wrong with creating the room.
    if (apiError) {
      return (
        <div className="api-error">
          <p>
            OH, NO! We have encountered a problem :(
          </p>
        </div>
      );
    }

    if (callObject && (showHairCheck || showCall)) {
      return (
        <DailyProvider callObject={callObject}>
          {showHairCheck ? (
            <HairCheck joinCall={joinCall} cancelCall={startLeavingCall} />
          ) : (
            <Flex flexDirection={'column'} justifyContent={'space-between'}>
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