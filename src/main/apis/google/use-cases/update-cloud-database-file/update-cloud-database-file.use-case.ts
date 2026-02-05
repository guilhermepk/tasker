import { DATABASE_FILE_NAME } from "@main/common/constants";
import { Inject, Injectable } from "@nestjs/common";
import { app } from "electron";
import path from "path";
import fs from 'fs';
import { Auth, drive_v3 } from "googleapis";

@Injectable()
export class UpdateCloudDatabaseFileUseCase {
  constructor(
    @Inject(drive_v3.Drive)
    private readonly googleDriveClient: drive_v3.Drive,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client
  ){}

  async execute(
    cloudFileId: string
  ): Promise<void> {
    const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);

    const media = {
      mimeType: 'application/x-sqlite3',
      body: fs.createReadStream(databaseFilePath)
    };

    await this.googleDriveClient.files.update({
        auth: this.oAuth2Client,
        fileId: cloudFileId,
        media: media,
        fields: 'id'
      });
  }
}