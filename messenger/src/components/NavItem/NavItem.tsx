import { useNavigate } from 'react-router-dom';
import { Box, Flex, Icon, IconProps } from '@chakra-ui/react';

interface NavItemProps {
  icon: IconProps,
  name: string
  path: string
}

const NavItem = ({ icon, name, path }: NavItemProps) => {
  const navigate = useNavigate();

  return (
    <Box
      as='a'
      onClick={() => navigate(path)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align='center'
        color={'grey'}
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        _hover={{
          bg: 'lightBlue',
          color: 'white',
        }}>
        {icon && (
          <Icon
            mr='4'
            color={'grey'}
            fontSize='16'
            _groupHover={{
              color: 'white',
            }}
          />
        )}
        {name}
      </Flex>
    </Box>
  )
}

export default NavItem;