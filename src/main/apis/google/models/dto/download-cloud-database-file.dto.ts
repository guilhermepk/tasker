import { IsNotEmpty, IsString } from 'class-validator'

export class DownloadCloudDatabaseFileDto {
  @IsNotEmpty()
  @IsString()
  cloudFileId: string
}
