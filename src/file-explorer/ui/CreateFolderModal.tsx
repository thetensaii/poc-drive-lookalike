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
  onCreateFolder: (newFolderName: string) => Promise<void>,
}

export const CreateFolderModal = ({ isOpen, onClose, onCreateFolder}: UploadFileModalProps) => {

  const inputTextRef = useRef<HTMLInputElement>()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(!inputTextRef.current) { 
      onClose()
      return;
    }

    await onCreateFolder(inputTextRef.current.value);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={onSubmit}>
          <ModalBody>
            <Input ref={inputTextRef} />
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