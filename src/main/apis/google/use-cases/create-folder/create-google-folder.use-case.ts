import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { Auth, drive_v3 } from "googleapis";

@Injectable()
export class CreateGooldeFolderUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(drive_v3.Drive)
    private readonly googleDriveClient: drive_v3.Drive,
  ){}

  async execute(name: string){
    return await tryCatch(async () => {
      const response = await this.googleDriveClient.files.create({
      requestBody: {
        mimeType: 'application/vnd.google-apps.folder',
        name: name
      },
      fields: 'id',
      auth: this.oAuth2Client
    });

    return response.data;
    }, `Erro ao criar pasta no Google Drive`);
  }
}