import { Inject, Injectable } from "@nestjs/common";
import path from 'path';
import fs from 'fs';
import { app } from "electron";
import { Auth, drive_v3 } from "googleapis";
import { DATABASE_FILE_NAME } from "@main/common/constants";

@Injectable()
export class DownloadCloudDatabaseFileUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(drive_v3.Drive)
    private readonly googleDriveClient: drive_v3.Drive,
  ){}
  
  async execute(cloudFileId: string): Promise<void> {
    const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);

    const response = await this.googleDriveClient.files.get(
      {
        auth: this.oAuth2Client,
        fileId: cloudFileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    return new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(databaseFilePath);
      
      response.data
        .on('error', (err) => reject(err))
        .pipe(dest);

      dest
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });
  }
}