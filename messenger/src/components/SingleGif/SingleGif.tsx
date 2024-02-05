import { AspectRatio, Box, Stack } from "@chakra-ui/react";

export interface Gif {
    title: string;
    embed_url: string;
    id: string;
}
export interface SingleGifPopoverProps {
    gif: Gif;
    onGetGif: (gif: string) => void;
}

const SingleGif = ({ gif, onGetGif }: SingleGifPopoverProps) => {  
    
    const onSetGif = () => {
        onGetGif(gif.embed_url);
    }

    return (

        <Stack position="relative" onClick={onSetGif} css={{ cursor: 'pointer' }}>
            <AspectRatio w='300px' ratio={1} mt={2} mb={2}>
                <iframe title={gif.title} src={gif.embed_url}/>
            </AspectRatio>
            <Box position="absolute" top="0" left="0" w="100%" h="100%" />
        </Stack>
    )
}

export default SingleGif;