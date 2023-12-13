import { 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    Flex,
    Image,
    Stack,
    Heading,
    Text,
    Center,
    } from '@chakra-ui/react'

const About = () => {

return (
<Flex  
     direction={['column', 'row']}
     minH={'fit-content'}
     align={'center'}
     justify={'center'}
     mt={{ base: 2, sm: 5 }}
     bg={'none'}
>
    <Center>
<Card maxW='lg' m={'30px'} >
  <CardBody bg={'grey'} rounded={'10px'}>
    <Image
      src='Desi.jpg'
      alt='Desislava Petrova'
      w='180px'
      h='200px'
      borderRadius='md'
      rounded={'50%'}
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md' textAlign={'center'}>Desislava Petrova</Heading>
      <Text textAlign={'center'}>
        Text
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        
      </Text>
    </Stack>
  </CardBody>
</Card>
<Card maxW='lg'>
  <CardBody bg={'grey'} rounded={'10px'}>
    <Image
      src=''
      alt='Mihail Uymaz'
      w='180px'
      h='200px'
      rounded={'50%'}
      borderRadius='lg'
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md' textAlign={'center'}>Mihail Uymaz</Heading>
      <Text textAlign={'center'}>
      Text
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        
      </Text>
    </Stack>
  </CardBody>
</Card>
<Card maxW='lg' m={'30px'}>
  <CardBody bg={'grey'} rounded={'10px'}>
    <Image
      src=''
      alt='Hristina Georgieva'
      w='180px'
      h='200px'
      rounded={'50%'}
      borderRadius='lg'
    />
    <Stack mt='6' spacing='3'>
      <Heading size='md' textAlign={'center'}>Hristina Georgieva</Heading>
      <Text textAlign={'center'}>
      Text
      </Text>
    </Stack>
  </CardBody>
</Card>
</Center>
</Flex>
)
}

export default About; 