import { create } from 'zustand'
import { UIFile, UIFileSystemElement, UIFiles, UIFolder, UIFolderChain } from '../types/FileStructure'
import { FolderService } from '../../service/FolderService'
import { S3FolderRepository } from '../../infra/s3/S3FolderRepository'
import { convertDomainFSEToUI, convertUIFileSystemElementToDomain, convertUIFileToDomain, convertUIFolderToDomain } from '../utils/functions'
import { FileService } from '../../service/FileService'
import { S3FileRepository } from '../../infra/s3/S3FileRepository'
import { File } from '../../domain/File'
import { Folder } from '../../domain/Folder'

type FileStructureProps = {
  mainFolderName: string,
  currentFolder: UIFolder,
  files: UIFiles, 
  folderChain: UIFolderChain,
  openFolder: (folder?: UIFolder) => Promise<void>,
  deleteElements: (files: UIFileSystemElement[]) => Promise<void>
  downloadFile : (file: UIFile) => Promise<void>
  uploadFile: (fileToUploadName: string, fileToUploadBlob: Blob) => Promise<void>,
  createFolder: (folderName: string) => Promise<void>
}

const DEFAULT_MAIN_FOLDER_NAME = import.meta.env.VITE_APP_BUCKET_NAME
const ROOT_FOLDER:UIFolder = {
  id: "",
  name: "",
  isDir: true
}


const folderService = new FolderService(new S3FolderRepository());
const fileService = new FileService(new S3FileRepository());

export const useFileStructure = create<FileStructureProps>((set, get) => ({
  mainFolderName: DEFAULT_MAIN_FOLDER_NAME,
  currentFolder:  ROOT_FOLDER,
  files: [],
  folderChain: [],
  openFolder: async (folder?: UIFolder) => {
    const mainFolderName = get().mainFolderName
    const domainFolder = folder ? convertUIFolderToDomain(folder) : undefined;
    const domainFiles = await folderService.getFolderFirstLevelElements(mainFolderName, domainFolder)

    const files: UIFiles = domainFiles.map(f => convertDomainFSEToUI(mainFolderName, f))
    
    const mainUIFolder:UIFolder = {
      id: mainFolderName + "/",
      name: mainFolderName,
      isDir: true
    }

    const folderChain: UIFolderChain = !folder ? [mainUIFolder] : folder.id.split("/").filter(s => s !== "").reduce<UIFolder[]>((acc, current) => {
      const path = acc.length === 0 ? current : acc[acc.length - 1].id + current
      const nextFolder: UIFolder = {
        id: path + "/",
        name: current,
        isDir: true
      }
      return [...acc, nextFolder]
    }, [])

    set({ currentFolder: folder ?? ROOT_FOLDER, files, folderChain })
  },
  deleteElements: async (uiElements:UIFileSystemElement[]) => {
    const mainFolderName = get().mainFolderName
    const domainElements = uiElements.map(uiE => convertUIFileSystemElementToDomain(uiE))

    await folderService.deleteElements(mainFolderName, domainElements)

    const deletedUIElementsIds = uiElements.map(e => e.id);

    set((state) => ({ ...state, files: state.files.filter(f => !deletedUIElementsIds.includes(f.id))}))
  },
  downloadFile: async (file:UIFile) => {
    const mainFolderName = get().mainFolderName
    const domainFile = convertUIFileToDomain(file);
    
    const fileBlob = await fileService.getFileBlob(mainFolderName, domainFile)
    
    
    const fileUrl = window.URL.createObjectURL(fileBlob)
    const downloadElement = document.createElement('a');
    downloadElement.href = fileUrl;
    downloadElement.download = file.name;
    
    document.body.appendChild(downloadElement);
    downloadElement.click()
    downloadElement.remove()
    window.URL.revokeObjectURL(fileUrl);
  },
  uploadFile: async (filename: string, fileBlob: Blob) => {
    const mainFolderName = get().mainFolderName

    const currentDomainFolder = convertUIFolderToDomain(get().currentFolder)

    await fileService.uploadFile(mainFolderName, currentDomainFolder, filename, fileBlob)


    const files = get().files
    if(files.find(f => f.name === filename)) return;

    const newFileId = currentDomainFolder.id + filename;
    const newUIFile = convertDomainFSEToUI(mainFolderName, new File(newFileId, filename, newFileId))
    const newUIFiles = [...files, newUIFile]

    set({files: newUIFiles})
  },
  createFolder: async (folderName: string) => {
    const mainFolderName = get().mainFolderName;
    const currentDomainFolder = convertUIFolderToDomain(get().currentFolder);
    
    await folderService.createFolder(mainFolderName, currentDomainFolder, folderName)
    
    const newFolderId = currentDomainFolder.id + folderName + "/";
    const newUIFolder = convertDomainFSEToUI(mainFolderName, new Folder(newFolderId, folderName, newFolderId));
    
    const files = get().files;
    if(files.find(f => f.name === folderName)) return;

    const newUIFiles = [...files, newUIFolder];

    set({files: newUIFiles})
  }
}))