import { Text, Box } from "@chakra-ui/react";

interface SearchBoxProps {
  userName: string,
  email: string,
  firstName: string,
  lastName: string
}

const SearchBox = ({ userName, email, firstName, lastName }: SearchBoxProps): JSX.Element => {
  return (
    <Box
      w={{ base: '200px', md: '300px', lg: '500px' }}
      mt={1}
      maxH="150px"
      _hover={{
        color: 'black',
        backgroundColor: 'gray.300'
      }}
    >
      <Text
        w={'inherit'}
        px={1}
      >{firstName} {lastName}</Text>
      <Text
        fontSize={13}
        px={1}
      >({userName}) {email}</Text>
    </Box>
  );
};

export default SearchBox;