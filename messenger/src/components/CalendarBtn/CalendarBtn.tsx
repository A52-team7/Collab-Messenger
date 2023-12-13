import { useEffect, useState } from "react";
import { Box, Center, Button, FormLabel } from "@chakra-ui/react";
import { IoCalendarSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const CalendarBtn = () => {
  const [isCalendarActive, setIsCalendarActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/calendar') {
      setIsCalendarActive(true);
    } else {
      setIsCalendarActive(false);
    }
  }, [location]);

  return (
    <Box>
      <Center>
        <Button borderRadius={'50%'} px={3} py={6}
          bg={isCalendarActive ? 'rgb(188,124,213)' : 'gray.100'}
          _hover={{ opacity: 0.5 }}
          onClick={() => navigate('/calendar')}>
          <IoCalendarSharp size={30} />
        </Button>
      </Center>
      <FormLabel mr={0} color={'white'} htmlFor={'calendar-btn'}>CALENDAR</FormLabel>
    </Box>
  );
}

export default CalendarBtn;