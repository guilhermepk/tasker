import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, drive_v3 } from "googleapis";
import { FindGoogleFileByNameUseCase } from "../find-file-by-name/find-google-file-by-name.use-case";
import { IpcError } from "@shared/models/errors/ipc.error";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { CreateGooldeFolderUseCase } from "../create-folder/create-google-folder.use-case";
import path from "path";
import fs from 'fs';
import { app } from "electron";

@Injectable()
export class SyncDatabaseUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(drive_v3.Drive)
    private readonly googleDriveClient: drive_v3.Drive,

    @Inject(FindGoogleFileByNameUseCase)
    private readonly findGoogleFileByNameUseCase: FindGoogleFileByNameUseCase,

    @Inject(CreateGooldeFolderUseCase)
    private readonly createGooldeFolderUseCase: CreateGooldeFolderUseCase
  ){}

  async execute(){
     return await tryCatch(async () => {
      const folderName = 'Tasker';
      const databaseFileName = 'tasker.db'

      const folder: drive_v3.Schema$File = await this.findGoogleFileByNameUseCase.execute({
        name: folderName,
        folder: true
      })
        .catch(async (error: IpcError) => {
          if (error instanceof NotFoundError) return await this.createGooldeFolderUseCase.execute(folderName);
          else throw error;
        });

      const databaseFile: drive_v3.Schema$File | null = await this.findGoogleFileByNameUseCase.execute({
        name: databaseFileName,
        parentId: folder.id || '',
        folder: false
      })
        .catch((error: IpcError) => {
          if (error instanceof NotFoundError) return null
          else throw error;
        });

      const databaseFilePath = path.join(app.getPath('userData'), databaseFileName);

      const media = {
        mimeType: 'application/x-sqlite3',
        body: fs.createReadStream(databaseFilePath)
      };

      if (databaseFile){
        await this.googleDriveClient.files.update({
          auth: this.oAuth2Client,
          fileId: databaseFile.id || '',
          media: media,
          fields: 'id'
        });
      } else {
        await this.googleDriveClient.files.create({
          auth: this.oAuth2Client,
          requestBody: {
            name: databaseFileName,
            parents: [folder.id || '']
          },
          media: media,
          fields: 'id'
        });
      }
     }, `Erro ao sincronizar banco de dados com o Google Drive`);
  }
}