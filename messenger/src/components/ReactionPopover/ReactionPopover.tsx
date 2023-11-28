import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { VscReactions } from "react-icons/vsc";

const ReactionPopover = () => {
    return(
        <Popover>
        <PopoverTrigger>
            <Button p={1} size={'xs'}><VscReactions size={20}/></Button>
        </PopoverTrigger>
        <PopoverContent w={'fit-content'}>
            <PopoverArrow />
            <PopoverBody justifyContent={'center'}>
                <Flex>
                    <Button bg={'none'} p={1} size={'md'}>👍</Button>
                    <Button bg={'none'} p={1} size={'md'}>❤️</Button>
                    <Button bg={'none'} p={1} size={'md'}>😆</Button>
                    <Button bg={'none'} p={1} size={'md'}>😍</Button>
                    <Button bg={'none'} p={1} size={'md'}>😲</Button>
                </Flex>
            </PopoverBody>
        </PopoverContent>
        </Popover>
    )
}

export default ReactionPopover;