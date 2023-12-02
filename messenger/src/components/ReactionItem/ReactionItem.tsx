import { Button, Text } from "@chakra-ui/react";
import { ReactionItem } from "../../services/messages";

export interface ReactionItemProps{
    reaction: ReactionItem;
    onAddReaction: (reaction: string) => void;
}

const ReactionItem = ({reaction, onAddReaction}: ReactionItemProps) => {
    return (
        <Button bg={'none'} color={'white'} mr={2} p={1} onClick={() => onAddReaction(reaction[0])}>
            <Text>{reaction[0]}</Text>
            <Text>{reaction[1].length}</Text>
        </Button>
    )
}

export default ReactionItem;