import { Button } from "@chakra-ui/button";
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/popover";
import { BsImage } from "react-icons/bs";
import { BsFillImageFill } from "react-icons/bs";
import { useState, useRef } from 'react';
import { Box, Center, Input } from "@chakra-ui/react";

export interface SendImagePopoverProps {
  setImage: (image: string | ArrayBuffer) => void;
  setImageSrc: (imageSrc: File | null) => void;
}

const SendImagePopover = ({ setImage, setImageSrc }: SendImagePopoverProps) => {

  const [visibleColor, setVisibleColor] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const onSeeColor = () => {
    setVisibleColor(true);
  }

  const onHideColor = () => {
    setVisibleColor(false);
  }

  const onOpenFileManager = (): void => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  };

  const onLocallyUploadImage = (): void => {

    if (fileInput.current && fileInput.current.files) {

      const file: File = fileInput.current.files[0];
      if (!file) return;

      setImageSrc(file);


      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result);
        }
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Button
          ml={-5}
          bg={'none'}
          color={'white'}
          onMouseEnter={onSeeColor}
          onMouseLeave={onHideColor}
          _hover={{ bg: 'none' }}
          _focus={{ bg: 'none' }}>
          {!visibleColor ? (<BsImage size={35} />) : (<BsFillImageFill size={35} />)}
        </Button>
      </PopoverTrigger>
      <PopoverContent w={'fit-content'}>
        <PopoverArrow />
        <PopoverBody>
          <Center flexDirection={'column'}>
            <Box position='relative'
              _hover={{ cursor: 'pointer', opacity: 0.9 }}
            >
              <Button
                p={0}
                bg={'teal.100'}
                opacity={0.9}
                _hover={{ bg: 'teal.100' }}
                border={'1px solid'}
                borderColor={'teal'}
                color={'teal'}
                onClick={onOpenFileManager}
              >
                Choose image
              </Button>
            </Box>
            <Input
              hidden
              type={'file'}
              rounded="md"
              accept={'.jpeg,.png,.JPG,.PNG'}
              ref={fileInput}
              onChange={onLocallyUploadImage}
            />
          </Center>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default SendImagePopover;