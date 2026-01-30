import { tryCatch } from "@main/common/utils/try-catch";
import { SaveFileUseCase } from "@main/file-manager/use-cases/save/save-file.use-case";
import { SaveGoogleTokenDTO } from "@main/secure-data-manager/models/dtos/save-google-token.dto";
import { Inject, Injectable } from "@nestjs/common";
import { safeStorage } from "electron";

@Injectable()
export class SaveGoogleTokenUseCase {
  constructor(
    @Inject(SaveFileUseCase)
    private readonly saveFileUseCase: SaveFileUseCase
  ){}

  async execute(data: SaveGoogleTokenDTO){
    return await tryCatch(async () => {
      const stringData = JSON.stringify(data);

      const dataToSave: string =
        safeStorage.isEncryptionAvailable()
          ? safeStorage.encryptString(stringData).toString('hex')
          : stringData;


      await this.saveFileUseCase.execute(dataToSave, 'google-keys.txt')
    }, `Erro ao salvar token do Google`);
  }
}