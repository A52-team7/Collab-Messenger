import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button, Flex, FormControl, FormLabel, Heading,
  Input, Stack, Avatar, Center, Box, AlertTitle,
  FormErrorMessage, Text, useDisclosure, Alert, AlertIcon, CloseButton
} from '@chakra-ui/react';
import AppContext from '../../context/AppContext';
import { getDatabase, ref as dbRef, Database, DatabaseReference, update } from "firebase/database";
import { getDownloadURL, ref, uploadBytes, getStorage, StorageReference, FirebaseStorage } from 'firebase/storage';
import { getUserData } from '../../services/users.service';
import { loginUser, updateUserPassword } from '../../services/auth.service';
import {
  MSG_NAMES_LENGTH, NAMES_LENGTH_MAX,
  NAMES_LENGTH_MIN,
  PASSWORD_LENGTH_MIN,
  PHONE_NUMBER_LENGTH_MAX,
  MSG_PASSWORD_NOT_MATCH,
  MSG_PASSWORD_LENGTH,
  MSG_INVALID_IMAGE_FORMAT
} from '../../common/constants';
import { FaCamera } from "react-icons/fa";

interface formErrorsInitialStateInterface {
  error: boolean;
  fieldErr: boolean;
  firstNameLengthErr: boolean;
  lastNameLengthErr: boolean;
  phoneLengthErr: boolean;
  passwordLengthErr: boolean;
  passwordMatchErr: boolean;
  invalidImageFormat: boolean;
}

const formErrorsInitialState: formErrorsInitialStateInterface = {
  error: false,
  fieldErr: false,
  firstNameLengthErr: false,
  lastNameLengthErr: false,
  phoneLengthErr: false,
  passwordLengthErr: false,
  passwordMatchErr: false,
  invalidImageFormat: false,
}

