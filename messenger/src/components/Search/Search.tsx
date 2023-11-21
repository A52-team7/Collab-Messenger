import { Input } from "@chakra-ui/input";
import { useNavigate } from "react-router";


const Search = (): JSX.Element => {

  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const searchItem = (event.target as HTMLInputElement).value.trim();
      if (searchItem) {
        navigate('/search', { state: { searchFor: searchItem } });
        (event.target as HTMLInputElement).value = '';
      }
    }
  }
  return (
    <Input
      pr={10}
      w={{ base: '100%', md: '80%', lg: '50%' }}
      bg={'grey'}
      placeholder="Search for Posts"
      onKeyDown={handleKeyDown} />
  );
}

export default  Search;