import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Text, useDisclosure } from "@chakra-ui/react";
import { ReactionItem } from "../../services/messages";
import { useContext, useState, useEffect } from 'react';
import AppContext from '../../context/AppContext';
import { getUserByHandle } from "../../services/users.service";

export interface ReactionItemProps{
    reaction: ReactionItem;
    onAddReaction: (reaction: string) => void;
    onRemoveReaction: (reaction: string) => void;
    isOnUserMessage: boolean;
}

const ReactionItem = ({reaction, onAddReaction, onRemoveReaction, isOnUserMessage}: ReactionItemProps) => {

    const { userData } = useContext(AppContext);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [reactedUsers, setReactedUsers] = useState<string[]>([]);

    useEffect(() => {
        Promise.all(
            reaction[1].map((user) => {
              return getUserByHandle(user)
                .then(res => res.val().firstName + ' ' + res.val().lastName)
                .catch(e => console.error(e));
            })
          ).then(users => {
              setReactedUsers([...users]);
          })
          .catch(e => console.error(e));
    }, [reaction]);    

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
                bg={isOnUserMessage ? (userData && reaction[1].includes(userData.handle) ? 'rgb(69 59 80)' : 'rgb(88 76 103)') : (userData && reaction[1].includes(userData.handle) ? `rgb(40,94,97)` : 'teal.600')}
                border={userData && reaction[1].includes(userData.handle) ? '1px solid white' : 'none'}
                >
                    <Text>{reaction[0]}</Text>
                    <Text>{reaction[1].length}</Text>
                </Button>
                )}
            </PopoverTrigger>
            <PopoverContent w={'250px'}>
                <PopoverArrow />
                <PopoverBody bg={'rgb(237,254,253)'}>{reaction[0]}: {reactedUsers.join(', ')}</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}

export default ReactionItem;