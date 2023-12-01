import { Text } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";

const MyChat = ({ channel }: { channel: Channel }) => {

    const navigate = useNavigate();

    const onOpenChat = () => {
        navigate('/chat', { state: { channelId: channel.id } });
    }
    return (
        <Text _hover={{ cursor: "pointer" }} bg={'gray'} w={'100%'} onClick={onOpenChat}>{channel.title}</Text>
    )
}

export default MyChat