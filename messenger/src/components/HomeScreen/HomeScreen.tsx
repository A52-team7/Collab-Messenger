import { Box, Text, Heading, Button, Center } from "@chakra-ui/react";


export default function HomeScreen({ createCall, startHairCheck }) {
  const startDemo = () => {
    createCall().then((url) => {
      startHairCheck(url);
    });
  };

  return (
    <Box mt={5}>
      <Box rounded={'lg'} py={5} color={'black'} textAlign={'center'} bg={'grey'} margin={'auto'} w={{ base: '100%', lg: '80%', xl: '50%' }}>
        <Center mb={5}>
          <Heading w={'fit-content'} borderBottom={'2px solid black'}>Start a video call</Heading>
        </Center>
        <Text className="small">Select “Allow” to use your camera and mic for this call if prompted</Text>
        <Text>Start the demo with a new unique room by clicking the button below.</Text>
        <Button
          fontWeight={'bold'}
          mt={10}
          bg={'teal.500'}
          color={'white'}
          border={'2px solid'}
          borderColor={'teal.500'}
          _hover={{ opacity: 0.8 }}
          onClick={startDemo}>
          Start Call
        </Button>
      </Box>
    </Box>
  );
}
