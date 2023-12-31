import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface NavLinkProps {
  name: string,
  path: string
}

const NavLink = ({ name, path }: NavLinkProps) => {
  const navigate = useNavigate();

  return (
    <Box
      h={'100%'}
      bg={'teal.500'}
      color={'grey'}
      as='a'
      px={3}
      py={2}
      rounded={'md'}
      cursor='pointer'
      _hover={{
        cursor: '',
        textDecoration: 'none',
        bg: 'teal',
      }}
      onClick={() => navigate(path)}>
      {name}
    </Box>
  );
}

export default NavLink;