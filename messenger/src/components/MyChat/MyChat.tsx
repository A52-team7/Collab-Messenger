import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { Box, Flex } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";
import { setChannelToSeen, getChannelSeenLive, getChannelTitleLive } from "../../services/channels.service";
import SingleChatAvatar from "../SingleChatAvatar/SingleChatAvatar";
import GroupChatAvatar from "../GroupChatAvatar/GroupChatAvatar";
import RemoveMessageOrChat from "../RemoveMessageOrChat/RemoveMessageOrChat";

interface MyChatProps {
  channel: Channel;
  activeBtn: string
}

const MyChat = ({ channel, activeBtn }: MyChatProps) => {
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
    if (!userData) return;
    if (Object.keys(channel).includes('isBetweenTwo')) {
      const usersInChat = channel.title.split(',');
      const titleToShow = usersInChat.findIndex((user: string) => user !== (userData?.firstName + ' ' + userData?.lastName));

      setTitle(usersInChat[titleToShow]);
    }
  }, []);

  useEffect(() => {
    if (!Object.keys(channel).includes('isBetweenTwo')) {
      getChannelTitleLive(channel.id, (data: string) => {
        return setTitle(data);
      })
    }
  }, []);

  return (
    <Flex w={'80%'} mt={2} onClick={onOpenChat}>
      <RemoveMessageOrChat channelId={channel.id} isFromChat={false}/>
      {Object.keys(channel.members).length > 2 ?
        <GroupChatAvatar channel={channel} seenState={seenState} title={title} activeBtn={activeBtn} />
        :
        <SingleChatAvatar channel={channel} seenState={seenState} title={title} activeBtn={activeBtn} />
      }
    </Flex>
  );
}

export default MyChat;