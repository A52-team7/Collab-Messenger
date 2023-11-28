import { Box, Stack, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";
import { useRef, useEffect } from 'react';


interface UserListProps {
    members: string[];
    channelId?: string,
    teamId?: string,
    removeChannelMembers?: (value: string) => void;
}

const UsersList = ({members, channelId, teamId, removeChannelMembers}: UserListProps): JSX.Element => {    
    const bottomRef = useRef<Element | null>(null);

    console.log(members);
    

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
                    {channelId && (
                         <UserTag handle={member} channelId={channelId} removeChannelMembers={removeChannelMembers}/>
                    )}
                    {teamId && (
                        <UserTag handle={member} teamId={teamId} removeChannelMembers={removeChannelMembers}/>
                    )}
                    {!channelId && !teamId && (
                        <UserTag handle={member} channelId={channelId} removeChannelMembers={removeChannelMembers}/>
                    )}
                   
                </Box>
            ))}
            </UnorderedList>
            <Stack ref={bottomRef}/>
        </>
    );
}

export default UsersList;