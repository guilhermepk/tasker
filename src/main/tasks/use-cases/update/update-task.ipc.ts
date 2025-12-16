import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import createIpcHandler from "../../../common/utils/create-ipc-handler";
import { UpdateTaskDto } from "../../models/dtos/update-task.dto";
import { UpdateTaskUseCase } from "./update-task.use-case";

export function registerUpdateTaskIpc(): void {
  async function handler(
    payload: UpdateTaskDto,
    useCase: UpdateTaskUseCase
  ): Promise<IpcResponse<{ message: string }>> {
    await useCase.execute(payload);
    return {
      success: true,
      data: {
        message: 'Tarefa atualizada com sucesso'
      }
    }
  }

  createIpcHandler(
    'tasks:update',
    handler,
    {
      dtoClass: UpdateTaskDto,
      useCaseClass: UpdateTaskUseCase,
    }
  );
}
