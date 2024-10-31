import { ChonkyActions, FileActionHandler, FullFileBrowser } from "chonky"
import { useCallback } from "react"
import { UIFile, UIFileSystemElement, UIFiles, UIFolder, UIFolderChain } from "./types/FileStructure"
import { isUIFile, isUIFolder } from "./utils/functions"
import { UploadFileModal } from "./UploadFileModal"
import { useDisclosure } from "@chakra-ui/react"
import { CreateFolderModal } from "./CreateFolderModal"

type FileBrowserProps = {
  files: UIFiles,
  folderChain: UIFolderChain,
  onOpenFolder?: (folder: UIFolder) => Promise<void>
  onDeleteElements?: (elements: UIFileSystemElement[]) => Promise<void>
  onDownloadFile?: (file: UIFile) => Promise<void>
  onUploadFile?: (fileToUploadName: string, fileToUploadBlob: Blob) => Promise<void>,
  onCreateFolder?: (folderName:string) => Promise<void>
}

export const FileBrowser = ({ files, folderChain, onOpenFolder, onDeleteElements, onDownloadFile, onUploadFile, onCreateFolder }: FileBrowserProps) => {
  const { isOpen: isUploadModalOpen, onOpen: openUploadModal, onClose: closeUploadModal } = useDisclosure()
  const { isOpen: isCreateFolderModalOpen, onOpen: openCreateFolderModal, onClose: closeCreateFolderModal } = useDisclosure()

  const handleAction = useCallback<FileActionHandler>(async (data) => {
    console.log('File action data:', data);
    if(onOpenFolder && data.id === ChonkyActions.OpenFiles.id){
      const target = data.payload.targetFile;
      if(!target) return;

      const targetElement = files.find(f => f.id === target.id) ?? folderChain.find(f => f.id === target.id)

      if(targetElement === undefined || !isUIFolder(targetElement)) return

      await onOpenFolder(targetElement)
      return;
    }

    if(onDeleteElements && data.id === ChonkyActions.DeleteFiles.id) {
      const elementsIds = data.state.selectedFilesForAction.map(f => f.id)

      const elementsToDelete = elementsIds.map(id => files.find(f => f.id === id)).filter((f): f is UIFileSystemElement => f !== undefined)

      await onDeleteElements(elementsToDelete)
      return;
    }

    if(onDownloadFile && data.id === ChonkyActions.DownloadFiles.id){
      const targetFile = files.find(f => f.id === data.state.selectedFilesForAction[0].id)
      if(!targetFile || !isUIFile(targetFile)) return;

      console.log(targetFile)

      await onDownloadFile(targetFile);
      return;
    }

    if(onUploadFile && data.id === ChonkyActions.UploadFiles.id){
      openUploadModal();
    }

    if(onCreateFolder && data.id === ChonkyActions.CreateFolder.id){
      openCreateFolderModal();
    }
    
  }, [files, folderChain, onCreateFolder, onDeleteElements, onDownloadFile, onOpenFolder, onUploadFile, openCreateFolderModal, openUploadModal]);

  const myFileActions = [];
  if(onDeleteElements) myFileActions.push(ChonkyActions.DeleteFiles)
  if(onOpenFolder)  {
    myFileActions.push(ChonkyActions.OpenFiles)
    myFileActions.push(ChonkyActions.OpenParentFolder)
  }
  if(onDownloadFile) myFileActions.push(ChonkyActions.DownloadFiles)
  if(onUploadFile) myFileActions.push(ChonkyActions.UploadFiles)
  if(onCreateFolder) myFileActions.push(ChonkyActions.CreateFolder)
  
  return ( 
    <div style={{ height: 300 }}>
      <FullFileBrowser files={files} folderChain={folderChain} fileActions={myFileActions} onFileAction={handleAction} />
      {onUploadFile && <UploadFileModal isOpen={isUploadModalOpen} onClose={closeUploadModal} onUploadFile={onUploadFile} />}
      {onCreateFolder && <CreateFolderModal isOpen={isCreateFolderModalOpen} onClose={closeCreateFolderModal} onCreateFolder={onCreateFolder} />}
    </div>
  )
}