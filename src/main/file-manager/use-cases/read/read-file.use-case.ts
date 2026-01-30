import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import fs from 'fs';
import path from 'path';
import { app } from "electron";

@Injectable()
export class ReadFileUseCase {
  constructor(){}

  async execute(
    fileName: string
  ): Promise<string | null> {
    return await tryCatch(async () => {
      const filePath = path.join(app.getPath('userData'), fileName);

      if (!fs.existsSync(filePath)) return null;

      const data = fs.readFileSync(filePath, 'utf-8');
      return data;
    }, `Erro ao ler arquivo`);
  }
}