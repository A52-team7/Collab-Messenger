import { Text } from "@chakra-ui/react"
import { Channel } from "../CreateNewChat/CreateNewChat"
import { useNavigate } from "react-router-dom"

const MyChat = (channel: Channel) => {

    const navigate = useNavigate();

    const onOpenChat = () => {
        navigate('/chat', { state: { channelId: channel.id } });
    }
    return (
        <Text _hover={{ cursor: "pointer" }} onClick={onOpenChat}>{channel.title}</Text>
    )
}

export default MyChat