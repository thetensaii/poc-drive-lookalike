import { FileSystemElement as DomainFileSystemElement, FileSystemElement } from "../../domain/FileSystemElement";
import { Folder } from "../../domain/Folder";
import { File } from "../../domain/File";
import { UIFile, UIFileSystemElement, UIFolder } from "../types/FileStructure";

export const convertUIFileSystemElementToDomain = (uiFSE: UIFileSystemElement): DomainFileSystemElement => {
  if(isUIFolder(uiFSE)) return convertUIFolderToDomain(uiFSE) 
  if(isUIFile(uiFSE)) return convertUIFileToDomain(uiFSE);

  throw new Error()
}

export const convertUIFolderToDomain = (uiFolder: UIFolder): Folder => {
  const tempId = uiFolder.id.split("/").slice(1).filter(s => s !== "").join("/")
  const id = tempId === "" ? "" : tempId + "/"
  return new Folder(id, uiFolder.name, uiFolder.id)
}

export const convertUIFileToDomain = (uiFolder: UIFile): File => {
  const id = uiFolder.id.split("/").slice(1).filter(s => s !== "").join("/")
  return new File(id, uiFolder.name, uiFolder.id)
}


export const convertDomainFSEToUI = (mainFolderName: string, domainFSE: FileSystemElement): UIFileSystemElement => {
  const {id, name, isFolder} = domainFSE
  return {
    id:`${mainFolderName}/${id}`,
    name: name,
    isDir: isFolder,
  }
}

export const isUIFolder = (uiFSE: UIFileSystemElement): uiFSE is UIFolder => {
  return uiFSE.isDir
}

export const isUIFile = (uiFSE: UIFileSystemElement): uiFSE is UIFile => {
  return !uiFSE.isDir
}