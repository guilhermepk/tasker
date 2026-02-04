import { drive_v3 } from "googleapis";

export class FindGoogleFileByNameDto {
  name: string;
  folder?: boolean;
  parentId?: string;
  fields?: Array<keyof drive_v3.Schema$File>;
}