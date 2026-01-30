import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import fs from 'fs';
import path from 'path';
import { app } from "electron";

@Injectable()
export class DeleteFileUseCase {
  constructor(){}

  async execute(
    fileName: string
  ): Promise<void> {
    return await tryCatch(async () => {
      const filePath = path.join(app.getPath('userData'), fileName);

      if (fs.existsSync(filePath)) {  
        fs.unlinkSync(filePath);
      }
    }, `Erro ao deletar arquivo`);
  }
}