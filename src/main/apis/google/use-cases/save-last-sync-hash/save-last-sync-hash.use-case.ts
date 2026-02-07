import { Inject, Injectable } from "@nestjs/common";
import { LastSyncHashFileDto } from "../../models/dto/last-sync-hash-file.dto";
import { SaveFileUseCase } from "@main/file-manager/use-cases/save/save-file.use-case";
import { LAST_SYNC_HASH_FILE_NAME } from "@main/common/constants";

@Injectable()
export class SaveLastSyncHashUseCase {
  constructor(
    @Inject(SaveFileUseCase)
    private readonly saveFileUseCase: SaveFileUseCase
  ) { }

  async execute(lastSyncHash: string): Promise<void> {
    const fileContent: LastSyncHashFileDto = {
      lastSyncHash: lastSyncHash
    }

    await this.saveFileUseCase.execute(JSON.stringify(fileContent), LAST_SYNC_HASH_FILE_NAME)
  }
}