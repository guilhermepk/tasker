import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateCloudDatabaseFileDto {
  @IsNotEmpty()
  @IsString()
  cloudFileId: string
}
