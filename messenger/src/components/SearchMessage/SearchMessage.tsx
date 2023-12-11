import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  useDisclosure,
  Text,
  Flex,
  Box,
  VStack
} from '@chakra-ui/react'
import AppContext from '../../context/AppContext.tsx';
import { useState, useEffect, useContext, useRef } from 'react';
import { getChannelById } from '../../services/channels.service.ts'
import { Message } from '../MessagesList/MessagesList.tsx';
import { User } from '../SearchUsers/SearchUsers.tsx';
import { getAllUsersData } from '../../services/users.service.ts'
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar.tsx';
import { MdContentPasteSearch } from "react-icons/md";
import SearchOneMessage from '../SearchOneMessage/SearchOneMessage';


interface Messages {
  messages: Message[]
  channelId: string
}

const SearchMessage = ({ messages, channelId }: Messages) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [initialData, setInitialData] = useState<User[]>([])
  const [messageSearch, setSearchMessage] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null);

  //const btnRef = useRef()
  useEffect(() => {
    getChannelById(channelId)
      .then((channel: Channel) => {
        return Object.keys(channel.members)
      })
      .then((members: string[]) => {
        getAllUsersData()
          .then(data => {
            const snapshot: User[] = Object.values(data.val());
            const filterUserByChannel = snapshot.filter((user) => {
              if (members.includes(user.handle)) {
                return user
              }
            });

            setInitialData(filterUserByChannel);
          })
          .catch((err: Error) => console.error(err));
      }
      )
  }, [])

  const searchMassageAndUser = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputRef.current === null) return;
    if (e.key === "Enter") {

      if (inputRef.current.value.includes('@')) {
        const [searchValue, searchUser] = inputRef.current.value.split('@')

        if (!searchUser) return;
        const trimmedSearchValue = searchUser.trim().toLocaleLowerCase();
        const filteredUsers = initialData.filter(user => {
          const username = user.handle.toLowerCase();
          const email = user.email.toLowerCase();
          const firstName = user.firstName.toLowerCase();
          const lastName = user.lastName.toLowerCase();
          const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

          if (firstName.startsWith(trimmedSearchValue)) return user;
          if (lastName.startsWith(trimmedSearchValue)) return user;
          if (username.startsWith(trimmedSearchValue)) return user;
          if (email.startsWith(trimmedSearchValue)) return user;
          if (fullName.startsWith(trimmedSearchValue)) return user;
        });
        const sortedFilteredUsers = filteredUsers.sort((a, b) => {
          const aFirstNameContainsString = a.firstName.toLowerCase().includes(trimmedSearchValue);
          const aLastNameContainsString = a.lastName.toLowerCase().includes(trimmedSearchValue);
          const bFirstNameContainsString = b.firstName.toLowerCase().includes(trimmedSearchValue);
          const bLastNameContainsString = b.lastName.toLowerCase().includes(trimmedSearchValue);

          if (aFirstNameContainsString && !bFirstNameContainsString) {
            return -1;
          } else if (!aFirstNameContainsString && bFirstNameContainsString) {
            return 1;
          } else if (aLastNameContainsString && !bLastNameContainsString) {
            return -1;
          } else if (!aLastNameContainsString && bLastNameContainsString) {
            return 1;
          } else {
            return 0;
          }
        });
        const messageFilterByUser = messages.filter((message) => sortedFilteredUsers.find((user) => user.handle === message.author) !== undefined)
          .filter((message) => message.content.includes(searchValue.trim()) === true)

        setSearchMessage([...messageFilterByUser])
      } else {
        const messageFilterByText = messages.filter((message) => message.content.includes(inputRef.current.value))
        setSearchMessage(messageFilterByText)
      }
    }
  }



  return (
    <>
      <Button
        variant='unstyled'
        color={'white'}
        onClick={onOpen}
        _hover={{ opacity: '0.8' }}
        leftIcon={<MdContentPasteSearch />}>
        Search Message
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent bg={"RGB(59, 59, 59)"} minW={'400px'}>
          <DrawerCloseButton />
          <DrawerHeader color={'white'} textAlign="center" >Find message</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Search here...'
              ref={inputRef}
              bg={'white'}
              onKeyDown={searchMassageAndUser}
            //onChange={searchValueFunc}
            />
            <Flex mt={'20px'} >
              <VStack>
                {messageSearch.length > 0 ? messageSearch.map(message => (
                  <Box key={message.id}
                    border={'1px solid rgb(187,125,217)'}
                    p={4}
                    minW={'100%'}
                  >
                    <SearchOneMessage message={message} />
                  </Box>)) : <Text color={'white'}>Not found message</Text>
                }
              </VStack>
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button
              variant='outline'
              mr={3}
              color={'teal.500'}
              borderColor={'teal.500'}
              bg={'none'}
              _hover={{ opacity: 0.8 }}
              onClick={onClose} >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SearchMessage;