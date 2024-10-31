import {
  Button,
  Modal,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import React, { useRef } from 'react'

type UploadFileModalProps = {
  isOpen: boolean,
  onClose: () => void,
  onUploadFile: (fileToUploadName: string, fileToUploadBlob: Blob) => Promise<void>,
}

export const UploadFileModal = ({ isOpen, onClose, onUploadFile}: UploadFileModalProps) => {

  const inputFileRef = useRef<HTMLInputElement>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(!inputFileRef.current?.files || inputFileRef.current.files.length === 0) { 
      onClose()
      return;
    }

    const file = inputFileRef.current.files[0]
    const filename = file.name;

    await onUploadFile(filename, file);
    onClose()
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>Upload File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input ref={inputFileRef} type='file' />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button type="submit" onClick={onSubmit} variant='ghost'>Upload</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}