import { Box, Flex, Text } from "@chakra-ui/react";
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { Message } from "../MessagesList/MessagesList";


const OneMessage = (message: Message) => {

    const {userData} = useContext(AppContext);
    if(userData === null) return;
    const flexAlignment = message.author===userData.handle ? 'flex-end' : 'flex-start';
    
return(
    <Flex direction={'column'} justifyContent={flexAlignment}>
        <Flex>
            <Text pl='7px' pr='7px' mr='10px'  rounded='md' bg='teal.400'>{message.author}</Text>
            <Text>{message.createdOn.toLocaleString()}</Text>
        </Flex>        
        <Box
          pt='10px'
          pb='10px'
          pl='20px'
          pr='20px'
          w={'fit-content'}
          color='white'
          mb='4'
          bg='teal.500'
          rounded='md'
          shadow='md'
        >
          {message.content}
        </Box>
    </Flex>
    
)
}

export default OneMessage;