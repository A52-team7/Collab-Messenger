import { Text, Box } from "@chakra-ui/react";
import { ADD_USERS } from "../../common/constants";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { addChannel, addMemberToChannel, setChannelToSeen } from '../../services/channels.service';
import { userChannel } from "../../services/users.service";
import { useNavigate } from "react-router-dom";


interface SearchBoxProps {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  searchType?: string;
  setOpen: (value: boolean) => void;
  setSearchValue: (value: string) => void;
  updateNewMember?: (value: string) => void;
}

const SearchUsersBox = ({
  userName,
  email,
  firstName,
  lastName,
  searchType,
  setOpen,
  setSearchValue,
  updateNewMember }: SearchBoxProps): JSX.Element => {
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();

  const addUser = () => {
    if (updateNewMember)
      updateNewMember(userName);
  }

  const createChat = () => {
    if (userData === null) return;
    const members = { [userData.handle]: true, [userName]: true }
    addChannel(userData.handle, firstName + ' ' + lastName, members)
      .then(result => {
        userChannel(result.id, userData.handle);
        userChannel(result.id, userName);
        return result;
      })
      .then(result => navigate('/chat', { state: { channelId: result.id } }))
      .catch((error: Error) => console.log(error))
      .finally(() => {
        setOpen(false);
        setSearchValue('');
      });
  };

  const handleClick = () => {
    if (searchType === ADD_USERS) {
      addUser();
    } else {
      createChat();
    }
    setOpen(false);
    setSearchValue('');
  };

  return (
    <Box w={'inherit'}
      mt={1}
      maxH={"150px"}
      onClick={handleClick}
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

export default SearchUsersBox;