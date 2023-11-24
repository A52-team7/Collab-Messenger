import {
    Flex,
    Stack,
    Input,
    Button,
    useColorModeValue,
  } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserByHandle, userChannel} from '../../services/users.service';
import { addMemberToChannel, addTitleToChannel } from '../../services/channels.service';
import { useState } from 'react';
  
  
  
  const NewChat = (): JSX.Element => {
    
  const location = useLocation();

  const channelId = location.state?.channelId;

  const navigate = useNavigate();
 
  const [newTitle, setNewTitle] = useState('');
  const [newUser, setNewUser] = useState('');

  
  const handleKeyDownForTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const title = (event.target as HTMLInputElement).value.trim();
      if (title) {
        addTitleToChannel(channelId, title);
        (event.target as HTMLInputElement).value = '';
        setNewTitle('');
      }
    }
  };

  const handleKeyDownForUser = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const userHandle = (event.target as HTMLInputElement).value.trim();
      if (userHandle) {
        getUserByHandle(userHandle)
        .then(result => {
            userChannel(channelId, result.val().handle);
            addMemberToChannel(channelId, result.val().handle);            
        })
        .catch(e =>console.error(e));
        (event.target as HTMLInputElement).value = '';
        setNewUser('');
      }
    }
  };


  const onVisible = () => {
    navigate('/chat', { state: { channelId: channelId } });
  }

  const updateNewTitle= (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value)
  }

  const updateNewUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser(e.target.value)
  }


  const onAddTitle = () => {
    addTitleToChannel(channelId, newTitle);
    setNewTitle('');
  }

  const onAddUser = () => {
    getUserByHandle(newUser)
        .then(result => {
            userChannel(channelId, result.val().handle);
            addMemberToChannel(channelId, result.val().handle);            
        })
        .catch(e =>console.error(e));
    setNewUser('');
  }


      return (
          <Flex
            align={'center'}
            direction={'column'}
            justify={'center'}
            py={12}>
              <Flex 
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              pt='5'
              pb='5'
              pl='10'
              pr='10'
              align={'center'}>
              <Input
                  bg={'grey'}
                  placeholder="Add title"
                  value={newTitle}
                  onKeyDown={handleKeyDownForTitle} 
                  onChange={updateNewTitle}/>
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onAddTitle}>
                  Add
                </Button>
              </Flex>
              
            <Flex 
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              align={'center'}>
              <Input
                  bg={'grey'}
                  placeholder="Search for Users"
                  value={newUser}
                  onKeyDown={handleKeyDownForUser}
                  onChange={updateNewUser} />
              <Button
                  ml={5}
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  w={'fit-content'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}
                  onClick={onAddUser}>
                  Add
                </Button>
            </Flex>
            <Stack>
                     
            </Stack>
            <Stack
              boxShadow={'2xl'}
              bg={useColorModeValue('white', 'gray.700')}
              rounded={'xl'}
              w={'60vw'}
              p={10}
              spacing={8}
              align={'center'}
              position= {'fixed'}
              bottom= {'0'}>
              <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'}>
                <Input
                  type={'text'}
                  placeholder={'Write something...'}
                  color={useColorModeValue('gray.800', 'gray.200')}
                  bg={useColorModeValue('gray.100', 'gray.600')}
                  rounded={'full'}
                  border={0}
                  _focus={{
                    bg: useColorModeValue('gray.200', 'gray.800'),
                    outline: 'none',
                  }}
                  onClick={onVisible}
                />
                <Button
                  bg={'blue'}
                  rounded={'full'}
                  color={'white'}
                  flex={'1 0 auto'}
                  _hover={{ bg: 'blue.500' }}
                  _focus={{ bg: 'blue.500' }}>
                  Send
                </Button>
              </Stack>
            </Stack>
          </Flex>
        )
  }
  
  export default NewChat;