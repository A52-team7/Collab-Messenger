import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { AvatarChatsInterface } from "../GroupChatAvatar/GroupChatAvatar";

const SingleChatAvatar = ({ channel, seenState, title, activeBtn }: AvatarChatsInterface) => {
  return (
    <Flex
      w={'100%'}
      p={'1px'}
      alignItems={'center'}
      bg={activeBtn === channel.id ? 'teal.600' : 'none'}
      border={'1px solid'}
      borderColor={'rgb(187,125,217)'}
      borderRadius={'25px 5px 5px 25px'}
      _hover={{ cursor: "pointer", bg: 'teal.600' }}>
      <Avatar mr={-4} size={'sm'} name={channel.title} src='https://bit.ly/broken-link' />
      <Flex
        w={'100%'}
        alignItems={'center'}
        alignSelf="stretch"
      >
        <Box ml={7}>
          <Text
            color={'white'}
            bg={seenState === true || seenState === null ? 'green' : 'red'}
            fontWeight={seenState === true || seenState === null ? '' : 'bold'}
          >
            {title}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default SingleChatAvatar;