import { Box, UnorderedList } from "@chakra-ui/react";
import { Channel } from "../CreateNewChat/CreateNewChat";
import MyChat from "../MyChat/MyChat";

interface ChannelsListProps{
    channels: Channel[];
}

const MyChatsList = ({channels}: ChannelsListProps): JSX.Element => {
    return(
        <>
            <UnorderedList styleType = 'none' w={'70vw'}>
            {channels.map((channel: Channel) => (
                <Box key={channel.id}>
                    <MyChat {...channel}/>
                </Box>
            ))}
            </UnorderedList>
        </>
    )
}

export default MyChatsList;