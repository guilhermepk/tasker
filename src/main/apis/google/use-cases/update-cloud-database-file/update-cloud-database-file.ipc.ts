import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { UpdateCloudDatabaseFileDto } from '../../models/dto/update-cloud-database-file.dto'
import { UpdateCloudDatabaseFileUseCase } from './update-cloud-database-file.use-case'
import createIpcHandler from '@main/common/utils/create-ipc-handler'

export function registerUpdateCloudDatabaseFileIpc() {
  async function handler(
    payload: UpdateCloudDatabaseFileDto,
    useCase: UpdateCloudDatabaseFileUseCase
  ): Promise<IpcResponse<void>> {
    await useCase.execute(payload.cloudFileId)

    return {
      success: true,
      data: undefined
    }
  }

  createIpcHandler(
    'google/update-cloud-database-file',
    handler,
    {
      dtoClass: UpdateCloudDatabaseFileDto,
      useCaseClass: UpdateCloudDatabaseFileUseCase
    }
  )
}
