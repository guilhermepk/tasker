import createIpcHandler from "../../../common/utils/create-ipc-handler";
import { DeleteTaskDto } from "../../models/dtos/delete-task.dto";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { DeleteTaskUseCase } from "./delete-task.use-case";

export function registerDeleteTaskIpc() {
  async function handler(
    payload: DeleteTaskDto,
    useCase: DeleteTaskUseCase
  ): Promise<IpcResponse<{ message: string }>> {
    await useCase.execute(payload);
    return {
      success: true,
      data: {
        message: 'Tarefa removida com sucesso'
      }
    };
  }

  createIpcHandler(
    'tasks:delete',
    handler,
    {
      dtoClass: DeleteTaskDto,
      useCaseClass: DeleteTaskUseCase
    }
  );
}