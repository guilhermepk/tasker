import { tryCatch } from "@main/common/utils/try-catch";
import { Injectable } from "@nestjs/common";
import crypto from 'crypto';
import fs from 'fs';

@Injectable()
export class GetFileHashUseCase {
  constructor(){}

  async execute(filePath: string): Promise<string> {
    return await tryCatch(async () => {
      return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        const stream = fs.createReadStream(filePath); 

        stream.on('data', (data) => hash.update(data));

        stream.on('end', () => resolve(hash.digest('hex')));

        stream.on('error', (error) => reject(error));
      });
    }, `Erro ao calcular hash do arquivo ${filePath}`);
  }
}