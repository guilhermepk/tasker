import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { DownloadCloudDatabaseFileDto } from "../../models/dto/download-cloud-database-file.dto";
import { DownloadCloudDatabaseFileUseCase } from "./download-cloud-database-file.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerDownloadCloudDatabaseFileIpc() {
  async function handler(
    payload: DownloadCloudDatabaseFileDto,
    useCase: DownloadCloudDatabaseFileUseCase
  ): Promise<IpcResponse<void>> {
    await useCase.execute(payload.cloudFileId);

    return {
      success: true,
      data: undefined
    };
  }

  createIpcHandler(
    'google/download-cloud-database-file',
    handler,
    {
      dtoClass: DownloadCloudDatabaseFileDto,
      useCaseClass: DownloadCloudDatabaseFileUseCase
    }
  );
}