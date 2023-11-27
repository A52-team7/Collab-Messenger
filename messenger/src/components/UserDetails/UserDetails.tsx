import { useContext, useEffect, useRef } from 'react';
import { useState } from 'react';
import AppContext from '../../context/AppContext';
import { getUserData, updateUserData } from '../../services/users.service';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Image, Center, Box } from '@chakra-ui/react';
import { loginUser, updateUserPassword } from '../../services/auth.service';
import { getDatabase, ref as dbRef, set, Database, DatabaseReference } from "firebase/database";
import { getDownloadURL, ref, uploadBytes, getStorage, StorageReference, FirebaseStorage } from 'firebase/storage';
import { NAMES_LENGTH_MAX, NAMES_LENGTH_MIN, PASSWORD_LENGTH_MIN, PHONE_NUMBER_LENGTH_MAX } from '../../common/constants';

interface formErrorsInitialStateInterface {
  error: boolean;
  fieldErr: boolean;
  firstNameLengthErr: boolean;
  lastNameLengthErr: boolean;
  phoneLengthErr: boolean
}

const formErrorsInitialState: formErrorsInitialStateInterface = {
  error: true,
  fieldErr: false,
  firstNameLengthErr: false,
  lastNameLengthErr: false,
  phoneLengthErr: true,
}

