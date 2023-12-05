import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";

const SingleChatAvatar = ({ channel, seenState, title }: { channel: Channel, seenState: boolean | null, title: string }) => {
  return (
    <Flex
      w={'100%'}
      alignItems={'center'}
      border={'1px solid'}
      borderColor={'black'}
      borderRadius={'25px 5px 5px 25px'}
      _hover={{ cursor: "pointer", bg: 'gray.800' }}>
      <Avatar mr={-4} size={'sm'} name={channel.title} src='https://bit.ly/broken-link' />
      <Flex
        w={'100%'}
        alignItems={'center'}
        alignSelf="stretch"
      >
        <Box ml={7}>
          <Text
            color={'white'}
            fontSize={seenState === true || seenState === null ? '' : 'bold'}
          >
            {title}
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default SingleChatAvatar;