import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import { ReactionItem } from "../../services/messages";
import { useContext } from 'react';
import AppContext from '../../context/AppContext';

export interface ReactionItemProps{
    reaction: ReactionItem;
    onAddReaction: (reaction: string) => void;
    onRemoveReaction: (reaction: string) => void;
}

const ReactionItem = ({reaction, onAddReaction, onRemoveReaction}: ReactionItemProps) => {

    const { userData } = useContext(AppContext);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement="top">
            <PopoverTrigger>
                {reaction && (<Button 
                color={'white'}  
                mr={2} 
                p={1} 
                h={'25px'} 
                onMouseEnter={onOpen} 
                onMouseLeave={onClose}
                onClick={() => 
                    userData && reaction[1].includes(userData.handle) 
                    ? onRemoveReaction(reaction[0])
                    : onAddReaction(reaction[0])
                }
                bg={userData && reaction[1].includes(userData.handle) ? `rgb(40,94,97)` : 'teal.600'}
                border={userData && reaction[1].includes(userData.handle) ? '1px solid white' : 'none'}
                >
                    <Text>{reaction[0]}</Text>
                    <Text>{reaction[1].length}</Text>
                </Button>
                )}
            </PopoverTrigger>
            <PopoverContent w={'fit-content'}>
                <PopoverArrow />
                <PopoverBody>{reaction[0]}: {reaction[1].join(', ')}</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default ReactionItem;