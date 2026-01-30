import { tryCatch } from "@main/common/utils/try-catch";
import { ReadFileUseCase } from "@main/file-manager/use-cases/read/read-file.use-case";
import { GoogleKeys } from "@main/secure-data-manager/models/types/google-keys.type";
import { Inject, Injectable } from "@nestjs/common";
import { safeStorage } from "electron";

@Injectable()
export class ReadGoogleTokenUseCase {
  constructor(
    @Inject(ReadFileUseCase)
    private readonly readFileUseCase: ReadFileUseCase
  ){}

  async execute(): Promise<GoogleKeys | null> {
    return await tryCatch(async () => {
      const data = await this.readFileUseCase.execute('google-keys.txt');

      if (!data) return null;

      const encryptedBuffer = Buffer.from(data, 'hex');
      const decryptedData: string = safeStorage.decryptString(encryptedBuffer);

      

      return JSON.parse(decryptedData) as GoogleKeys;
    }, `Erro ao ler token do google`);
  }
}