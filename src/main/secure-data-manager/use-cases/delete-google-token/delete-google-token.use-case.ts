import { tryCatch } from "@main/common/utils/try-catch";
import { DeleteFileUseCase } from "@main/file-manager/use-cases/delete/delete-file.use-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteGoogleTokenUseCase {
  constructor(
    @Inject(DeleteFileUseCase)
    private readonly deleteFileUseCase: DeleteFileUseCase
  ){}

  async execute(){
    return await tryCatch(async () => {
      await this.deleteFileUseCase.execute('google-keys.txt')
    }, `Erro ao deletar token do Google`);
  }
}