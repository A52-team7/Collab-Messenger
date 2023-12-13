import { Box, Center, Image, Text } from '@chakra-ui/react';


const Home = (): JSX.Element  =>{

    return (
        // <Box backgroundImage="url('/home_background.jpg')"
        // backgroundPosition="center"
        // backgroundRepeat="no-repeat"
        // backgroundSize='cover'
        // position="fixed"
        // h={'95%'}
        // w={'85%'}
        // // zIndex="1"
        // >
        // </Box>
        <Box h={'100%'} mt={'12%'}>
            <Center>
                <Image src={'/home.png'} h={'400px'} box-shadow={ '5px 4px 8px rgba(0, 0, 0, 0.1)'}/>
            </Center>
        </Box>
    )
}

export default Home;