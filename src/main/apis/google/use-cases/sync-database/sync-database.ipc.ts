import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { SyncDatabaseUseCase } from "./sync-database.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";
import { SyncDatabaseResponse } from "@shared/models/responses/google/sync-database.response";

export function registerSyncDatabaseIpc(){
  async function handler(
    useCase: SyncDatabaseUseCase,
  ): Promise<IpcResponse<SyncDatabaseResponse>> {
    const result = await useCase.execute();

    return {
      success: true,
      data: result
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