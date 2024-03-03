import { Heading, Box, UnorderedList, ListItem } from '@chakra-ui/react';
import { useMeetingState, useNetwork, useParticipantIds, useRoom } from '@daily-co/daily-react';
import './MeetingInformation.css';

export default function MeetingInformation() {
  const room = useRoom();
  const network = useNetwork();
  const allParticipants = useParticipantIds();
  const meetingState = useMeetingState();

  return (
    <Box className="meeting-information">
      <Heading>Meeting information</Heading>
      <UnorderedList>
        <ListItem>Meeting state: {meetingState ?? 'unknown'}</ListItem>
        <ListItem>Meeting ID: {room?.id ?? 'unknown'}</ListItem>
        <ListItem>Room name: {room?.name ?? 'unknown'}</ListItem>
        <ListItem>Network status: {network?.threshold ?? 'unknown'}</ListItem>
        <ListItem>Network topology: {network?.topology ?? 'unknown'}</ListItem>
        <ListItem>Participant IDs: {allParticipants.join(', ')}</ListItem>
      </UnorderedList>
    </Box>
  );
}
