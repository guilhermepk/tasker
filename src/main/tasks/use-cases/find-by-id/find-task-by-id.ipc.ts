import { FindTaskByIdDto } from "@main/tasks/models/dtos/find-task-by-id.dto";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { FindTaskByIdResponse } from "@shared/models/responses/tasks/find-task-by-id.response";
import { FindTaskByIdUseCase } from "./find-task-by-id.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerFindTaskByIdIpc(): void {
  async function handler(
    payload: FindTaskByIdDto,
    useCase: FindTaskByIdUseCase
  ): Promise<IpcResponse<FindTaskByIdResponse>> {
    return {
      success: true,
      data: await useCase.execute(payload.id)
    };
  }

  createIpcHandler(
    'tasks/find-by-id',
    handler,
    {
      dtoClass: FindTaskByIdDto,
      useCaseClass: FindTaskByIdUseCase,
      guards: []
    }
  );
}