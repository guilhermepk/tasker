import { tryCatch } from "@main/common/utils/try-catch";
import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { Auth, drive_v3 } from "googleapis";
import { FindGoogleFileByNameDto } from "../../models/dto/find-file-by-bame.dto";

@Injectable()
export class FindGoogleFileByNameUseCase {
  constructor(
    @Inject(drive_v3.Drive)
    private readonly googleDriveClient: drive_v3.Drive,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client
  ){}

  async execute(data: FindGoogleFileByNameDto){
    return await tryCatch(async () => {
      const { name, folder } = data;

      const query = this.queryFactory(data);

      const fields = this.fieldsStringFactory(data);

      const searchObject: drive_v3.Params$Resource$Files$List = {
        q: query,
        spaces: 'drive',
        fields: fields,
        auth: this.oAuth2Client,
      };

      const response = await this.googleDriveClient.files.list(searchObject);

      const files = response.data.files;

      if (!files || files.length < 1) throw new NotFoundError(`${folder ? 'Pasta' : 'Arquivo'} ${name} não encontrado`);

      return files[0];
    }, `Erro ao buscar ${data.folder ? 'pasta' : 'arquivo'} ${data.name}`);
  }

  private queryFactory(
    data: FindGoogleFileByNameDto
  ): string{
    const { name, folder, parentId } = data;

    let query = `name = '${name}' and trashed = false`;

    if (folder) query += ` and mimeType = 'application/vnd.google-apps.folder'`;

    if (parentId) query += ` and '${parentId}' in parents`;

    return query;
  }

  private fieldsStringFactory(
    data: FindGoogleFileByNameDto
  ): string {
    const { fields } = data;

    if (!fields || fields.length < 1) return 'files(id)';
    else return `files(id, ${fields.join(', ')})`;
  }
}