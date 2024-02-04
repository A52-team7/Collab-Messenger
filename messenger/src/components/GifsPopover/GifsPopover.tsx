import { Button } from "@chakra-ui/button";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import { HiOutlineGif } from "react-icons/hi2";
import { HiGif } from "react-icons/hi2";
import { useEffect, useState } from 'react';
import { loadTrending } from "../../services/gifs.service";
import { Box, Stack, UnorderedList, useDisclosure } from "@chakra-ui/react";
import SingleGif, { Gif } from "../SingleGif/SingleGif";

export interface GifsPopoverProps {
  onGetGif: (gif: string) => void;
}

const GifsPopover = ({ onGetGif }: GifsPopoverProps) => {

  const [visibleColor, setVisibleColor] = useState(false);
  const [trending, setTrending] = useState<Gif[]>();
  const [hasLoaded, setHasLoaded] = useState(false);

  const { isOpen, onClose, onToggle } = useDisclosure();

  useEffect (() => {
    loadTrending()
    .then(trending => {
        setTrending(trending.data);
        setHasLoaded(true);
    })
    .catch(err => console.error(err));
  }, []);
  

  const onSeeColor = () => {
    setVisibleColor(true);
  }

  const onHideColor = () => {
    setVisibleColor(false);
  }

  const onGetGifAndClosePopover = (gif: string) => {
    onGetGif(gif);
    onClose();
  }


  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="top">
      <PopoverTrigger>
        <Button
          bg={'none'}
          color={'white'}
          ml={-5}
          onMouseEnter={onSeeColor}
          onMouseLeave={onHideColor}
          _hover={{ bg: 'none' }}
          _focus={{ bg: 'none' }}
          onClick={onToggle}>
          {!visibleColor ? (<HiOutlineGif size={45} />) : (<HiGif size={45} />)}
        </Button>

      </PopoverTrigger>
      <PopoverContent w={'fit-content'}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Gifs!</PopoverHeader>
        <PopoverBody>

         {hasLoaded && 
            <Stack height="430px" 
            overflowY="auto"
            css={{
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'black',
                  borderRadius: '24px',
                },
              }}>
                <UnorderedList styleType='none'>
                {trending && trending.map((gif: Gif) => (
                    <Box
                    display={'flex'}
                    flexWrap={'wrap'}
                    key={gif.id}
                    >
                    <SingleGif gif={gif} onGetGif={onGetGifAndClosePopover}/>
                    </Box>
                ))}
                </UnorderedList>  
            </Stack>
            } 
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default GifsPopover;