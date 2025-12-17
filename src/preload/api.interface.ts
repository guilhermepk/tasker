import { CreateTaskDto } from "src/main/tasks/models/dtos/create-task.dto"
import { DeleteTaskDto } from "src/main/tasks/models/dtos/delete-task.dto"
import { UpdateTaskDto } from "src/main/tasks/models/dtos/update-task.dto"
import { IpcResponse } from "src/shared/models/interfaces/ipc-response.interface"
import { FindAllTasksResponse } from "src/shared/models/responses/tasks/find-all-tasks.response"
import { CreateTaskResponse } from "src/shared/models/responses/tasks/create-task.response"

export interface ContextBridgeApi {
    tasks: {
      findAll: () => Promise<IpcResponse<FindAllTasksResponse>>
      create: (payload: CreateTaskDto) => Promise<IpcResponse<CreateTaskResponse>>
      update: (payload: UpdateTaskDto) => Promise<IpcResponse<{ message: string }>>
      delete: (payload: DeleteTaskDto) => Promise<IpcResponse<{ message: string }>>
    }
  }