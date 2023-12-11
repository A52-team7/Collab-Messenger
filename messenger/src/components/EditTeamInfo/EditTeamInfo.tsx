import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Center,
  Box,
  Avatar,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import AppContext, { UserState } from '../../context/AppContext';
import { TITLE_NAME_LENGTH_MIN, TITLE_NAME_LENGTH_MAX } from '../../common/constants';
import { getTeamByName, updateTeamName, updateTeamDescription, addMemberToTeam } from '../../services/teams.service'
import { updateUserTeams, userChannel, getUserByHandle } from '../../services/users.service';
import { addMemberToChannel, channelMessage, getChannelById } from '../../services/channels.service';
import SearchUsers from '../SearchUsers/SearchUsers';
import { ADDED, ADD_PERSON, ADMIN, TO, ADD_USERS } from '../../common/constants';
import { Team } from '../CreateTeam/CreateTeam';
import UsersList from '../UsersList/UsersList';
import { getDatabase, ref as dbRef, Database, DatabaseReference, update } from "firebase/database";
import { getDownloadURL, ref, uploadBytes, getStorage, StorageReference, FirebaseStorage } from 'firebase/storage';
import { addMessage } from "../../services/messages";
import { FaCamera } from "react-icons/fa";

const EditTeamInfo = () => {
  const { userData } = useContext<UserState>(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const team = location.state.team;
  const [teamForm, setTeamForm] = useState<Team>({ ...team })
  const fileInput = useRef<HTMLInputElement>(null);
  const [teamPhoto, setTeamPhoto] = useState<File | null>(null)
  const [newMember, setNewMember] = useState<string[]>([])

  const {
    isOpen: isSave,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })

  const updateTeamInfo = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field !== 'members') {
      setTeamForm({
        ...teamForm,
        [field]: e.target.value,
      })
    }
  }

  const updateNewMember = (user: string) => {
    const newMembers = { ...teamForm.members };
    newMembers[user] = true;
    setTeamForm({
      ...teamForm,
      members: newMembers
    })
    setNewMember([...newMember, user])
  }

  const onOpenFileManager = (): void => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const onLocallyUploadImage = (): void => {
    if (fileInput.current && fileInput.current.files) {
      const file: File = fileInput.current.files[0];

      // if (!file.type.startsWith('image/') || file.type !== '') {
      //   return alert('File is not image') 
      // } 
      setTeamPhoto(file);

    }
  };

  const uploadImageToFB = (teamRef: DatabaseReference): Promise<void> | void => {
    if (teamPhoto) {
      return new Promise((resolve, reject) => {
        const storage: FirebaseStorage = getStorage();
        const folderPath: string = `${teamForm?.name}/${teamForm?.name}-teamPhoto`;
        const storageRef: StorageReference = ref(storage, folderPath);
        uploadBytes(storageRef, teamPhoto)
          .then(() => {
            const storageRef: StorageReference = ref(storage, folderPath);
            return storageRef;
          })
          .then(storageRef => {
            const url: Promise<string> = getDownloadURL(storageRef);
            return url;
          })
          .then(url => {
            update(teamRef, { teamPhoto: url });
            setTeamForm({ ...teamForm, teamPhoto: url })
            resolve();
          })
          .catch((err: Error) => {
            return reject(err);
          });
      });
    }
  };

  const saveTeam = () => {
    if (!teamForm.name) {
      return alert(`Enter team name`)
    }
    if (teamForm.name.length < TITLE_NAME_LENGTH_MIN || teamForm.name.length > TITLE_NAME_LENGTH_MAX) {
      return alert(`Team name must be between ${TITLE_NAME_LENGTH_MIN} and ${TITLE_NAME_LENGTH_MAX} characters!`)
    }
    if (Object.keys(teamForm.members).length === 0) {
      return alert(`Enter team members`)
    }
    if (userData === null) return alert('Please login');

    const db: Database = getDatabase();
    const teamRef: DatabaseReference = dbRef(db, `teams/${teamForm.id}`);

    if (teamForm.name !== team.name) {
      getTeamByName(teamForm.name)
        .then(result => {
          if (result.exists()) {
            return alert(`Team name with name ${teamForm.name} already exist!`);
          }
          updateTeamName(teamForm.id, teamForm.name)
        }).catch(e => console.error(e))
    }
    updateTeamDescription(team.id, teamForm.description)
      .then(() => uploadImageToFB(teamRef))
      .then(() => {
        newMember.forEach((member: string) => {
          addMemberToTeam(teamForm.id, member)
            .then(() => addMemberToChannel(teamForm.generalChannel, member))
            .then(() => userChannel(teamForm.generalChannel, member))
            .then(() => updateUserTeams(member, teamForm.id))
            .then(() => {
              getUserByHandle(member)
                .then(res => {
                  const user = res.val()
                  const displayName = user.firstName + ' ' + user.lastName
                  getChannelById(teamForm.generalChannel)
                    .then(channel => {
                      addMessage(userData?.firstName + ' ' + userData?.lastName + ' ' + ADDED + displayName + TO + channel.title, ADMIN, channel.id, true, ADD_PERSON)
                        .then(message => {
                          channelMessage(channel.id, message.id);
                        })
                        .catch(error => console.error(error.message))
                    })
                })


            })
        })
      })
      .then(() => onOpen())
      .catch(e => console.log(e))
  }

  return (
    <Flex
      minH={'fit-content'}
      align={'center'}
      justify={'center'}
      mt={{ base: 2, sm: 5 }} bg={'none'}>
      <Stack
        spacing={4}
        maxW={'fit-content'}
        bg={'grey'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={{ base: 1, sm: 6 }}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }} textAlign={'center'}>
          Edit your team
        </Heading>
        <Flex justifyContent={'space-between'}>
          <Stack direction={['column']} spacing={6} p={10} >
            <Center flexDirection={'column'}>
              <Box position='relative'>
                <Avatar
                  borderRadius='full'
                  boxSize='150px'
                  src={teamForm.teamPhoto}
                />
                <Button
                  position={'absolute'}
                  bottom={0}
                  right={-15}
                  transform={'translateX(-50%)'}
                  p={0}
                  bg={'green.100'}
                  opacity={0.9}
                  _hover={{ bg: 'teal.100' }}
                  border={'1px solid'}
                  borderColor={'teal.200'}
                  color={'teal.500'}
                  onClick={onOpenFileManager}
                >
                  <FaCamera size={30} />
                </Button>
              </Box>
              <Input
                hidden
                type='file'
                ref={fileInput}
                onChange={onLocallyUploadImage}
              />
            </Center>
          </Stack>
          <Stack right={0} top={'-29%'}>
            <FormControl id="userName" isRequired>
              <FormLabel textAlign={'center'}>Team name</FormLabel>
              <Input
                placeholder="Write your team name..."
                _placeholder={{ color: 'gray.500' }}
                type="text"
                bg={'white'}
                rounded="md"
                value={teamForm.name}
                onChange={updateTeamInfo('name')}
              />
            </FormControl>
            <FormControl id="addMembers" isRequired>
              <FormLabel textAlign={'center'}>Add members</FormLabel>
              <SearchUsers updateNewMember={updateNewMember} searchType={ADD_USERS} />
              <Stack h={'15vh'}
                overflowY={'scroll'}
              >
                <UsersList members={Object.keys(teamForm.members)} teamId={teamForm.id} />
              </Stack>
            </FormControl>
            <FormControl id="description">
              <FormLabel textAlign={'center'}>Description</FormLabel>
              <Input
                placeholder="Describe your team or write your motto..."
                _placeholder={{ color: 'gray.500' }}
                type="text"
                bg={'white'}
                rounded="md"
                value={teamForm.description}
                onChange={updateTeamInfo('description')}
              />
            </FormControl>
          </Stack>
        </Flex>
        <Box>
          {isSave &&
            <Alert status={'success'}
              textAlign={'center'}
              w={'fit-content'}
              rounded={'xl'}>
              <AlertIcon />
              <Box>
                <AlertTitle>Team information updated successfully</AlertTitle>
              </Box>
              <CloseButton
                rounded={'xl'}
                onClick={onClose}
              />
            </Alert>}
        </Box>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            w='full'
            border={'2px solid'}
            borderColor={'teal.500'}
            bg={'none'}
            color={'teal.500'}
            _hover={{ opacity: 0.8 }}
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            bg={'teal.500'}
            variant={'primaryButton'}
            w='full'
            _hover={{ opacity: 0.8 }}
            onClick={saveTeam}>
            Save
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )

}

export default EditTeamInfo;