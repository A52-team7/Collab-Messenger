import { Button } from "@chakra-ui/button";
import { Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger } from "@chakra-ui/popover";
import { HiOutlineGif } from "react-icons/hi2";
import { HiGif } from "react-icons/hi2";
import { useEffect, useState, useRef } from 'react';
import { loadSearchGifs, loadTrending } from "../../services/gifs.service";
import { Box, Input, Stack, UnorderedList, useDisclosure } from "@chakra-ui/react";
import SingleGif, { Gif } from "../SingleGif/SingleGif";

export interface GifsPopoverProps {
  onGetGif: (gif: string) => void;
}

const GifsPopover = ({ onGetGif }: GifsPopoverProps) => {

  const [visibleColor, setVisibleColor] = useState(false);
  const [trending, setTrending] = useState<Gif[]>();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [foundGifs, setFoundGifs] = useState<Gif[]>();
  const [areFound, setAreFound] = useState(false);

  const { isOpen, onClose, onToggle } = useDisclosure();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
    setAreFound(false);
    searchInputRef.current.value = ''
  }

  const onSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        const termForSearch = searchInputRef.current?.value.trim();
        loadSearchGifs(termForSearch)
        .then(found => {
            setFoundGifs(found.data);
            setAreFound(true);
        })
        .catch(err => console.error(err));        
    }
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
            <Stack height="435px" 
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
                <Box position={'fixed'} zIndex={100} bg={'white'} w={'93%'}>
                    <Input 
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search gifs by phrase" 
                    onKeyDown={onSearch}/>
                </Box>
                <UnorderedList styleType='none'>
                {!areFound ? (
                    trending && trending.map((gif: Gif) => (
                    <Box
                    display={'flex'}
                    flexWrap={'wrap'}
                    key={gif.id}
                    >
                    <SingleGif gif={gif} onGetGif={onGetGifAndClosePopover}/>
                    </Box>
                ))) : (
                    foundGifs && foundGifs.map((gif: Gif) => (
                        <Box
                        display={'flex'}
                        flexWrap={'wrap'}
                        key={gif.id}
                        >
                        <SingleGif gif={gif} onGetGif={onGetGifAndClosePopover}/>
                        </Box>
                    ))
                )
                }
                </UnorderedList>  
            </Stack>
            } 
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default GifsPopover;