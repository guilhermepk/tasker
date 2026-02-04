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
import { ReadFileUseCase } from "@main/file-manager/use-cases/read/read-file.use-case";
import { GetFileHashUseCase } from "@main/file-manager/use-cases/get-file-hash/get-file-hash.use-case";
import { LastSyncHashFileDto } from "../../models/dto/last-sync-hash-file.dto";
import { SyncSituationEnum } from "../../models/enums/sync-situation.enum";
import { DATABASE_FILE_NAME, GOOGLE_DRIVE_FOLDER_NAME, LAST_SYNC_HASH_FILE_NAME } from "@main/common/constants";
import { SaveFileUseCase } from "@main/file-manager/use-cases/save/save-file.use-case";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NotImplementedError } from "@shared/models/errors/not-implemented.error";

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

    @Inject(SaveFileUseCase)
    private readonly saveFileUseCase: SaveFileUseCase
  ){}

  async execute(){
    return await tryCatch(async () => {
      console.log('\nIniciando...')

      const foundFolder: drive_v3.Schema$File | null = await this.getFolder();

      if (!foundFolder) await this.handleNewFolder();
      else {
        const foundFile: drive_v3.Schema$File | null = await this.getFile(foundFolder.id ?? '');

        if (!foundFile) await this.handleFileCreation(foundFolder.id ?? '');
        else await this.handleSync(foundFile);
      }      
    }, `Erro ao sincronizar banco de dados com o Google Drive`);
  }

  private async handleSync(
    foundFile: drive_v3.Schema$File
  ): Promise<void> {
    console.log('Sincronizando...')

    const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);
    const localFileHash = await this.getFileHashUseCase.execute(databaseFilePath);
    const lastSyncHash: string = await this.getLocalLastSyncHash();

    const syncSituation: SyncSituationEnum = await this.compareHashes(
      localFileHash,
      foundFile.md5Checksum ?? '',
      lastSyncHash
    );

    switch (syncSituation) {
      case SyncSituationEnum.NOTHING_CHANGED: {
        console.log('Nenhuma alteração a ser salva')
        break;
      }

      case SyncSituationEnum.LOCAL_WORK: {
        console.log('Trabalho local. Fazendo upload...')
        await this.updateFile(foundFile.id ?? '');
        await this.saveLastSyncHash(localFileHash);
        break;
      }

      case SyncSituationEnum.REMOTE_WORK: {
        console.log('Trabalho remoto. Fazendo download...')
        await this.downloadAndReplaceLocalFile(foundFile.id ?? '');
        await this.saveLastSyncHash(foundFile.md5Checksum ?? '');
        break;
      }

      case SyncSituationEnum.CONFLICT: {
        console.log('Conflito entre local e nuvem')
        // perguntar ao usuário

        //se manter local
        //upload
        // atualizar lastSync

        // se manter remoto
        // download
        // atualizar lastSync

        throw new NotImplementedError(
          'Conflito detectado',
          [
            'Ambos os arquivos (local e nuvem) foram modificados',
            'Resolução manual ainda não implementada'
          ]
        );
      }
    }
  }

  private async downloadAndReplaceLocalFile(cloudFileId: string): Promise<void> {
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

  private async updateFile(
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

  private async handleNewFolder(): Promise<void> {
    console.log('Criando nova pasta...')
    const createdFolder: drive_v3.Schema$File = await this.createFolder();
    
    await this.handleFileCreation(createdFolder.id ?? '');
  }

  private async handleFileCreation(createdFolderId: string): Promise<void> {
    console.log('Criando arquivo...')
    await this.createFile(createdFolderId);
    
    const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);
    const localFileHash = await this.getFileHashUseCase.execute(databaseFilePath);
    await this.saveLastSyncHash(localFileHash);
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

  private async saveLastSyncHash(lastSyncHash: string): Promise<void> {
    console.log('Salvando lastSyncHash...')
    const fileContent: LastSyncHashFileDto = {
      lastSyncHash: lastSyncHash
    }

    await this.saveFileUseCase.execute(JSON.stringify(fileContent), LAST_SYNC_HASH_FILE_NAME)
  }

  private async getLocalLastSyncHash(): Promise<string> {
    const fileContent = await this.readFileUseCase.execute(LAST_SYNC_HASH_FILE_NAME);

    if (!fileContent) {
      const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);
      return await this.getFileHashUseCase.execute(databaseFilePath);
    } else {
      const lastSyncHashFileDto: LastSyncHashFileDto = plainToInstance(LastSyncHashFileDto, JSON.parse(fileContent));
      const errors = await validate(lastSyncHashFileDto);
      if (errors.length > 0) {
        const databaseFilePath = path.join(app.getPath('userData'), DATABASE_FILE_NAME);
        return await this.getFileHashUseCase.execute(databaseFilePath);
      }
      else return lastSyncHashFileDto.lastSyncHash;
    }
  }

  private async compareHashes(
    localFileHash: string,
    cloudFileHash: string,
    lastSynchronizedHash: string
  ): Promise<SyncSituationEnum> {
      // Cenário A: Nada mudou (Ocioso)
      if (
        localFileHash === lastSynchronizedHash
        &&
        cloudFileHash === lastSynchronizedHash
      ) return SyncSituationEnum.NOTHING_CHANGED;

      // Cenário B: Trabalho Local (Upload)
      else if (
        localFileHash !== lastSynchronizedHash
        &&
        cloudFileHash === lastSynchronizedHash
      ) return SyncSituationEnum.LOCAL_WORK;

      // Cenário C: Trabalho Remoto (Download)
      else if (
        localFileHash === lastSynchronizedHash
        &&
        cloudFileHash !== lastSynchronizedHash
      ) return SyncSituationEnum.REMOTE_WORK;

      // Cenário D: O Conflito Real (Perguntar ao usuário)
      // localFileHash !== lastSynchronizedHash
      // &&
      // cloudFileHash !== lastSynchronizedHash
      else return SyncSituationEnum.CONFLICT;
  }
}