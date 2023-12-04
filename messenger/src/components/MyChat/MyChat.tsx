import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";
import { setChannelToSeen, getChannelSeenLive, getChannelTitleLive } from "../../services/channels.service";
import SingleChatAvatar from "../SingleChatAvatar/SingleChatAvatar";

const MyChat = ({ channel }: { channel: Channel }) => {
  const { userData } = useContext(AppContext);
  const [seenState, setSeenState] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  const onOpenChat = () => {
    navigate(`/chat/${channel.id}`);
    if (userData)
      setChannelToSeen(channel.id, userData?.handle);
  }
  useEffect(() => {
    if (!userData) return;
    getChannelSeenLive(channel.id, userData?.handle, ((userHasSeen) => {
      userHasSeen ? setSeenState(true) : setSeenState(false);
    }));
  }, []);

  useEffect(() => {
  getChannelTitleLive(channel.id, (data: string) => {
    return setTitle(data);
  })
  }, [])
  
  return (
    <Text
      _hover={{ cursor: "pointer" }}
      color={seenState === true || seenState === null ? 'green' : 'red'}
      bg={'gray'}
      w={'100%'}
      onClick={onOpenChat}>
      {title} ({seenState === true || seenState === null ? 'seen' : 'not seen'})
    </Text>
  )
}

export default MyChat;