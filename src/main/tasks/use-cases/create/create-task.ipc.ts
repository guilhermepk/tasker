import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { CreateTaskDto } from "../../models/dtos/create-task.dto";
import createIpcHandler from '../../../common/utils/create-ipc-handler';
import { CreateTaskUseCase } from "./create-task.use-case";
import { CreateTaskResponse } from "@shared/models/responses/tasks/create-task.response";

export function registerCreateTaskIpc(): void {
  async function handler(
    payload: CreateTaskDto,
    useCase: CreateTaskUseCase
  ): Promise<IpcResponse<CreateTaskResponse>> {
    return {
      success: true,
      data: await useCase.execute(payload)
    }
  }

  createIpcHandler(
    'tasks:create',
    handler,
    {
      dtoClass: CreateTaskDto,
      useCaseClass: CreateTaskUseCase,
      guards: []
    }
  );
}