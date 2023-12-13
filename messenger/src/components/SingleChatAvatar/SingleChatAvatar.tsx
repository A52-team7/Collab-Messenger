import { Box, Text, Avatar, Flex } from "@chakra-ui/react";
import { AvatarChatsInterface } from "../GroupChatAvatar/GroupChatAvatar";
import { FaExclamationCircle } from "react-icons/fa";

const SingleChatAvatar = ({ channel, seenState, title, activeBtn, imageSrc }: AvatarChatsInterface) => {
  return (
    <Flex
      position={'relative'}
      w={'100%'}
      p={'1px'}
      alignItems={'center'}
      bg={activeBtn === channel.id ? 'teal.600' : 'none'}
      border={'1px solid'}
      borderColor={'rgb(187,125,217)'}
      borderRadius={'25px 5px 5px 25px'}
      _hover={{ cursor: "pointer", bg: 'teal.600' }}>
      <Avatar mr={-4} size={'sm'} name={title} src={imageSrc} />
      <Flex
        w={'100%'}
        alignItems={'center'}
        alignSelf="stretch"
      >
        <Box ml={7}>
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
        </Box>
      </Flex>
    </Flex>
  )
}

export default SingleChatAvatar;