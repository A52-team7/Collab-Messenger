import { Text, Box } from "@chakra-ui/react";

interface SearchBoxProps {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  setOpen: (value: boolean) => void;
  setSearchValue: (value: string) => void;
  updateNewMember: (value: string) => void;
}

const AddUsersSearchBox = ({
  userName,
  email,
  firstName,
  lastName,
  setOpen,
  setSearchValue,
  updateNewMember }: SearchBoxProps): JSX.Element => {

  const addUser = () => {
    updateNewMember(userName);
    // Каквото и да има като логика в тази функция, накрая трябва задължително да има
    // setOpen(false) и setSearchValue, за да ти се reset-не input-a
    setOpen(false);
    setSearchValue('');
  };

  return (
    <Box w={'inherit'}
      mt={1}
      maxH={"150px"}
      onClick={addUser}
      _hover={{
        color: 'white',
        backgroundColor: 'gray.500'
      }}
    >
      <Text w={'inherit'} px={1}>
        {firstName} {lastName}
      </Text>
      <Text fontSize={13} px={1}>
        ({userName}) {email}
      </Text>
    </Box>
  );
};

export default AddUsersSearchBox;