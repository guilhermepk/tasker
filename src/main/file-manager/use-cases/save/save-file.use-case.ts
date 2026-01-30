import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import fs from 'fs';
import path from 'path';
import { app } from "electron";

@Injectable()
export class SaveFileUseCase {
  constructor(){}

  async execute(
    stringData: string,
    fileName: string
  ): Promise<void> {
    return await tryCatch(async () => {
      const FILE_PATH = path.join(app.getPath('userData'), fileName);

      console.log('Salvando arquivo... [' + FILE_PATH + ']');

      fs.writeFileSync(FILE_PATH, stringData);
    }, `Erro ao salvar arquivo`);
  }
}