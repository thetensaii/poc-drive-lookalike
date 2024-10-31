import { FileSystemElement } from "./FileSystemElement";
import { Folder } from "./Folder";

export abstract class FolderRepository {
  public abstract getFolderFirstLevelElements(mainFolder:string, folder?:Folder): Promise<FileSystemElement[]>;
  public abstract deleteElements(mainFolder:string, files:FileSystemElement[]): Promise<void>;
  public abstract createFolder(mainFolderName: string, folder: Folder, newFolderName:string): Promise<void>;
}