const UserDetails = (): JSX.Element => {
  const { userData, setContext } = useContext(AppContext);
  const [form, setForm] = useState({
    phoneNumber: userData?.phoneNumber,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    password: '',
  });
  const [formErrors, setFormErrors] = useState({ ...formErrorsInitialState });
  const [profilePhotoSrc, setProfilePhotoSrc] = useState<File | undefined>();
  const [submitChange, setSubmitChange] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  console.log('USER DETAILS IS rerendering!!!');

  const onOpenFileManager = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const onLocalyUploadImage = () => {
    if (fileInput.current && fileInput.current.files) {
      const file: File = fileInput.current.files[0];
      setProfilePhotoSrc(file);
    }
  }

  const uploadImageToFB = () => {
    if (profilePhotoSrc) {
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
          const db: Database = getDatabase();
          const userRef: DatabaseReference = dbRef(db, `users/${userData?.handle}`);

          set(userRef, { ...userData, profilePhoto: url });
          setSubmitChange(prevState => !prevState);
        })
        .catch((err: Error) => console.log(err));
    }
  }

  useEffect(() => {
    if (!userData) return;
    getUserData(userData.uid)
      .then(snapshot => {
        setContext((prevState) => ({
          ...prevState,
          userData: snapshot.val()[Object.keys(snapshot.val())[0]]
        }));
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [submitChange, setSubmitChange]);

  const navigate = useNavigate();

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  }

  const onUpdate = () => {
    if (userData) {
      let errors = { ...formErrors };

      if (!form.firstName || form.firstName.length < NAMES_LENGTH_MIN || form.firstName.length > NAMES_LENGTH_MAX) {
        errors = { ...errors, error: true, firstNameLengthErr: true }
      }
      if (!form.lastName || form.lastName.length < NAMES_LENGTH_MIN || form.lastName.length > NAMES_LENGTH_MAX) {
        errors = { ...errors, error: true, lastNameLengthErr: true }
      }
      if (form.phoneNumber) {
        if (form.phoneNumber.length > PHONE_NUMBER_LENGTH_MAX) {
          errors = { ...errors, error: true, firstNameLengthErr: true }
        }
      }
      if (form.password.length !== 0) {
        if (form.password.length < PASSWORD_LENGTH_MIN) {
          errors = { ...errors, error: true, phoneLengthErr: true }
        }
      }
      setFormErrors({ ...errors });
      if (errors.error) return;

      if (form.firstName !== userData.firstName && form.firstName) {
        updateUserData(userData.handle, 'firstName', form.firstName);
        alert('First name was updated successfully!');
      }
      if (form.lastName !== userData.lastName && form.lastName) {
        updateUserData(userData.handle, 'lastName', form.lastName);
        alert('Last name was updated successfully!');
      }
      if (form.phoneNumber !== userData.phoneNumber && form.phoneNumber) {
        updateUserData(userData.handle, 'phoneNumber', form.phoneNumber);
        alert('Phone was updated successfully!');
      }
      if (form.password.length !== 0) {
        updateUserPassword(form.password)
          .then(() => {
            console.error('Password updated successfully');
            loginUser(userData.email, form.password)
              .then(credential => {
                setContext((prevState) => ({
                  ...prevState,
                  user: credential.user,
                }));
              })
              .then(() => {
                navigate('/');
              })
              .catch((error) => {
                console.error(error.message)
              });
          }).catch((error) => {
            console.error(error.message);
          });
      }
    }
  }

  const onNavigate = () => {
    navigate(-1);
  }

  return (
    <Flex maxH={'fit-content'} align={'center'} justify={'center'} mt={{ base: 2, sm: 5 }}>
      <Stack spacing={4} maxW={'435px'} bg={'grey'} rounded={'xl'} boxShadow={'lg'} p={{ base: 1, sm: 6 }}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
          User Details
        </Heading>
        <Flex justifyContent={'space-between'} position={'relative'}>
          <Stack direction={['column']} spacing={6}>
            <Center flexDirection={'column'}>
              <Box position='relative'>
                <Image
                  borderRadius='full'
                  boxSize='150px'
                  src={userData?.profilePhoto}
                  alt={userData?.handle}
                />
                <Button
                  maxW={'150px'}
                  position={'absolute'}
                  bottom={'-5'}
                  left={'50%'}
                  transform={'translateX(-50%)'}
                  bg={'orangered'}
                  _hover={{ opacity: 0.7 }}
                  onClick={onOpenFileManager}
                >
                  Select New Image
                </Button>
              </Box>
              <Input
                hidden
                type='file'
                ref={fileInput}
                onChange={onLocalyUploadImage}
              />
            </Center>
          </Stack>
          <Stack className='form' position={'absolute'} right={0} top={'-29%'}>
            <FormControl id='firstName'>
              <FormLabel textAlign={'center'}>First name</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.firstName} onChange={updateForm('firstName')} />
            </FormControl>
            <FormControl id='lastName'>
              <FormLabel textAlign={'center'}>Last name</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.lastName} onChange={updateForm('lastName')} />
            </FormControl>
            <FormControl id='phoneNumber'>
              <FormLabel textAlign={'center'}>Phone number</FormLabel>
              <Input type='text' textAlign={'center'} bg={'white'} value={form.phoneNumber} onChange={updateForm('phoneNumber')} />
            </FormControl>
          </Stack>
        </Flex>
        <Stack flexDirection={'row'} mt={10}>
          <FormControl id='password'>
            <FormLabel textAlign={'center'}>New Password</FormLabel>
            <Input type='password' textAlign={'center'} bg={'white'} placeholder='********' value={form.password} onChange={updateForm('password')} />
          </FormControl>
          <FormControl id='password-confirm'>
            <FormLabel textAlign={'center'}>Confirm password</FormLabel>
            <Input type='password' textAlign={'center'} bg={'white'} placeholder='********' value={form.password} onChange={updateForm('password')} />
          </FormControl>
        </Stack>
        <Stack spacing={6} direction={['column', 'row']}>
          <Button bg={'red.400'} color={'white'} w='full' _hover={{ bg: 'red.400', }} onClick={onNavigate}>
            Cancel
          </Button>
          <Button variant={'primaryButton'} w='full' _hover={{ bg: 'blue.500', }} onClick={uploadImageToFB}>
            Update Info
          </Button>
        </Stack>
      </Stack>
    </Flex>
  )
}
export default UserDetails