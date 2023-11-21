import { useNavigate } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription, Link } from "@chakra-ui/react";
import { AlertIcon } from "@chakra-ui/react";

const NoPageFound = (): JSX.Element => {
  const navigate = useNavigate();
  return (
    <Alert
      m={'auto'}
      w={{ base: '80%', md: '80%', lg: '50%' }}
      borderRadius={'10px'}
      status={'error'}
      variant={'subtle'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      textAlign={'center'}
      height={'200px'}
    >
      <AlertIcon boxSize={'40px'} mr={0} />
      <AlertTitle mt={4} mb={1} fontSize={'lg'}>
        404 page not found
      </AlertTitle>
      <AlertDescription maxWidth={'sm'}>
        Uh-oh! We&apos;re not sure what you are looking for...
      </AlertDescription>
      <AlertDescription maxWidth={'sm'}>
        Return to <Link fontWeight={'bold'} color={'blue'} onClick={() => navigate('/')}>Home Page</Link>?
      </AlertDescription>
    </Alert>
  )
}

export default NoPageFound;