import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { CreateTaskDto } from "../../models/dtos/create-task.dto";
import createIpcHandler from '../../../common/utils/create-ipc-handler';
import { CreateTaskUseCase } from "./create-task.use-case";

export function registerCreateTaskIpc(): void {
  async function handler(
    payload: CreateTaskDto,
    useCase: CreateTaskUseCase
  ): Promise<IpcResponse<{ message: string }>> {
    await useCase.execute(payload)
    return {
      success: true,
      data: {
        message: 'Tarefa criada com sucesso'
      }
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