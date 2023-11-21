import NavLink from '../../components/NavLink/NavLink';
import {
  Box,
  Flex,
  HStack,
} from '@chakra-ui/react';

interface Link {
  name: string;
  path: string;
}

interface TopNavLinksProps {
  links: Link[];
}

const TopNavLinks = ({ links }: TopNavLinksProps) => {
  return (
    <Box px={8}>
      <Flex h={0} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={10} alignItems={'center'}>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {links.map((link) => (
              <NavLink key={link.name} name={link.name} path={link.path} />
            ))}
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}

export default TopNavLinks;