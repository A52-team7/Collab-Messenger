import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { getUserByHandle, createUserHandle, updateMyNotes } from '../../services/users.service';
import { registerUser } from '../../services/auth.service';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  Center,
  InputLeftElement,
  FormErrorMessage,
  NumberInputField,
  NumberInput
} from '@chakra-ui/react'
import { PhoneIcon } from '@chakra-ui/icons';
import {
  NAMES_LENGTH_MIN, NAMES_LENGTH_MAX, MSG_FIELD_REQUIRED,
  MSG_NAMES_LENGTH, MSG_EMAIL_INVALID, EMAIL_REGEX, MSG_USERNAME_TAKEN, MSG_EMAIL_TAKEN,
} from '../../common/constants.ts';
import { addChannel, updateChatIsNotes } from '../../services/channels.service.ts';

const formInitialState = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  handle: '',
  admin: false,
  password: ''
}

const formErrorsInitialState = {
  error: false,
  fieldErr: false,
  firstNameLengthErr: false,
  lastNameLengthErr: false,
  emailFormatErr: false,
  userNameTakenErr: false,
  emailTakenErr: false,
}

const Register = () => {
  const [form, setForm] = useState({ ...formInitialState });
  const [formErrors, setError] = useState({ ...formErrorsInitialState });
  const { setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const updateForm = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'firstName') setError({ ...formErrors, firstNameLengthErr: false });
    if (field === 'lastName') setError({ ...formErrors, lastNameLengthErr: false });
    if (field === 'handle') setError({ ...formErrors, userNameTakenErr: false });
    if (field === 'email') setError({ ...formErrors, emailTakenErr: false, emailFormatErr: false });
    setForm({
      ...form,
      [field]: e.target.value
    });
  }

  const onRegister = () => {
    let errors = { ...formErrors, error: false };

    // field verification
    if (!form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.handle ||
      !form.password) errors = ({ ...formErrors, fieldErr: true, error: true });

    // length & format verification
    if (form.firstName.length < NAMES_LENGTH_MIN || form.firstName.length > NAMES_LENGTH_MAX)
      errors = ({ ...errors, firstNameLengthErr: true, error: true });
    if (form.lastName.length < NAMES_LENGTH_MIN || form.lastName.length > NAMES_LENGTH_MAX)
      errors = ({ ...errors, lastNameLengthErr: true, error: true });
    if (!form.email || !form.email.match(EMAIL_REGEX))
      errors = ({ ...errors, emailFormatErr: true, error: true });

    setError({ ...errors });

    if (errors.error) return;

    getUserByHandle(form.handle)
      .then(snapshot => {
        if (snapshot.exists()) {
          setError({ ...formErrors, userNameTakenErr: true })
          throw new Error(`Handle @${form.handle} has already been taken!`);
        }

        return registerUser(form.email, form.password);
      })
      .then(credential => {

        return createUserHandle(form.handle, credential.user.uid, credential.user.email, form.firstName, form.lastName, form.phoneNumber)
          .then(() => {
            addChannel(form.handle, 'My notes', { [form.handle]: true })
              .then(result => {
                updateChatIsNotes(result.id);
                updateMyNotes(form.handle, result.id);
              })
            setContext(prevState => ({
              ...prevState,
              user: credential.user
            }));
          });
      })
      .then(() => {
        navigate('/');
      })
      .catch(e => {
        if (e.toString().includes('auth/email-already-in-use')) setError({ ...formErrors, emailTakenErr: true });
        return console.error(e);
      });
  }

  const onKeyEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    onRegister();
  }

  return (
    <Flex
      maxH={'fit-content'}
      justify={'center'}
      bg={'none'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} backgroundColor={'grey'} rounded={'lg'}>
        <Box mt={5}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Register
          </Heading>
        </Box>
        <Box
          onKeyDown={e => onKeyEnter(e)}
          rounded={'lg'}
          bg={'grey'}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={3} bg={'grey'}>
            <HStack>
              <Box>
                <FormControl
                  id='firstName'
                  isRequired
                  isInvalid={(formErrors.fieldErr && !form.firstName) || formErrors.firstNameLengthErr}>
                  <Center>
                    <FormLabel m={'0'}>First Name</FormLabel>
                  </Center>
                  <Input type='text'
                    placeholder={formErrors.fieldErr && !form.firstName ? `${MSG_FIELD_REQUIRED}` : ''}
                    textAlign={'center'}
                    bg={'white'}
                    rounded="md"
                    value={form.firstName}
                    onChange={updateForm('firstName')}

                  />
                  {
                    formErrors.firstNameLengthErr &&
                    <Center>
                      <FormErrorMessage style={{ alignSelf: 'center' }}>{MSG_NAMES_LENGTH}</FormErrorMessage>
                    </Center>
                  }
                </FormControl>
              </Box>
              <Box>
                <FormControl
                  id='lastName'
                  isRequired
                  isInvalid={(formErrors.fieldErr && !form.lastName) || formErrors.lastNameLengthErr}>
                  <Center>
                    <FormLabel m={'0'}>Last Name</FormLabel>
                  </Center>
                  <Input
                    type='text'
                    placeholder={formErrors.fieldErr && !form.lastName ? `${MSG_FIELD_REQUIRED}` : ''}
                    textAlign={'center'}
                    bg={'white'}
                    rounded="md"
                    value={form.lastName}
                    onChange={updateForm('lastName')} />
                  {
                    formErrors.lastNameLengthErr &&
                    <Center>
                      <FormErrorMessage style={{ alignSelf: 'center' }}>{MSG_NAMES_LENGTH}</FormErrorMessage>
                    </Center>
                  }
                </FormControl>
              </Box>
            </HStack>

            <Stack mt={3}>
              <InputGroup>
                <Box w={'10%'}>
                  <InputLeftElement pointerEvents='none'>
                    <PhoneIcon color='gray.400' />
                  </InputLeftElement>
                </Box>
                <NumberInput
                  w={'90%'}
                  margin={'auto'}
                  max={32}
                  min={0}
                  borderColor={'gray.500'}
                >
                  <NumberInputField
                    placeholder={'Phone number'}
                    textAlign={'center'}
                    bg={'white'}
                    rounded="md"
                    value={form.phoneNumber}
                    onChange={updateForm('phoneNumber')} />
                </NumberInput>
              </InputGroup>
            </Stack>

            <Stack align={'center'}>
              <FormControl id='email' isRequired isInvalid={formErrors.fieldErr && !form.email || formErrors.emailFormatErr || formErrors.emailTakenErr}>
                <Center>
                  <FormLabel m={'0'}>Email address</FormLabel>
                </Center>
                <Input type='email'
                  placeholder={formErrors.fieldErr && !form.email ? `${MSG_FIELD_REQUIRED}` : 'example@email.com'}
                  textAlign={'center'}
                  bg={'white'}
                  rounded="md"
                  value={form.email}
                  onChange={updateForm('email')} />
                <Center>
                  {formErrors.emailFormatErr && <FormErrorMessage>{MSG_EMAIL_INVALID}</FormErrorMessage>}
                  {formErrors.emailTakenErr && <FormErrorMessage>{MSG_EMAIL_TAKEN}</FormErrorMessage>}
                </Center>
              </FormControl>
            </Stack>

            <Stack align={'center'}>
              <FormControl id='handle' isRequired isInvalid={(formErrors.fieldErr && !form.handle) || formErrors.userNameTakenErr}>
                <Center>
                  <FormLabel m={'0'}>Username</FormLabel>
                </Center>
                <Input type='text'
                  placeholder={formErrors.fieldErr && !form.handle ? `${MSG_FIELD_REQUIRED}` : ''}
                  textAlign={'center'}
                  bg={'white'}
                  rounded="md"
                  value={form.handle}
                  onChange={updateForm('handle')} />
                <Center>
                  {formErrors.userNameTakenErr && <FormErrorMessage>{MSG_USERNAME_TAKEN}</FormErrorMessage>}
                </Center>
              </FormControl>
            </Stack>

            <Stack align={'center'}>
              <FormControl id='password' isRequired isInvalid={formErrors.fieldErr && !form.password}>
                <Center>
                  <FormLabel m={'0'}>Password</FormLabel>
                </Center>
                <InputGroup>
                  <Input type={'password'}
                    placeholder={formErrors.fieldErr && !form.password ? `${MSG_FIELD_REQUIRED}` : ''}
                    boxShadow={'lg'}
                    textAlign={'center'}
                    bg={'white'}
                    rounded="md"
                    value={form.password}
                    onChange={updateForm('password')} />
                </InputGroup>
              </FormControl>
            </Stack>

            <Stack spacing={10} pt={2}>
              <Button
                onClick={() => onRegister()}
                bg={'teal.500'}
                color={'white'}
                _hover={{
                  bg: 'tael.500',
                }}>
                Register
              </Button>
            </Stack>
            <Stack pt={2}>
              <Text fontSize={'sm'} align={'center'}>
                Already a user? <Link fontSize={'md'} color={'focusBorder'} onClick={() => navigate('/login')}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register;