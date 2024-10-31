import { File } from './File'
import { Folder } from './Folder';

export abstract class FileRepository {
  public abstract getFileBlob(mainFolderName:string, file:File): Promise<Blob>

  public abstract uploadFile(mainFolderName: string, folder: Folder, fileToUploadName: string, fileToUploadBlob: Blob): Promise<void>
}