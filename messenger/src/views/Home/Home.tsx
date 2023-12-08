import { Box,  } from '@chakra-ui/react';
import MyCalendar from '../../components/MyCalendar/MyCalendar';
// import JitsiMeetingComponent from '../../components/JitsiMeetingComponent/JitsiMeetingComponent';


const Home = (): JSX.Element  =>{

    return (
        <Box backgroundImage="url('/OIG.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize='cover' >
            {/* <JitsiMeetingComponent/> */}
        <MyCalendar/>
        </Box>
    )
}

export default Home;