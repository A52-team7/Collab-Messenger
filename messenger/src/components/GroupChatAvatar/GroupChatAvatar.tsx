import { Box, Text, Avatar, AvatarGroup, Flex, Tooltip } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";

const GroupChatAvatar = ({ channel, seenState, title }: { channel: Channel, seenState: boolean | null, title: string }) => {
  const members = Object.keys(channel.members);

  return (
    <Flex
      w={'100%'}
      p={'1px'}
      alignItems={'center'}
      border={'1px solid'}
      borderColor={'rgb(187,125,217)'}
      borderRadius={'25px 5px 5px 25px'}
      _hover={{ cursor: "pointer", bg: 'gray.800' }}>
      <Tooltip hasArrow label={members.join(', ')} bg={'rgb(237,254,253)'} color='black'>
        <AvatarGroup size='sm' max={3}>
          {members.map((member) => <Avatar border={'none'} mr={-4} size={'sm'} name={member} src='https://bit.ly/broken-link' />)}
        </AvatarGroup>
      </Tooltip>
      <Flex
        w={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box ml={1}
          textAlign={'center'}>
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

export default GroupChatAvatar;