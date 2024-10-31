import { ListObjectsV2Command, DeleteObjectsCommand, _Object, ObjectIdentifier, PutObjectCommand } from "@aws-sdk/client-s3"
import { S3ClientFactory } from "./S3ClientFactory";

import { File } from "../../domain/File";
import { FileSystemElement } from "../../domain/FileSystemElement";
import { Folder } from "../../domain/Folder";
import { FolderRepository } from "../../domain/FolderRepository";

const {
  VITE_APP_IDRIVE_REGION,
  VITE_APP_IDRIVE_ENDPOINT,
  VITE_APP_IDRIVE_ACCESS_KEY_ID,
  VITE_APP_IDRIVE_SECRET_ACCESS_KEY
} = import.meta.env;

type _ObjectWithKey = _Object & { Key: string}

export class S3FolderRepository extends FolderRepository {

  private readonly s3Client = new S3ClientFactory().createS3Client(
    VITE_APP_IDRIVE_REGION,
    VITE_APP_IDRIVE_ENDPOINT,
    VITE_APP_IDRIVE_ACCESS_KEY_ID,
    VITE_APP_IDRIVE_SECRET_ACCESS_KEY
  )

  public async getFolderFirstLevelElements(mainFolder: string, folder?:Folder): Promise<FileSystemElement[]> {
    const folderElements = await this.getFolderElements(mainFolder, folder);
    
    const folderFirstLevelElements = folderElements.filter(f => {
      const elementIdWithoutFolderId = f.id.replace(folder?.id ?? "", "")
      if(elementIdWithoutFolderId === "") return false;
      
      if(elementIdWithoutFolderId.indexOf("/") === -1) return true;
      
      if(elementIdWithoutFolderId.indexOf("/") === elementIdWithoutFolderId.length - 1) return true;
      
      return false;
    })
    
    return folderFirstLevelElements;
  }

  public async deleteElements(mainFolder: string, elements:FileSystemElement[]): Promise<void> {
    const filesToDelete = elements.filter((e): e is File => !e.isFolder)
    
    const foldersToDelete = elements.filter((e): e is Folder => e.isFolder);
    const promises = foldersToDelete.map(f => this.getFolderElements(mainFolder, f))
    const allFoldersAndChildrenByFolder = await Promise.all(promises);

    const allFilesToDelete = allFoldersAndChildrenByFolder.reduce((acc, current) => {
      return [...acc, ...current]
    }, filesToDelete)



    const objectsToDelete: ObjectIdentifier[] = allFilesToDelete.map(e => ({
      Key: e.id
    }))


    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: mainFolder,
      Delete : {
        Objects: objectsToDelete
      }
    })

    await this.s3Client.send(deleteObjectsCommand)
  }

  public async createFolder(mainFolderName: string, folder: Folder, newFolderName: string): Promise<void> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: mainFolderName,
      Key: folder.id + newFolderName + "/"
    })

    await this.s3Client.send(putObjectCommand)
  }

  private async getFolderElements(mainFolder: string, folder?:Folder) : Promise<FileSystemElement[]> {
    const listObjectsV2Command = new ListObjectsV2Command({ 
      Bucket: mainFolder, 
      Prefix: folder ? folder.id : ""
    });

    const response = await this.s3Client.send(listObjectsV2Command)

    const s3Objects = response.Contents;
    if(s3Objects === undefined) return [];

    const s3ObjectsWithKey = this.deleteObjectsWithoutKey(s3Objects)

    return this.convertS3ObjectsToDomainFSE(s3ObjectsWithKey)    
  }

  private deleteObjectsWithoutKey(objects: _Object[]): _ObjectWithKey[] {
    return objects.filter((o): o is _ObjectWithKey => {
      if(o.Key === undefined) return false;
       
      return true
    })
  }

  private isS3Folder(s3Object:_ObjectWithKey): boolean {
    return s3Object.Key.lastIndexOf("/") === s3Object.Key.length - 1
  }
  private getS3ObjectName(s3Object:_ObjectWithKey): string {
    const keySplit = s3Object.Key.split("/").filter(s => s !== "")
    const name = keySplit.pop()

    if(!name) throw new Error()

    return name;
  }
  
  private convertS3FileToDomain(s3File: _ObjectWithKey): File {
    const name = this.getS3ObjectName(s3File)
    if(!name) throw new Error()
    
    return new File(s3File.Key, name, s3File.Key)
  }
  
  private convertS3FolderToDomain(s3Folder: _ObjectWithKey): Folder {
    const name = this.getS3ObjectName(s3Folder)

    return new Folder(s3Folder.Key, name, s3Folder.Key)
  }

  private convertS3ObjectsToDomainFSE(s3Objects: _ObjectWithKey[]): FileSystemElement[] {
    return s3Objects.map(o => this.isS3Folder(o) ? this.convertS3FolderToDomain(o) : this.convertS3FileToDomain(o))
  }

}