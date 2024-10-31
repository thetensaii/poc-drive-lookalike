import { S3Client } from "@aws-sdk/client-s3"

export class S3ClientFactory {
  public createS3Client(region: string, endpoint: string, accessKeyId: string, secretAccessKey:string) {
    return new S3Client({ 
        region, 
        endpoint, 
        credentials: {
          accessKeyId,
          secretAccessKey,
        } 
    });
  }
}