import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface';
import { CreateTaskDto } from '@main/tasks/models/dtos/create-task.dto';
import { UpdateTaskDto } from '@main/tasks/models/dtos/update-task.dto';
import { DeleteTaskDto } from '@main/tasks/models/dtos/delete-task.dto';
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface';
import { FindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response';
import { CreateTaskResponse } from '@shared/models/responses/tasks/create-task.response';

const api: ContextBridgeApi = {
  tasks: {
    findAll: (): Promise<IpcResponse<FindAllTasksResponse>> => ipcRenderer.invoke('tasks:findAll'),
    create: (payload: CreateTaskDto): Promise<IpcResponse<CreateTaskResponse>> => ipcRenderer.invoke('tasks:create', payload),
    update: (payload: UpdateTaskDto): Promise<IpcResponse<{ message: string }>> => ipcRenderer.invoke('tasks:update', payload),
    delete: (payload: DeleteTaskDto): Promise<IpcResponse<{ message: string }>> => ipcRenderer.invoke('tasks:delete', payload),
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
