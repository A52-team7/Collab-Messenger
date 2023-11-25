import { Box, UnorderedList } from "@chakra-ui/react";
import UserTag from "../UserTag/UserTag";


interface UserListProps {
    members: string[];
    id: string
}

const UsersList = ({members, id}: UserListProps): JSX.Element => {    
       
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
                    <UserTag handle={member} id={id}/>
                </Box>
            ))}
            </UnorderedList>
        </>
    );
}

export default UsersList;