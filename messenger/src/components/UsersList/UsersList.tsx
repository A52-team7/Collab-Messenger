import { Box, Stack, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";
import { useRef, useEffect } from 'react';


interface UserListProps {
    members: string[];
    channelId?: string,
    teamId?: string,
    removeChannelMembers?: (value: string) => void;
    removeTeamMembers?: (value: string) => void;
}

const UsersList = ({members, channelId, teamId, removeChannelMembers, removeTeamMembers}: UserListProps): JSX.Element => {    
    const bottomRef = useRef<HTMLDivElement | null>(null);
    

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
      }, [members]);   

    return (
        <>
            <UnorderedList 
            styleType = 'none' 
            w={'80%'} >
            {members.map((member: string) => (
                <Box key={member}>
                    {channelId && (
                         <UserTag handle={member} channelId={channelId} removeChannelMembers={removeChannelMembers}/>
                    )}
                    {teamId && (
                        <UserTag handle={member} teamId={teamId} removeChannelMembers={removeTeamMembers}/>
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