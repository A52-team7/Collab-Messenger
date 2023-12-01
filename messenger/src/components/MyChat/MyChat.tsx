import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { Text } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";
import { setChannelToSeen, getChannelSeenLive } from "../../services/channels.service";

const MyChat = ({ channel }: { channel: Channel }) => {
  const { userData } = useContext(AppContext);
  const [seenState, setSeenState] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const onOpenChat = () => {
    navigate('/chat', { state: { channelId: channel.id } });
    if (userData)
      setChannelToSeen(channel.id, userData?.handle);
  }
  useEffect(() => {
    if (!userData) return;
    getChannelSeenLive(channel.id, userData?.handle, ((userHasSeen) => {
      userHasSeen ? setSeenState(true) : setSeenState(false);
    }));
  }, []);

  return (
    <Text
      _hover={{ cursor: "pointer" }}
      color={seenState === true || seenState === null ? 'green' : 'red'}
      bg={'gray'}
      w={'100%'}
      onClick={onOpenChat}>
      {channel.title} ({seenState === true || seenState === null ? 'seen' : 'not seen'})
    </Text>
  )
}

export default MyChat