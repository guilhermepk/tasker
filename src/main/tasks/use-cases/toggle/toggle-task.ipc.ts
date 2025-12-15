import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import createIpcHandler from "../../../common/utils/create-ipc-handler";
import { ToggleTaskDto } from "../../models/dtos/toggle-task.dto";
import { ToggleTaskUseCase } from "./toggle-task.use-case";

export function registerToggleTaskIpc(): void {
  async function handler(
    payload: ToggleTaskDto,
    useCase: ToggleTaskUseCase
  ): Promise<IpcResponse<{ message: string }>> {
    await useCase.execute(payload);
    return {
      success: true,
      data: {
        message: 'Tarefa alternada com sucesso'
      }
    }
  }

  createIpcHandler(
    'tasks:toggle',
    handler,
    {
      dtoClass: ToggleTaskDto,
      useCaseClass: ToggleTaskUseCase,
    }
  );
}