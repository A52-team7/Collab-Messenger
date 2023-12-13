import { Button, Heading, Stack, Text } from '@chakra-ui/react';

const refreshPage = () => {
  console.log(
    "make sure to allow access to your microphone and camera in your browser's permissions",
  );
  window.location.reload();
};

export default function UserMediaError() {
  return (
    <Stack alignItems={'center'}>
      <Stack bg={'grey'} w={'40%'} h={'400px'} gridColumn={1/3} alignItems={'center'}>
        <Heading mt={'80px'} mb={'50px'}>Camera or mic blocked</Heading>
        <Button bg={'black'} color={'white'} _hover={{opacity:0.6}} m={'1rem 0 1rem 0'} onClick={refreshPage} type="button">
          Try again
        </Button>
        <Text textDecoration={'underline'} mt={'30px'}>
          <a
            href="https://docs.daily.co/guides/how-daily-works/handling-device-permissions"
            target="_blank"
            rel="noreferrer">
            Get help
          </a>
        </Text>
      </Stack>
    </Stack>
  );
}
