import { useState, useEffect, useContext } from 'react';
import SearchUsersBox from '../SearchUsersBox/SearchUsersBox';
import { getAllUsersData } from '../../services/users.service';
import { Input, Box } from '@chakra-ui/react';
import AppContext from '../../context/AppContext';
import { ADD_USERS } from '../../common/constants';
import { Team } from '../CreateTeam/CreateTeam';

export interface User {
  handle: string;
  email: string;
  firstName: string;
  lastName: string;
  myChannels: object[];
  profilePhoto: string;
}

interface AddUSerSearchProps {
  searchType: string;
  updateNewMember?: (user: string) => void;
  team?: Team;
}

const SearchUsers = ({ searchType, updateNewMember, team }: AddUSerSearchProps): JSX.Element => {
  const [initialData, setInitialData] = useState<User[]>([]);
  const [filteredResults, setFilteredResults] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const { userData } = useContext(AppContext);

  const searchAllUsers = (value: string) => {
    setSearchValue(value);

    if (!value) return;
    const trimmedSearchValue = value.trim().toLocaleLowerCase();
    const filteredUsers = initialData.filter(user => {
      const username = user.handle.toLowerCase();
      //User must not be able to find himself in the search bar.
      if (username === userData?.handle.toLowerCase()) return;
      const email = user.email.toLowerCase();
      const firstName = user.firstName.toLowerCase();
      const lastName = user.lastName.toLowerCase();
      const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

      if (firstName.startsWith(trimmedSearchValue)) return user;
      if (lastName.startsWith(trimmedSearchValue)) return user;
      if (username.startsWith(trimmedSearchValue)) return user;
      if (email.startsWith(trimmedSearchValue)) return user;
      if (fullName.startsWith(trimmedSearchValue)) return user;
    });
    const sortedFilteredUsers = filteredUsers.sort((a, b) => {
      const aFirstNameContainsString = a.firstName.toLowerCase().includes(trimmedSearchValue);
      const aLastNameContainsString = a.lastName.toLowerCase().includes(trimmedSearchValue);
      const bFirstNameContainsString = b.firstName.toLowerCase().includes(trimmedSearchValue);
      const bLastNameContainsString = b.lastName.toLowerCase().includes(trimmedSearchValue);

      if (aFirstNameContainsString && !bFirstNameContainsString) {
        return -1;
      } else if (!aFirstNameContainsString && bFirstNameContainsString) {
        return 1;
      } else if (aLastNameContainsString && !bLastNameContainsString) {
        return -1;
      } else if (!aLastNameContainsString && bLastNameContainsString) {
        return 1;
      } else {
        return 0;
      }
    });
    setFilteredResults(sortedFilteredUsers);
  }

  useEffect(() => {
    getAllUsersData()
      .then(data => {
        const snapshot: User[] = Object.values(data.val());
        if (team) {
          const members = Object.keys(team.members)
          const filteredUsersByTeam = snapshot.filter((user) => {
            if (members.includes(user.handle)) {
              return user
            }
          });
          return setInitialData(filteredUsersByTeam);
        }
        setInitialData(snapshot);
      })
      .catch((err: Error) => console.error(err));
  }, []);

  return (
    <Box w={searchType === ADD_USERS ? '100%' : { base: '90%', md: '300px', lg: '480px' }}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
      position={'relative'}
    >
      <Input pr={10} bg={searchType === ADD_USERS ? 'white' : 'rgb(237,254,253)'}
        placeholder={'Search by username / names / email'}
        _placeholder={{ color: 'gray.500' }}
        rounded="md"
        value={searchValue}
        onChange={(e) => searchAllUsers(e.target.value)}
      />
      {
        open && <Box
          position={'absolute'}
          h={'fit-content'}
          w={'inherit'}
          maxH={'200px'}
          bg={searchType === ADD_USERS ? 'gray.300' : 'gray.300'}
          overflowY={'scroll'}
          tabIndex={-1}
          zIndex={99}
          cursor={'pointer'}
          css={{
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            'msOverflowStyle': 'none',  /* IE and Edge */
            'scrollbarWidth': 'none',  /* Firefox */
          }}
        >
          {searchValue.length > 0 &&
            filteredResults?.map((user) => <SearchUsersBox
              key={user.handle}
              userName={user.handle}
              email={user.email}
              firstName={user.firstName}
              lastName={user.lastName}
              imageSrc={user.profilePhoto}
              searchType={searchType}
              setOpen={setOpen}
              setSearchValue={setSearchValue}
              updateNewMember={updateNewMember}
            />)}
        </Box>
      }
    </Box>
  );
};

export default SearchUsers;