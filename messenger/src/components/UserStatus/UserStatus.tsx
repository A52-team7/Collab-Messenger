import AppContext from '../../context/AppContext';
import { useContext, useState, useEffect } from 'react';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    IconButton,
    Button,
    Stack,
    Flex,
    AvatarBadge,
  } from '@chakra-ui/react';
  import {getUserStatusLive, updateUserStatus} from '../../services/users.service'

const UserStatus = () => {
    const {userData} = useContext(AppContext);

    const [status, setStatus] = useState<string>(userData.handle)
    //const [background, setBackground] = useState<string>('')

    // if(status == "Available"){
    //     setBackground('green')
    // }else if(status == "Busy"){
    //     setBackground('red')
    // } else if(status == "Away"){
    //     setBackground('yellow')
    // }else if(status == "Unavailable"){
    //     setBackground('grey')
    // }
    // console.log(status, background)

    useEffect(() => {
        if(userData === null) return;
        getUserStatusLive(userData.handle, (data) =>{
            setStatus(data)
            // if(data =)
        })
    }, [])

    const statusChange = (field: string) =>  {
        if(userData === null) return;
        setStatus(field)
        updateUserStatus(userData.handle, field)
    }

    return( 
        <Flex mt={4}>
      <Popover placement="bottom" isLazy>
        <PopoverTrigger>
          {/* <IconButton
            aria-label="More server options"
            color={'white'}
            variant='unstyled' _hover={{ transform: 'scale(1.5)', color: 'white' }}
            //icon={<BsThreeDotsVertical size={25}  />}
            w="fit-content"
            justifyContent="space-between"
            mt={-4}
          /> */}
          {status == "Available" ? (<AvatarBadge boxSize='15px' bg={'green'} backgroundColor={'none'} ml={-8} />)
          : status == "Busy" ? (<AvatarBadge boxSize='20px' bg={'red'} backgroundColor={'none'} ml={-6}/>) 
          : status == "Away" ? (<AvatarBadge boxSize='20px' bg={'yellow'} backgroundColor={'none'} ml={-6}/>)
          :  (<AvatarBadge boxSize='20px' bg={'red'} backgroundColor={'grey'} ml={-6}/>)}
        </PopoverTrigger>
        <PopoverContent w="fit-content" _focus={{ boxShadow: 'none' }}>
          <PopoverArrow />
          <PopoverBody>
            <Stack justifyContent="flex-start">
            <Button
                w="fit-content"
                h='20px'
                variant="ghost"
                //leftIcon={<FiUsers  />}
                fontWeight="normal"
                fontSize="sm"
                onClick={() => statusChange('Available')}>
                Available
              </Button>
              <Button
                w="fit-content"
                h='20px'
                variant="ghost"
                //leftIcon={<FiEdit3 />}
                fontWeight="normal"
                fontSize="sm"
                onClick={() => statusChange('Busy')}>
                Busy
              </Button>
              <Button
               w="fit-content"
               h='20px'
                variant="ghost"
                //leftIcon={<FiEdit3 />}
                fontWeight="normal"
                fontSize="sm"
                onClick={() => statusChange('Away')}>
                Away
              </Button>
              <Button
                w="fit-content"
                h='20px'
                variant="ghost"
                //leftIcon={<FiEdit3 />}
                fontSize="sm"
                onClick={() => statusChange('Unavailable')}>
                Unavailable
              </Button>
              </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
    )
}

export default UserStatus;