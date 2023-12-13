import { Box, Text, Avatar, AvatarGroup, Flex, Tooltip } from "@chakra-ui/react";
import { Channel } from "../MyChatsSideNavBar/MyChatsSideNavBar";
import { FaExclamationCircle } from "react-icons/fa";


export interface AvatarChatsInterface {
  channel: Channel;
  seenState: boolean | null, title: string;
  activeBtn: string;
}

const GroupChatAvatar = ({ channel, seenState, title, activeBtn }: AvatarChatsInterface) => {
  const members = Object.keys(channel.members);

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
      <Tooltip hasArrow label={members.join(', ')} bg={'rgb(237,254,253)'} color='black'>
        <AvatarGroup size='sm' max={3}>
          {members.map((member) => <Avatar key={member + channel.id} border={'none'} mr={-4} size={'sm'} name={member} src='https://bit.ly/broken-link' />)}
        </AvatarGroup>
      </Tooltip>
      <Flex
        w={'100%'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Flex position={'relative'} w={'100%'} justifyContent={'space-between'} alignItems={'center'} ml={1}
          textAlign={'center'}>
          <Text
            color={'white'}
            fontWeight={seenState === true || seenState === null ? '' : 'bold'}
          >
            {title}
          </Text>
          {seenState === false && <Box
            position={'absolute'}
            top={'-6px'}
            right={'-7px'}
          >
            <FaExclamationCircle size={20} color={'yellow'} />
          </Box>}
        </Flex>
      </Flex>
    </Flex>
  )
}

export default GroupChatAvatar;