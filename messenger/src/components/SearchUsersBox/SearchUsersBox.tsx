import { Text, Box, Flex, Avatar } from "@chakra-ui/react";
import { ADD_USERS } from "../../common/constants";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import { addChannel, chatBetweenTwo, getAllChannels, setChannelToSeen } from '../../services/channels.service';
import { userChannel } from "../../services/users.service";
import { useNavigate } from "react-router-dom";


interface SearchBoxProps {
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  searchType?: string;
  imageSrc: string;
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
  imageSrc,
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
    getAllChannels()
      .then(allChannels => {
        const onlyChats = allChannels.filter(channel => !Object.keys(channel).includes('toTeam'));
        const existingChat = onlyChats.map(channel => {
          const set1 = new Set(channel.members);
          const set2 = new Set([userName, userData.handle]);

          const areEqual = set1.size === set2.size && [...set1].every(value => set2.has(value));
          return areEqual;
        });

        if (!existingChat.includes(true)) {
          const members = { [userData.handle]: true, [userName]: true }
          addChannel(userData.handle, firstName + ' ' + lastName + ', ' + userData.firstName + ' ' + userData.lastName, members)
            .then(result => {
              userChannel(result.id, userData.handle);
              userChannel(result.id, userName);
              chatBetweenTwo(result.id);
              return result;
            })
            .then(result => navigate(`/chat/${result.id}`))
            .catch((error: Error) => console.error(error))
            .finally(() => {
              setOpen(false);
              setSearchValue('');
            });
        } else {
          const index = existingChat.findIndex(el => el === true);
          const chatToNavigate = (onlyChats[index]);

          navigate(`/chat/${chatToNavigate.id}`);
        }
      })
      .catch(error => console.error(error.message));
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
      bg={'gray.300'}
      mt={1}
      maxH={"150px"}
      onClick={handleClick}
      _hover={{
        color: 'white',
        backgroundColor: 'teal.600'
      }}
    >
      <Flex alignItems={'center'}>
        <Box>
          <Avatar size={'md'} name={(firstName + ' ' + lastName)} src={imageSrc} />
        </Box>
        <Box>
          <Text w={'inherit'} px={1}>
            {firstName} {lastName}
          </Text>
          <Text fontSize={13} px={1}>
            ({userName}) {email}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default SearchUsersBox;