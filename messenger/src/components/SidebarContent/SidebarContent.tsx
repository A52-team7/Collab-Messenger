import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import NavItem from '../NavItem/NavItem';
import {
  Box,
  Flex,
  Button,
  CloseButton,
  useColorModeValue,
  Heading
} from '@chakra-ui/react';
import {
  FiHome,
} from 'react-icons/fi';
import { BsChatTextFill } from "react-icons/bs";
import { RiTeamFill } from "react-icons/ri";


import UserTeams from '../UserTeams/UserTeams'
import MyChatsSideNavBar from '../MyChatsSideNavBar/MyChatsSideNavBar';

const LinkItems = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Team', icon: FiHome, path: '/new-team' },
  { name: 'Create new chat', icon: FiHome, path: '/create-new-chat' },
];

interface SidebarContentProps {
  onClose: () => void
  display?: object
}

const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { userData } = useContext(AppContext);
  return (
    <Box
      transition={'3s ease'}
      bg={'blue'}
      borderRight={'1px'}
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'fit-content', md: 60 }}
      pos={'fixed'}
      h={'full'}
      {...rest}>
      <Box position={'absolute'} right={0}>
        <CloseButton display={{ md: 'none' }} onClick={onClose} />
      </Box>
      <Flex alignItems={'center'} justifyContent={'flex-end'}>
        <Heading textAlign={'center'} fontSize={24}>COLLAB-MESSENGER</Heading>
      </Flex>
      <Flex mt={{ base: 5, md: 5 }} alignItems='center' justifyContent={'space-around'}>
        <Button borderRadius={'50%'} px={3} py={6}><BsChatTextFill size={30} /></Button>
        <Button rounded={'xl'} px={3} py={6}><RiTeamFill size={30} /></Button>
      </Flex>
      <Box minW={'210px'}>
        <NavItem key={LinkItems[0].name} icon={LinkItems[0].icon} name={LinkItems[0].name} path={LinkItems[0].path} />
        <UserTeams/>
        {/* <NavItem key={LinkItems[2].name} icon={LinkItems[2].icon} name={LinkItems[2].name} path={LinkItems[2].path} /> */}
        <MyChatsSideNavBar/>
      </Box>
    </Box >
  );
}

export default SidebarContent;