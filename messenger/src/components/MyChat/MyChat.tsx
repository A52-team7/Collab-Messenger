import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { Box, Flex } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";
import { setChannelToSeen, getChannelSeenLive, getChannelTitleLive, getChannelById } from "../../services/channels.service";
import SingleChatAvatar from "../SingleChatAvatar/SingleChatAvatar";
import GroupChatAvatar from "../GroupChatAvatar/GroupChatAvatar";
import RemoveMessageOrChat from "../RemoveMessageOrChat/RemoveMessageOrChat";

interface MyChatProps {
  channel: Channel;
  activeBtn: string
  //title: string
}

const MyChat = ({ channel, activeBtn }: MyChatProps) => {
  const { userData } = useContext(AppContext);
  const [seenState, setSeenState] = useState<boolean | null>(null);
  const [trashVisibility, setTrashVisibility] = useState(true);
  const navigate = useNavigate();
  const [newTitle, setNewTitle] = useState("");

  // console.log(title)
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
    getChannelById(channel.id)
      .then((channel) => {
        if (Object.keys(channel).includes('isBetweenTwo')) {
          const usersInChat = channel.title.split(',');
          const titleToShow = usersInChat.findIndex((user: string) => user !== (userData?.firstName + ' ' + userData?.lastName));
          setNewTitle(usersInChat[titleToShow]);
        }
        else {
          getChannelTitleLive(channel.id, (data: string) => {
            return setNewTitle(data);
          })
        }
      })
  }, []);

  return (
    <Flex position={'relative'} w={'80%'} mt={2} onClick={onOpenChat} onMouseOver={() => setTrashVisibility(false)} onMouseLeave={() => setTrashVisibility(true)}>
      <Box position={'absolute'} left={-6} style={{ opacity: trashVisibility ? 0 : 1, transition: 'opacity 0.5s' }}>
        <RemoveMessageOrChat channelId={channel.id} isFromChat={false} />
      </Box>
      {Object.keys(channel.members).length > 2 ?
        <GroupChatAvatar channel={channel} seenState={seenState} title={newTitle} activeBtn={activeBtn} />
        :
        <SingleChatAvatar channel={channel} seenState={seenState} title={newTitle} activeBtn={activeBtn} />
      }
    </Flex>
  );
}

export default MyChat;