import { File as DomainFile } from '../domain/File'
import { FileRepository as DomainFileRepository } from '../domain/FileRepository';
import { Folder as DomainFolder } from '../domain/Folder';

export class FileService {

  constructor(private _fileRepository: DomainFileRepository){}

  public async getFileBlob(mainFolderName:string, file: DomainFile): Promise<Blob> {
    return await this._fileRepository.getFileBlob(mainFolderName, file);
  }

  public async uploadFile(mainFolderName: string, folder:DomainFolder, fileToUploadName:string, fileToUploadBlob: Blob): Promise<void> {
    return await this._fileRepository.uploadFile(mainFolderName, folder, fileToUploadName, fileToUploadBlob)
  }

}