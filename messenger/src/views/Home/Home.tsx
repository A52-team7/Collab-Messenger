import { Box, Center, Image, Text } from '@chakra-ui/react';
import HomeBallonUp from '../../components/HomeBalloonUp/HomeBalloonUp';
import HomeBallonDown from '../../components/HomeBallonDown/HomeBaloonDown';


const Home = (): JSX.Element  =>{

    return (
        <>
            <Center>
                <Image src='/heading.png'/>
            </Center>
            <Box backgroundImage="url('/blue_balloons_new_new.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize='cover'
            position="fixed"
            opacity={0.8}
            mx={200}
            h={'600px'}
            w={'800px'}
            // zIndex="1"
            >
                <HomeBallonUp />
            </Box>
        </>
        // <>
        // <HomeBallonUp />
        // <Box 
        //  h={'100%'} 
        // //  mt={'12%'} 
        //  display={'flex'} 
        //  alignItems={'center'} 
        //  justifyContent={'center'}>
           
        //         <Image src={'/home.png'} h={'400px'} box-shadow={ '5px 4px 8px rgba(0, 0, 0, 0.1)'}/>
           
        // </Box>
        // <HomeBallonDown />
        // </>
    )
}

export default Home;