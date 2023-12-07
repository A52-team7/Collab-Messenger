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
    Text
  } from '@chakra-ui/react'
import AppContext from '../../context/AppContext.tsx';
import { useState, useEffect, useContext, useRef } from 'react';
import {getChannelById} from '../../services/channels.service.ts'
//import {getMessagesByChannel} from '../../services/messages.ts'
import  { Message } from '../MessagesList/MessagesList.tsx';
import {User} from '../SearchUsers/SearchUsers.tsx';
import {getAllUsersData} from '../../services/users.service.ts'
import { Channel } from '../MyChatsSideNavBar/MyChatsSideNavBar.tsx';

interface Messages {
    messages: Message[]
    channelId: string
}

const SearchMessage = ({messages,channelId} : Messages) => {
    const { userData } = useContext(AppContext);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [search,setSearch] = useState<string>('')
    //const [members,setMembers] = useState<string[]>([])
    const [initialData, setInitialData] = useState<User[]>([])
    const [userSearch, setUserSearch] = useState<User[]>([])
    const [messageSearch, setSearchMessage] = useState<Message[]>([])

    console.log(messages)
    //const btnRef = useRef()
    useEffect(() => {
        getChannelById(channelId)
        .then((channel : Channel) => {
          return Object.keys(channel.members)
        })
        .then((members: string[]) =>{
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

    const searchValueFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const findUser = (value: string) =>{
        if (!value) return;
    const trimmedSearchValue = value.trim().toLocaleLowerCase();
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
    setUserSearch(sortedFilteredUsers);
    }

    const SearchMassageAndUser =(e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
          if(search.includes('@')){
          const [searchValue, searchUser] = search.split('@')
          findUser(searchUser)

          const messageFilterByUser = messages
          .filter((message) => userSearch.find((user) => user.handle === message.author) !== undefined)
          .filter((message) => message.content.includes(searchValue.trim()) ===true)
          console.log(messageFilterByUser)
          setSearchMessage(messageFilterByUser)
          console.log(messageSearch)

          } else{
            const messageFilterByText = messages.filter((message) => message.content.includes(search))
            setSearchMessage(messageFilterByText)
          }
}}



return (
    <>
    <Button  colorScheme='teal' onClick={onOpen}>
        Open
      </Button>
      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Find message</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Search here...' 
            onKeyDown={SearchMassageAndUser}
            onChange={searchValueFunc}
            />  

            {messageSearch.map(message => (<Text key={message.id}>{message.content}</Text>))}
            
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
//     <Box 
//     //w={ base: '90%', md: '300px', lg: '480px' }
//       onFocus={() => setOpen(true)}
//       onBlur={(e) => {
//         if (!e.currentTarget.contains(e.relatedTarget)) {
//           setOpen(false);
//         }
//       }}
//       position={'relative'}
//     >
//       <Input pr={10} bg={'rgb(237,254,253)'}
//         placeholder={'Search by username / names / email'}
//         _placeholder={{ color: 'gray.500' }}
//         rounded="md"
//         value={searchValue}
//         onChange={(e) => searchAllUsers(e.target.value)}
//       />
//       {
//         open && <Box
//           position={'absolute'}
//           h={'fit-content'}
//           w={'inherit'}
//           maxH={'200px'}
//           bg={searchType === ADD_USERS ? 'gray.300' : 'gray.100'}
//           overflowY={'scroll'}
//           tabIndex={-1}
//           zIndex={99}
//           cursor={'pointer'}
//           css={{
//             '&::-webkit-scrollbar': {
//               display: 'none',
//             },
//             'msOverflowStyle': 'none',  /* IE and Edge */
//             'scrollbarWidth': 'none',  /* Firefox */
//           }}
//         >
//           {searchValue.length > 0 &&
//             filteredResults?.map((user) => <SearchUsersBox
//               key={user.handle}
//               userName={user.handle}
//               email={user.email}
//               firstName={user.firstName}
//               lastName={user.lastName}
//               searchType={searchType}
//               setOpen={setOpen}
//               setSearchValue={setSearchValue}
//               updateNewMember={updateNewMember}
//             />)}
//         </Box>
//       }
//     </Box>
  );
};

export default SearchMessage;