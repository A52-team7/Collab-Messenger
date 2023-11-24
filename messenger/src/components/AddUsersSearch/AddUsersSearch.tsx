import { useState, useEffect, useContext } from 'react';
import AddUsersSearchBox from '../AddUsersSearchBox/AddUsersSearchBox';
import { getAllUsersData } from '../../services/users.service';
import { Input, Box } from '@chakra-ui/react';
import AppContext from '../../context/AppContext';

export interface User {
  handle: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AddUSerSearchProps {
  updateNewMember: (user: string) => void;
}

const AddUsersSearch = ({ updateNewMember }: AddUSerSearchProps): JSX.Element => {
  const [initialData, setInitialData] = useState<User[]>([]);
  const [filteredResults, setFilteredResults] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const { userData } = useContext(AppContext);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (!value) return;
    const filteredUsers = initialData.filter(user => {
      const trimmedSearchValue = value.trim().toLocaleLowerCase();

      const username = user.handle.toLowerCase();
      //User must not be able to find himself in the search bar.
      if (username === userData?.handle.toLowerCase()) return;
      const email = user.email.toLowerCase();
      const firstName = user.firstName.toLowerCase();
      const lastName = user.lastName.toLowerCase();
      const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

      if (username.startsWith(trimmedSearchValue)) return user;
      if (email.startsWith(trimmedSearchValue)) return user;
      if (firstName.startsWith(trimmedSearchValue)) return user;
      if (lastName.startsWith(trimmedSearchValue)) return user;
      if (fullName.startsWith(trimmedSearchValue)) return user;
    });
    setFilteredResults(filteredUsers);
  }

  useEffect(() => {
    getAllUsersData()
      .then(data => setInitialData(Object.values(data.val())))
      .catch((err: Error) => console.error(err));
  }, []);

  return (
    <Box w={'100%'}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setOpen(false);
        }
      }}
    >
      <Input pr={10} bg={'white'}
        placeholder={'Search by username / names / email'}
        _placeholder={{ color: 'gray.500' }}
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {
        open && <Box
          position={'absolute'}
          h={'fit-content'}
          w={'inherit'}
          maxH={'200px'}
          bg={'gray.300'}
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
            filteredResults?.map((user) => <AddUsersSearchBox
              key={user.handle}
              userName={user.handle}
              email={user.email}
              firstName={user.firstName}
              lastName={user.lastName}
              setOpen={setOpen}
              setSearchValue={setSearchValue}
              updateNewMember={updateNewMember}
            />)}
        </Box>
      }
    </Box>
  );
};

export default AddUsersSearch;