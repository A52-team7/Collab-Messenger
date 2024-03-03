import { 
    Card, 
    CardBody, 
    Flex,
    Image,
    Stack,
    Heading,
    Text,
    Center,
    Box,
    Link,
    } from '@chakra-ui/react'
    import { FaGithub } from "react-icons/fa";

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
<Card h={'342px'} m={'30px'} w={'216px'}>
  <CardBody bg={'grey'} rounded={'10px'}>
  <Box display="flex" justifyContent="center" alignItems="center" w="100%" height="200px">
    <Image
      src='Desi.jpg'
      alt='Desislava Petrova'
      w='auto'
      h='100%'
      rounded="full"
    />
    </Box>
    <Stack mt='6' spacing='3' justifyContent={'center'} alignItems={'center'}>
      <Heading size='md' textAlign={'center'}>Desislava Petrova</Heading>
      <Text textAlign={'center'}>
        <Link href='https://github.com/desi-petrova' target="_blank">
          <FaGithub size={30}/>
        </Link>
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        
      </Text>
    </Stack>
  </CardBody>
</Card>
<Card w={'216px'} h={'342px'}>
  <CardBody bg={'grey'} rounded={'10px'}>
    <Box display="flex" justifyContent="center" alignItems="center" w="100%" height="200px">
      <Image
        src='misho.PNG'
        alt='Mihail Uymaz'
        w='auto'
        h='100%'
        rounded="full"
      />
      </Box>
    <Stack mt='6' spacing='3' justifyContent={'center'} alignItems={'center'}>
      <Heading size='md' textAlign={'center'}>Mihail Uymaz</Heading>
      <Text textAlign={'center'}>
        <Link href='https://github.com/m-uymaz' target="_blank">
          <FaGithub size={30}/>
        </Link>
      </Text>
      <Text color='blue.600' fontSize='2xl'>
        
      </Text>
    </Stack>
  </CardBody>
</Card>
<Card m={'30px'} w={'216px'} h={'342px'}>
  <CardBody bg={'grey'} rounded={'10px'}>
  <Box display="flex" justifyContent="center" alignItems="center" w="100%" height="200px">
    <Image
      src='hrisi.jpg'
      alt='Hristina Georgieva'
      w='auto'
      h='100%'
      rounded="full"
    />
    </Box>
    <Stack mt='6' spacing='3' justifyContent={'center'} alignItems={'center'}>
      <Heading size='md' textAlign={'center'}>Hristina Georgieva</Heading>
      <Text textAlign={'center'}>
      <Link href='https://github.com/hristina-georgieva' target="_blank">
          <FaGithub size={30}/>
        </Link>
      </Text>
    </Stack>
  </CardBody>
</Card>
</Center>
</Flex>
)
}

export default About; 