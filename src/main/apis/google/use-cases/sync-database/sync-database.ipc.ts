import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { SyncDatabaseUseCase } from "./sync-database.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerSyncDatabaseIpc(){
  async function handler(
    useCase: SyncDatabaseUseCase,
  ): Promise<IpcResponse<void>> {
    await useCase.execute();

    return {
      success: true,
      data: undefined
    };
  }

  createIpcHandler(
    'google/sync-database',
    handler,
    {
      useCaseClass: SyncDatabaseUseCase
    }
  );
}