import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import NavItem from '../NavItem/NavItem';
import {
  Box,
  Flex,
  Text,
  CloseButton,
  useColorModeValue,
  Image,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiArchive,
  FiHeart,
} from 'react-icons/fi';
import imgFile from '../../../assets/logo.png'

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'New Post', icon: FiTrendingUp, path: '/new-post' },
  { name: 'My post pages', icon: FiArchive, path: '/my-post-pages' },
  { name: 'My liked posts', icon: FiHeart, path: '/my-liked-posts' },
  { name: 'Admin Panel', icon: FiStar, path: '/admin-panel' },
];

interface SidebarContentProps {
  onClose: () => void
}

const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { userData } = useContext(AppContext);
  return (
    <Box
      transition='3s ease'
      bg={'blue'}
      borderRight='1px'
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos='fixed'
      h='full'
      {...rest}>
      <Flex alignItems='center' justify="center">
        <Image src={imgFile} alt='logo' w={"150px"} alignItems='center' />
      </Flex>
      <Flex h='20' alignItems='center' mx='4' justifyContent='space-between'>
        <Text fontSize='23' fontFamily='monospace' fontWeight='bold' color={'grey'}>
          &nbsp;&nbsp;&nbsp;Bookworm&apos;s &nbsp;&nbsp; &nbsp;&nbsp; Sanctuary
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <NavItem key={LinkItems[0].name} icon={LinkItems[0].icon} name={LinkItems[0].name} path={LinkItems[0].path} />
      {userData && <NavItem key={LinkItems[1].name} icon={LinkItems[1].icon} name={LinkItems[1].name} path={LinkItems[1].path} />}
      {userData && <NavItem key={LinkItems[2].name} icon={LinkItems[2].icon} name={LinkItems[2].name} path={LinkItems[2].path} />}
      {userData && <NavItem key={LinkItems[3].name} icon={LinkItems[3].icon} name={LinkItems[3].name} path={LinkItems[3].path} />}
    </Box >
  )
}

export default SidebarContent;