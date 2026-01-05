import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { FindAllTasksUseCase } from "./find-all-tasks.use-case";
import { FindAllTasksResponse } from "@shared/models/responses/tasks/find-all-tasks.response";
import createIpcHandler from '../../../common/utils/create-ipc-handler';

export function registerFindAllTasksIpc(): void {
  async function handler(
    useCase: FindAllTasksUseCase
  ): Promise<IpcResponse<FindAllTasksResponse>> {
    return {
      success: true,
      data: { tasks: await useCase.execute() }
    }
  }

  createIpcHandler(
    'tasks:findAll',
    handler,
    {
      useCaseClass: FindAllTasksUseCase,
    }
  );
}