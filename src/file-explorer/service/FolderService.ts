import { FolderRepository as DomainFolderRepository } from "../domain/FolderRepository";
import { FileSystemElement as DomainFileSystemElement } from "../domain/FileSystemElement";
import { Folder as DomainFolder } from "../domain/Folder";

export class FolderService {

  constructor(private _folderRepository: DomainFolderRepository){}

  public async getFolderFirstLevelElements(mainFolderId:string, folder?: DomainFolder): Promise<DomainFileSystemElement[]>{
    return await this._folderRepository.getFolderFirstLevelElements(mainFolderId, folder);
  }

  public async deleteElements(mainFolderId:string, elements: DomainFileSystemElement[]): Promise<void> {
    return await this._folderRepository.deleteElements(mainFolderId, elements);
  }

  public async createFolder(mainFolderName:string, folder: DomainFolder, newFolderName:string): Promise<void> {

    const folderNameRegExp = /^[a-zA-Z0-9-_ ]+$/;
    if(!folderNameRegExp.test(newFolderName)) throw new Error();

    return await this._folderRepository.createFolder(mainFolderName, folder, newFolderName);
  }

}