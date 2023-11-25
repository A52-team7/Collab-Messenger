import { Box, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";


interface UserListProps {
    members: string[];
    id?: string,
    removeChannelMembers?: (value: string) => void;
}

const UsersList = ({members, id, removeChannelMembers}: UserListProps): JSX.Element => {    
       
    return (
        <>
            <UnorderedList 
            styleType = 'none' 
            w={'100%'} 
            h={'31vh'}
            overflowY={'scroll'}
            css={{
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              'msOverflowStyle': 'none',  /* IE and Edge */
              'scrollbarWidth': 'none',  /* Firefox */
            }}>
            {members.map((member: string) => (
                <Box key={member}>
                    <UserTag handle={member} id={id} removeChannelMembers={removeChannelMembers}/>
                </Box>
            ))}
            </UnorderedList>
        </>
    );
}

export default UsersList;