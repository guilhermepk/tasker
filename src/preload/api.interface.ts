import { CreateTaskDto } from "@main/tasks/models/dtos/create-task.dto"
import { DeleteTaskDto } from "@main/tasks/models/dtos/delete-task.dto"
import { ToggleTaskDto } from "@main/tasks/models/dtos/toggle-task.dto"
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"
import { FindAllTasksResponse } from "@shared/models/responses/tasks/find-all-tasks.response"
import { CreateTaskResponse } from "@shared/models/responses/tasks/create-task.response"

export interface ContextBridgeApi {
    tasks: {
      findAll: () => Promise<IpcResponse<FindAllTasksResponse>>
      create: (payload: CreateTaskDto) => Promise<IpcResponse<CreateTaskResponse>>
      toggle: (payload: ToggleTaskDto) => Promise<IpcResponse<{ message: string }>>
      delete: (payload: DeleteTaskDto) => Promise<IpcResponse<{ message: string }>>
    }
  }