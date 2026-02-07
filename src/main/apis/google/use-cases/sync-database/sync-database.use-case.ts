import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, drive_v3 } from "googleapis";
import { FindGoogleFileByNameUseCase } from "../find-file-by-name/find-google-file-by-name.use-case";
import { IpcError } from "@shared/models/errors/ipc.error";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { CreateGooldeFolderUseCase } from "../create-folder/create-google-folder.use-case";
import path from "path";
import fs from 'fs';
import { app, BrowserWindow } from "electron";
import { ReadFileUseCase } from "@main/file-manager/use-cases/read/read-file.use-case";
import { GetFileHashUseCase } from "@main/file-manager/use-cases/get-file-hash/get-file-hash.use-case";
import { LastSyncHashFileDto } from "../../models/dto/last-sync-hash-file.dto";
import { SyncSituationEnum } from "../../models/enums/sync-situation.enum";
import { DATABASE_FILE_NAME, GOOGLE_DRIVE_FOLDER_NAME, LAST_SYNC_HASH_FILE_NAME } from "@main/common/constants";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { SaveLastSyncHashUseCase } from "../save-last-sync-hash/save-last-sync-hash.use-case";
import { UpdateCloudDatabaseFileUseCase } from "../update-cloud-database-file/update-cloud-database-file.use-case";
import { DownloadCloudDatabaseFileUseCase } from "../download-cloud-database-file/download-cloud-database-file.use-case";
import compareHashes from "../../utils/compare-hashes.util";

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
    private readonly createGooldeFolderUseCase: CreateGooldeFolderUseCase,

    @Inject(ReadFileUseCase)
    private readonly readFileUseCase: ReadFileUseCase,

    @Inject(GetFileHashUseCase)
    private readonly getFileHashUseCase: GetFileHashUseCase,

    @Inject(SaveLastSyncHashUseCase)
    private readonly saveLastSyncHashUseCase: SaveLastSyncHashUseCase,

    @Inject(UpdateCloudDatabaseFileUseCase)
    private readonly updateCloudDatabaseFileUseCase: UpdateCloudDatabaseFileUseCase,

    @Inject(DownloadCloudDatabaseFileUseCase)
    private readonly downloadCloudDatabaseFileUseCase: DownloadCloudDatabaseFileUseCase
  ) { }

  async execute(): Promise<{ finished: boolean }> {
    return await tryCatch(async () => {
      console.log('\nIniciando...')

      const foundFolder: drive_v3.Schema$File | null = await this.getFolder();

      console.log('Pasta encontrada:', foundFolder)

      if (!foundFolder) {
        await this.handleNewFolder();
        return { finished: true };
      }
      else {
        const foundFile: drive_v3.Schema$File | null = await this.getFile(foundFolder.id ?? '');

        console.log('Arquivo encontrado:', foundFile)

        if (!foundFile) {
          await this.handleFileCreation(foundFolder.id ?? '');
          return { finished: true };
        }
        else return await this.handleSync(foundFile);
      }
    }, `Erro ao sincronizar banco de dados com o Google Drive`);
  }

  private async handleSync(
    foundFile: drive_v3.Schema$File
  ): Promise<{ finished: boolean }> {
    console.log('Sincronizando...')

    const localFileHash = await this.getFileHashUseCase.execute(DATABASE_FILE_NAME);
    const lastSyncHash: string = await this.getLocalLastSyncHash();

    const syncSituation: SyncSituationEnum = compareHashes(
      localFileHash,
      foundFile.md5Checksum ?? '',
      lastSyncHash
    );

    console.log('syncSituation', syncSituation)

    switch (syncSituation) {
      case SyncSituationEnum.NOTHING_CHANGED: {
        console.log('Nenhuma alteração a ser salva')
        return { finished: true };
      }

      case SyncSituationEnum.LOCAL_WORK: {
        await this.handleLocalWork(foundFile.id ?? '', localFileHash);
        return { finished: true };
      }

      case SyncSituationEnum.REMOTE_WORK: {
        await this.handleRemoteWork(foundFile);
        return { finished: true };
      }

      case SyncSituationEnum.CONFLICT: {
        await this.handleConflict(foundFile.id ?? '');
        return { finished: false };
      }
    }
  }

  private async handleLocalWork(
    foundFileId: string,
    localFileHash: string
  ) {
    console.log('Trabalho local. Fazendo upload...')
    await this.updateCloudDatabaseFileUseCase.execute(foundFileId, localFileHash);
  }

  private async handleRemoteWork(
    foundFile: drive_v3.Schema$File
  ) {
    console.log('Trabalho remoto. Fazendo download...')
    await this.downloadCloudDatabaseFileUseCase.execute(foundFile.id ?? '', foundFile.md5Checksum ?? '');
  }

  private async handleConflict(cloudFileId: string) {
    console.log('Conflito entre local e nuvem. Perguntando ao usuário...');

    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send('google-sync-conflict', { cloudFileId });
    });
  }

  private async handleNewFolder(): Promise<void> {
    console.log('Criando nova pasta...')
    const createdFolder: drive_v3.Schema$File = await this.createFolder();

    await this.handleFileCreation(createdFolder.id ?? '');
  }

  private async handleFileCreation(createdFolderId: string): Promise<void> {
    console.log('Criando arquivo...')
    await this.createFile(createdFolderId);

    const localFileHash = await this.getFileHashUseCase.execute(DATABASE_FILE_NAME);
    await this.saveLastSyncHashUseCase.execute(localFileHash);
  }

  private async getFile(folderId: string): Promise<drive_v3.Schema$File | null> {
    const databaseFile: drive_v3.Schema$File | null = await this.findGoogleFileByNameUseCase.execute({
      name: DATABASE_FILE_NAME,
      parentId: folderId,
      folder: false,
      fields: ['md5Checksum', 'modifiedTime']
    })
      .catch((error: IpcError) => {
        if (error instanceof NotFoundError) return null
        else throw error;
      });

    return databaseFile;
  }

  private async getFolder(): Promise<drive_v3.Schema$File | null> {
    const folder: drive_v3.Schema$File | null = await this.findGoogleFileByNameUseCase.execute({
      name: GOOGLE_DRIVE_FOLDER_NAME,
      folder: true
    })
      .catch(async (error: IpcError) => {
        if (error instanceof NotFoundError) return null;
        else throw error;
      });

    return folder;
  }

  private async createFolder(): Promise<drive_v3.Schema$File> {
    return await this.createGooldeFolderUseCase.execute(GOOGLE_DRIVE_FOLDER_NAME);
  }

  private async createFile(folderId: string): Promise<drive_v3.Schema$File> {
    const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);

    const media = {
      mimeType: 'application/x-sqlite3',
      body: fs.createReadStream(databaseFilePath)
    };

    const response = await this.googleDriveClient.files.create({
      auth: this.oAuth2Client,
      requestBody: {
        name: DATABASE_FILE_NAME,
        parents: [folderId]
      },
      media: media,
      fields: 'id'
    });

    return response.data;
  }

  private async getLocalLastSyncHash(): Promise<string> {
    const fileContent = await this.readFileUseCase.execute(LAST_SYNC_HASH_FILE_NAME);

    if (!fileContent) {
      return await this.getFileHashUseCase.execute(DATABASE_FILE_NAME);
    } else {
      const lastSyncHashFileDto: LastSyncHashFileDto = plainToInstance(LastSyncHashFileDto, JSON.parse(fileContent));
      const errors = await validate(lastSyncHashFileDto);
      if (errors.length > 0) {
        return await this.getFileHashUseCase.execute(DATABASE_FILE_NAME);
      }
      else return lastSyncHashFileDto.lastSyncHash;
    }
  }
}