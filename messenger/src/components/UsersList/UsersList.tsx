import { Box, Stack, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";
import { useRef, useEffect } from 'react';


interface UserListProps {
    members: string[];
    id?: string,
    removeChannelMembers?: (value: string) => void;
}

const UsersList = ({members, id, removeChannelMembers}: UserListProps): JSX.Element => {    
    const bottomRef = useRef<Element | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [members]);   

    return (
        <>
            <UnorderedList 
            styleType = 'none' 
            w={'100%'} >
            {members.map((member: string) => (
                <Box key={member}>
                    <UserTag handle={member} id={id} removeChannelMembers={removeChannelMembers}/>
                </Box>
            ))}
            </UnorderedList>
            <Stack ref={bottomRef}/>
        </>
    );
}

export default UsersList;