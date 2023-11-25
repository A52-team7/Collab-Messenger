import { Box, UnorderedList } from "@chakra-ui/react";
import MyChat from "../MyChat/MyChat";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";

interface ChannelsListProps{
    channels: Channel[];
}

const MyChatsList = ({channels}: ChannelsListProps): JSX.Element => {
    return(
        <>
            <UnorderedList styleType = 'none' w={'100%'}>
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