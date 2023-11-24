import { Box, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";


interface UserListProps {
    members: string[];
    channelId: string
}

const UsersList = ({members, channelId}: UserListProps): JSX.Element => {    
       
    return (
        <>
            <UnorderedList 
            styleType = 'none' 
            w={'100%'} 
            h={'18vh'}
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
                    <UserTag handle={member} channelId={channelId}/>
                </Box>
            ))}
            </UnorderedList>
        </>
    );
}

export default UsersList;