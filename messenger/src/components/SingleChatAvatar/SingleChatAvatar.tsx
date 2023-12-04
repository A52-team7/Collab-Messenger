import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";

const SingleChatAvatar = ({ channel, seenState }: { channel: Channel, seenState: boolean | null }) => {
  return (
    <Flex
      w={'100%'}
      alignItems={'center'}
      _hover={{ cursor: "pointer" }}>
      <Avatar mr={-7} size={'sm'} name={channel.title} src='https://bit.ly/broken-link' />
      <Flex
        w={'100%'}
        alignItems={'center'}
        bg={'rgb(238,242,247)'}
        opacity={0.5}
        zIndex={-1}
        alignSelf="stretch"
        borderRadius={'0 5px 5px 0'}
      >
        <Box ml={9}>
          <Text
            color={seenState === true || seenState === null ? 'green' : 'red'}
          >
            {channel.title} ({seenState === true || seenState === null ? 'seen' : 'not seen'})
          </Text>
        </Box>
      </Flex>
    </Flex>
  )
}

export default SingleChatAvatar;