import { Box, Center, Image, Text } from '@chakra-ui/react';
import HomeBallonUp from '../../components/HomeBalloonUp/HomeBalloonUp';
import HomeBallonDown from '../../components/HomeBallonDown/HomeBaloonDown';


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
        <>
        <HomeBallonUp />
        <Box 
         h={'100%'} 
        //  mt={'12%'} 
         display={'flex'} 
         alignItems={'center'} 
         justifyContent={'center'}>
           
                <Image src={'/home.png'} h={'400px'} box-shadow={ '5px 4px 8px rgba(0, 0, 0, 0.1)'}/>
           
        </Box>
        <HomeBallonDown />
        </>
    )
}

export default Home;