const UserDetails = (): JSX.Element => {
  const { userData, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    phoneNumber: userData?.phoneNumber,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({ ...formErrorsInitialState });
  const [profilePhotoSrc, setProfilePhotoSrc] = useState<File | null>(null);
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const [submitChange, setSubmitChange] = useState(false);
  const [formSubmissionLoading, setFormSubmissionLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const onNavigate = () => {
    navigate(-1);
  }

  const {
    isOpen: isVisible,
    onClose,
    onOpen,
  } = useDisclosure({ defaultIsOpen: false })

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>): void => {
    setHasFormChanged(true);
    if (field === 'firstName') setFormErrors({ ...formErrors, firstNameLengthErr: false });
    if (field === 'lastName') setFormErrors({ ...formErrors, lastNameLengthErr: false });
    if (field === 'password') setFormErrors({ ...formErrors, passwordLengthErr: false });
    if (field === 'confirmPassword') setFormErrors({ ...formErrors, passwordMatchErr: false });
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const onOpenFileManager = (): void => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const changePassword = (): void => {
    if (userData && form.password && form.confirmPassword) {
      updateUserPassword(form.password)
        .then(() => {
          loginUser(userData.email, form.password)
            .then(credential => {
              console.log('credentials', credential);

              setContext((prevState) => ({
                ...prevState,
                user: credential.user,
              }));
            })
        }).catch((error) => {
          console.error(error.message);
          setFormSubmissionLoading(true);
        });
    }
  };

  const onLocallyUploadImage = (): void => {
    if (fileInput.current && fileInput.current.files) {
      let errors = { ...formErrors };
      const file: File = fileInput.current.files[0];

      if (file.type.startsWith('image/') || file.type === '') {
        errors = { ...errors, invalidImageFormat: false, error: false }
      } else {
        errors = { ...errors, invalidImageFormat: true, error: true }
        setHasFormChanged(false);
      }
      setFormErrors({ ...errors });
      if (errors.error) return;

      setProfilePhotoSrc(file);
      setHasFormChanged(true);
    }
  };

  const uploadImageToFB = (userRef: DatabaseReference): Promise<void> | void => {
    if (profilePhotoSrc) {
      return new Promise((resolve, reject) => {
        const storage: FirebaseStorage = getStorage();
        const folderPath: string = `${userData?.handle}/${userData?.handle}-profilePhoto`;
        const storageRef: StorageReference = ref(storage, folderPath);
        uploadBytes(storageRef, profilePhotoSrc)
          .then(() => {
            const storageRef: StorageReference = ref(storage, folderPath);
            return storageRef;
          })
          .then(storageRef => {
            const url: Promise<string> = getDownloadURL(storageRef);
            return url;
          })
          .then(url => {

            update(userRef, { profilePhoto: url });
            resolve();
          })
          .catch((err: Error) => {
            console.log(err);
            return reject(err);
          });
      });
    }
  };

  const onUpdate = (): void => {
    if (userData) {
      let errors = { ...formErrorsInitialState };

      if (!form.firstName || form.firstName.length < NAMES_LENGTH_MIN || form.firstName.length > NAMES_LENGTH_MAX) {
        errors = { ...errors, error: true, firstNameLengthErr: true };
      }
      if (!form.lastName || form.lastName.length < NAMES_LENGTH_MIN || form.lastName.length > NAMES_LENGTH_MAX) {
        errors = { ...errors, error: true, lastNameLengthErr: true };
      }
      if (form.phoneNumber) {
        if (form.phoneNumber.length !== 0 && form.phoneNumber.length > PHONE_NUMBER_LENGTH_MAX)
          errors = { ...errors, error: true, firstNameLengthErr: true };
      }
      if (form.password.length !== 0 || form.confirmPassword.length !== 0) {
        if (form.password.length < PASSWORD_LENGTH_MIN || form.confirmPassword.length < PASSWORD_LENGTH_MIN) {
          errors = { ...errors, error: true, passwordLengthErr: true }
        }
        if (form.password !== form.confirmPassword) {
          errors = { ...errors, error: true, passwordMatchErr: true }
        }
      }

      setFormErrors({ ...errors });

      if (errors.error || formErrors.error) return console.log('ERRORS');
      setFormSubmissionLoading(true);

      const formToUpdate: object = {
        firstName: form.firstName,
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
      };

      const db: Database = getDatabase();
      const userRef: DatabaseReference = dbRef(db, `users/${userData?.handle}`);

      update(userRef, { ...formToUpdate })
        .then(() => uploadImageToFB(userRef))
        .then(() => changePassword())
        .then(() => setSubmitChange(prevState => !prevState))
        .then(() => setProfilePhotoSrc(null))
        .then(() => setHasFormChanged(false))
        .then(() => onOpen())
        .catch((err: Error) => {
          console.error(err);
          setFormSubmissionLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!userData) return;
    getUserData(userData.uid)
      .then(snapshot => {
        setContext((prevState) => ({
          ...prevState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]]
        }));
      })
      .then(() => setFormSubmissionLoading(false))
      .catch((error) => {
        console.error(error.message);
      });
  }, [submitChange, setSubmitChange, setFormErrors]);

  return (
    <Flex maxH={'fit-content'} align={'center'} justify={'center'} mt={{ base: 2, sm: 5 }} bg={'lightBlue'}>
      <Stack
        spacing={4}
        maxW={'fit-content'}
        bg={'grey'}
        rounded={'xl'}
        boxShadow={'lg'}
        p={{ base: 1, sm: 6 }}>
        <Heading textAlign={'center'} lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Details
        </Heading>
        <Flex justifyContent={'space-between'}>
          <Stack direction={['column']} spacing={6}>
            <Center flexDirection={'column'}>
              <Box position='relative'
                _hover={{ cursor: 'pointer', opacity: 0.9 }}
                onClick={onOpenFileManager}>
                <Avatar
                  borderRadius='full'
                  boxSize='150px'
                  src={userData?.profilePhoto}
                />
                <Button
                  position={'absolute'}
                  bottom={0}
                  right={-15}
                  transform={'translateX(-50%)'}
                  p={0}
                  bg={'green.100'}
                  opacity={0.9}
                  _hover={{ bg: 'green.100' }}
                  border={'1px solid'}
                  borderColor={'green.200'}
                  color={'green.500'}
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
            <Box textAlign={'center'}>
              {formErrors.invalidImageFormat && <Text fontSize={'sm'} color={'red'} >{MSG_INVALID_IMAGE_FORMAT}</Text>}
            </Box>
          </Stack>
          <Stack className='form' right={0} top={'-29%'}>
            <FormControl isRequired id='firstName'
              isInvalid={formErrors.firstNameLengthErr}>
              <FormLabel textAlign={'center'}>First name</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.firstName} onChange={updateForm('firstName')} />
              {
                formErrors.firstNameLengthErr &&
                <Center>
                  <FormErrorMessage style={{ alignSelf: 'center' }}>{MSG_NAMES_LENGTH}</FormErrorMessage>
                </Center>
              }
            </FormControl>
            <FormControl isRequired id='lastName'
              isInvalid={formErrors.lastNameLengthErr}>
              <FormLabel textAlign={'center'}>Last name</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.lastName} onChange={updateForm('lastName')} />
              {
                formErrors.lastNameLengthErr &&
                <Center>
                  <FormErrorMessage style={{ alignSelf: 'center' }}>{MSG_NAMES_LENGTH}</FormErrorMessage>
                </Center>
              }
            </FormControl>
            <FormControl id='phoneNumber'
            >
              <FormLabel textAlign={'center'}>Phone number</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.phoneNumber} onChange={updateForm('phoneNumber')} />
              {
                formErrors.firstNameLengthErr &&
                <Center>
                  <FormErrorMessage style={{ alignSelf: 'center' }}>{MSG_NAMES_LENGTH}</FormErrorMessage>
                </Center>
              }
            </FormControl>
          </Stack>
        </Flex>
        <Box>
          <Flex mb={1}>
            <Stack flexDirection={'row'}>
              <FormControl id='password' isInvalid={formErrors.passwordLengthErr || formErrors.passwordMatchErr}>
                <FormLabel textAlign={'center'}>New Password</FormLabel>
                <Input type='password' textAlign={'center'} bg={'white'} placeholder='********' value={form.password} onChange={updateForm('password')} />
              </FormControl>
              <FormControl id='password-confirm' isInvalid={formErrors.passwordLengthErr || formErrors.passwordMatchErr}>
                <FormLabel textAlign={'center'}>Confirm password</FormLabel>
                <Input type='password' textAlign={'center'} bg={'white'} placeholder='********' value={form.confirmPassword} onChange={updateForm('confirmPassword')} />
              </FormControl>
            </Stack>
          </Flex>
          {formErrors.passwordLengthErr && <Text m={0} textAlign={'center'} fontSize={'sm'} color={'red'} >{MSG_PASSWORD_LENGTH}</Text>}
          {formErrors.passwordMatchErr && <Text m={0} textAlign={'center'} fontSize={'sm'} color={'red'} >{MSG_PASSWORD_NOT_MATCH}</Text>}
        </Box>
        <Box>
          {isVisible &&
            <Alert status={'success'}
              textAlign={'center'}
              w={'fit-content'}
              rounded={'xl'}>
              <AlertIcon />
              <Box>
                <AlertTitle>User Details updated successfully</AlertTitle>
              </Box>
              <CloseButton
                rounded={'xl'}
                onClick={onClose}
              />
            </Alert>
          }
        </Box>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button
            w='full'
            border={'2px solid'}
            borderColor={'green.400'}
            bg={'none'}
            color={'green.400'}
            _hover={{ opacity: 0.8 }}
            onClick={onNavigate}>
            Cancel
          </Button>
          <Button
            bg={hasFormChanged ? 'green.400' : 'gray'}
            isLoading={formSubmissionLoading}
            variant={'primaryButton'} w='full'
            _hover={{ opacity: 0.8 }}
            isDisabled={!hasFormChanged}
            onClick={onUpdate}>
            Update Info
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
export default UserDetails