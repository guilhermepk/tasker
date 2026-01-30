import { CreateTaskDto } from "src/main/tasks/models/dtos/create-task.dto"
import { DeleteTaskDto } from "src/main/tasks/models/dtos/delete-task.dto"
import { UpdateTaskDto } from "src/main/tasks/models/dtos/update-task.dto"
import { IpcResponse } from "src/shared/models/interfaces/ipc-response.interface"
import { FindAllTasksResponse } from "src/shared/models/responses/tasks/find-all-tasks.response"
import { CreateTaskResponse } from "src/shared/models/responses/tasks/create-task.response"
import { FindTaskByIdDto } from "@main/tasks/models/dtos/find-task-by-id.dto"
import { FindTaskByIdResponse } from "@shared/models/responses/tasks/find-task-by-id.response"
import { IsGoogleAuthAuthenticatedResponse } from "@shared/models/responses/google/is-google-auth-authenticated.response"

export interface ContextBridgeApi {
    tasks: {
      create: (payload: CreateTaskDto) => Promise<IpcResponse<CreateTaskResponse>>
      findAll: () => Promise<IpcResponse<FindAllTasksResponse>>
      findById: (payload: FindTaskByIdDto) => Promise<IpcResponse<FindTaskByIdResponse>>
      update: (payload: UpdateTaskDto) => Promise<IpcResponse<{ message: string }>>
      delete: (payload: DeleteTaskDto) => Promise<IpcResponse<{ message: string }>>
    },
    google: {
      startAuth: () => Promise<IpcResponse<null>>,
      isAuthenticated: () => Promise<IpcResponse<IsGoogleAuthAuthenticatedResponse>>,
      onAuthSuccess: (callback: (payload: { email: string | null }) => void) => (() => void)
    }
  }