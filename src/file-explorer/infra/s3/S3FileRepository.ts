import { FileRepository } from "../../domain/FileRepository";
import { S3ClientFactory } from "./S3ClientFactory";
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { File } from '../../domain/File'
import { Folder } from "../../domain/Folder";

const {
  VITE_APP_IDRIVE_REGION,
  VITE_APP_IDRIVE_ENDPOINT,
  VITE_APP_IDRIVE_ACCESS_KEY_ID,
  VITE_APP_IDRIVE_SECRET_ACCESS_KEY
} = import.meta.env;
export class S3FileRepository extends FileRepository {
  private readonly s3Client = new S3ClientFactory().createS3Client(
    VITE_APP_IDRIVE_REGION,
    VITE_APP_IDRIVE_ENDPOINT,
    VITE_APP_IDRIVE_ACCESS_KEY_ID,
    VITE_APP_IDRIVE_SECRET_ACCESS_KEY
  )

  public async getFileBlob(mainFolderName: string, file: File): Promise<Blob> {

    console.log(file)
    const getObjectCommand = new GetObjectCommand({
      Bucket: mainFolderName,
      Key: file.id
    })

    const response = await this.s3Client.send(getObjectCommand);

    if(!response.Body) throw new Error()
    const byteArray = await response.Body.transformToByteArray();

    const fileBlob = new Blob([byteArray], {type : response.ContentType})
    return fileBlob;
  }

  public async uploadFile(mainFolderName: string, folder: Folder, fileToUploadName: string, fileToUploadBlob: Blob): Promise<void> {
    const fileToUploadKey = folder.id + fileToUploadName
    const putObjectCommand = new PutObjectCommand({
      Bucket: mainFolderName,
      Key: fileToUploadKey,
      Body: fileToUploadBlob
    })

    await this.s3Client.send(putObjectCommand)
  }
  
}