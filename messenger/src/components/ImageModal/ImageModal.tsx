import { Button, Center, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";


interface ImageModalProps {
    imageSrc: string;
  }

const ImageModal = ({imageSrc}: ImageModalProps) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
              <>
                <Button onClick={onOpen} h={'350px'} bg={'none'} _hover={{ bg: 'none' }}>
                    <Image src={imageSrc} h={'350px'}/>
                </Button>
          
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent maxW="1000px" maxH="600px" bg={'rgb(237,254,253)'}>
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <Image src={imageSrc} maxH="500px"/>
                        </Center>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </>          
    )
}

export default ImageModal;