import { Button, Flex, Image, Stack, Text, Textarea, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import EmojiPopover from "../EmojiPopover/EmojiPopover";
import AppContext from "../../context/AppContext";
import { addReply, addReplyToMessage } from "../../services/messages";
import { REPLY } from "../../common/constants";
import { channelMessage, setAllInChannelToUnseen } from "../../services/channels.service";
import { setAllUsersUnseen, userMessage } from "../../services/users.service";
import { Message } from "../MessagesList/MessagesList";
import SendButton from "../SendButton/SendButton";
import SendImagePopover from "../SendImagePopover/SendImagePopover";
import { AiOutlineDelete } from "react-icons/ai";
import { Team } from "../CreateTeam/CreateTeam";
import { FirebaseStorage, StorageReference, getDownloadURL, getStorage, uploadBytes, ref } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export interface ReplyProps {
    channelId: string;
    messageToReply: Message;
    team?: Team;
    members: string[];
    setReplyIsVisible: (bool:boolean) => void;
}

const Reply = ({channelId, messageToReply, team, members, setReplyIsVisible} : ReplyProps) => {

  const {userData} = useContext(AppContext);
  const [newMessage, setNewMessage] = useState<string>('');

  const [emoji, setEmoji] = useState<string>('');

  const [image, setImage] = useState<string | ArrayBuffer>('');
  const [imageSrc, setImageSrc] = useState<File | null>(null);

  useEffect(() => {
    if(emoji){
      setNewMessage(newMessage => newMessage+ emoji.native);
    }
  }, [emoji]);

  const uploadImageToFBAndSendAMessage = (): Promise<void> | void => {
    if (imageSrc) {
      return new Promise((resolve, reject) => {
        const storage: FirebaseStorage = getStorage();
        const fileId = uuidv4();
        const folderPath: string = `${channelId}/${fileId}`;
        const storageRef: StorageReference = ref(storage, folderPath);
        uploadBytes(storageRef, imageSrc)
          .then(() => {
            const storageRef: StorageReference = ref(storage, folderPath);
            return storageRef;
          })
          .then(storageRef => {
            const url: Promise<string> = getDownloadURL(storageRef);
            return url;
          })
          .then(url => {
            if (channelId && userData) {
              addReply(url, userData.handle, channelId, messageToReply.id, false, REPLY)
                .then(result => {
                  addReplyToMessage(messageToReply.id, result.id);
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);
                  setAllInChannelToUnseen(channelId, userData.handle);
                })
                .then(() => {
                  if (userData) {
                    if (team) {
                      setAllUsersUnseen(members, userData.handle, 'teams');
                    } else {
                      setAllUsersUnseen(members, userData.handle, 'chats');
                    }
                  }
                })
                .then(() => {
                  setImageSrc(null);
                })
                .catch(e => console.error(e));
            }
            resolve();
          })
          .catch((err: Error) => {
            console.error(err);
            return reject(err);
          });
      });
    }
  };

    const handleKeyDownForMessage = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(userData === null) return;
        if (event.key === 'Enter') {
            const message = (event.target as HTMLInputElement).value.trim();
            if (!message && !imageSrc) {
              return alert(`Enter message first`)
            } 
            if (imageSrc) {
              uploadImageToFBAndSendAMessage();
            } else {
              addReply(message, userData.handle, channelId, messageToReply.id, false, REPLY)
              .then(result => {
                  addReplyToMessage(messageToReply.id, result.id);
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);   
                  setAllInChannelToUnseen(channelId, userData.handle);       
              })
              .then(() => {
                if (userData) {
                  if (team) {
                    setAllUsersUnseen(members, userData.handle, 'teams');
                  } else {
                    setAllUsersUnseen(members, userData.handle, 'chats');
                  }
                }
              })
              .catch(e =>console.error(e));
              (event.target as HTMLTextAreaElement).value = '';
              setNewMessage('');
              setReplyIsVisible(false);
            }
          }
      }
    
      const updateNewMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
      }
    
      const onSendMessage = () => {
        if(userData === null) return;
        if (!newMessage && !imageSrc) {
          return alert(`Enter message first`)
        }
        if (imageSrc) {
          uploadImageToFBAndSendAMessage();
        } else {
        addReply(newMessage, userData.handle, channelId, messageToReply.id, false, REPLY)
              .then(result => {
                addReplyToMessage(messageToReply.id, result.id);
                  channelMessage(channelId, result.id);
                  userMessage(result.id, userData.handle);   
                  setAllInChannelToUnseen(channelId, userData.handle);       
              })
              .then(() => {
                if (userData) {
                  if (team) {
                    setAllUsersUnseen(members, userData.handle, 'teams');
                  } else {
                    setAllUsersUnseen(members, userData.handle, 'chats');
                  }
                }
              })
              .catch(e =>console.error(e));
        setNewMessage('');
        setReplyIsVisible(false);
         }
      }

      const onGetEmoji = (emoji: string) => {
        setEmoji(emoji);
      }

      const onCloseReply = () => {
        setReplyIsVisible(false);
      }

      const removeFilePhoto = () => {
        setImageSrc(null);
      }


    return(
        <Stack
        h={'100px'}
        rounded={'xl'}
        w={'60vw'}
        spacing={8}
        align={'center'}
        position={'fixed'}
        bottom={'0'}
        >
        <Flex maxW={'80%'}  mt={'-41px'} bg={'grey'} rounded={'xl'} pl={5} pr={3}>
            <Text alignContent={'center'} noOfLines={1}> Reply to: {messageToReply.content}</Text>
            <Button bg={'teal'} rounded={20} ml={3} size={'xs'} onClick={onCloseReply}>X</Button>
        </Flex>
        {imageSrc && <Flex
              position="fixed"
              zIndex="9999"
              p={20}
              pr={5}
              backgroundColor="rgba(0, 0, 0, 0.9)"
              mt={'-300px'}
              w={'fit-content'}
              h={'300px'}
            >
              <Image src={image} h={'300px'} mt={'-80px'} />
              <Flex ml={2} mt={-65} textAlign={'center'} justifyContent={'center'}>
                <Text fontWeight={'bold'} fontSize={'sm'} color={'white'} isTruncated>
                  {imageSrc.name}
                </Text>
                <Tooltip hasArrow label={'Remove file'} bg={'rgb(237,254,253)'} color='black'>
                  <Button
                    bg={'none'}
                    size={'sm'}
                    color={'red'}
                    p={0}
                    _hover={{ opacity: 0.7 }}
                    onClick={removeFilePhoto}
                  >
                    <AiOutlineDelete size={23} />
                  </Button>
                </Tooltip>
              </Flex>
            </Flex>}
        <Stack spacing={4} direction={{ base: 'column', md: 'row' }} w={'full'} h={'7vh'} alignItems={'center'}>
        {channelId && <SendImagePopover setImage={setImage} setImageSrc={setImageSrc} />}
          <Textarea
            placeholder={'Write something...'}
            value={newMessage}
            color={useColorModeValue('gray.800', 'gray.200')}
            bg={'rgb(237,254,253)'}
            rounded={'xl'}
            border={0}
            resize={'none'}
            _focus={{
              bg: useColorModeValue('gray.200', 'gray.800'),
              outline: 'none',
            }}
            white-space='nowrap'
            overflow-wrap='break-word'
            onKeyDown={handleKeyDownForMessage}
            onChange={updateNewMessage}
          />
          <EmojiPopover onGetEmoji={onGetEmoji}/>
          <SendButton onSendMessage={onSendMessage}/>
        </Stack>
      </Stack>
    )
}

export default Reply;