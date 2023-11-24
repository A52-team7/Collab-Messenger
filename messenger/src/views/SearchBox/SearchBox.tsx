import { Text, Box } from "@chakra-ui/react";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { addChannel, addMemberToChannel } from '../../services/channels.service';
import { userChannel } from "../../services/users.service";
import { useNavigate } from "react-router-dom";

interface SearchBoxProps {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  setOpen: (value: boolean) => void;
  setSearchValue: (value: string) => void;
}

const SearchBox = ({ userName, email, firstName, lastName, setOpen, setSearchValue }: SearchBoxProps): JSX.Element => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const createChat = () => {
    if (userData === null) return;
    addChannel(userData.handle)
      .then(result => {
        userChannel(result.id, userData.handle);
        addMemberToChannel(result.id, userData.handle);
        return result;
      })
      .then(result => {
        userChannel(result.id, userName);
        addMemberToChannel(result.id, userName);
        return result;
      })
      .then(result => navigate('/chat', { state: { channelId: result.id } }))
      .catch((error: Error) => console.log(error))
      .finally(() => {
        setOpen(false);
        setSearchValue('');
      });
  };

  return (
    <Box w={{ base: '200px', md: '300px', lg: '500px' }}
      mt={1}
      maxH={"150px"}
      onClick={createChat}
      _hover={{
        color: 'black',
        backgroundColor: 'gray.300'
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

export default SearchBox;