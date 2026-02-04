import { IsString } from "class-validator";

export class LastSyncHashFileDto {
  @IsString()
  lastSyncHash: string
}