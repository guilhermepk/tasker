import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface';
import { CreateTaskDto } from '@main/tasks/models/dtos/create-task.dto';
import { UpdateTaskDto } from '@main/tasks/models/dtos/update-task.dto';
import { DeleteTaskDto } from '@main/tasks/models/dtos/delete-task.dto';
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface';
import { FindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response';
import { CreateTaskResponse } from '@shared/models/responses/tasks/create-task.response';
import { FindTaskByIdDto } from '@main/tasks/models/dtos/find-task-by-id.dto';
import { FindTaskByIdResponse } from '@shared/models/responses/tasks/find-task-by-id.response';
import { IsGoogleAuthAuthenticatedResponse } from '@shared/models/responses/google/is-google-auth-authenticated.response';
import { SyncDatabaseResponse } from '@shared/models/responses/google/sync-database.response';

const api: ContextBridgeApi = {
  tasks: {
    findAll: (): Promise<IpcResponse<FindAllTasksResponse>> => ipcRenderer.invoke('tasks:findAll'),
    findById: (payload: FindTaskByIdDto): Promise<IpcResponse<FindTaskByIdResponse>> => ipcRenderer.invoke('tasks/find-by-id', payload),
    create: (payload: CreateTaskDto): Promise<IpcResponse<CreateTaskResponse>> => ipcRenderer.invoke('tasks:create', payload),
    update: (payload: UpdateTaskDto): Promise<IpcResponse<{ message: string }>> => ipcRenderer.invoke('tasks:update', payload),
    delete: (payload: DeleteTaskDto): Promise<IpcResponse<{ message: string }>> => ipcRenderer.invoke('tasks:delete', payload),
  },
  google: {
    startAuth: (): Promise<IpcResponse<null>> => ipcRenderer.invoke('google/start-auth'),
    isAuthenticated: (): Promise<IpcResponse<IsGoogleAuthAuthenticatedResponse>> => ipcRenderer.invoke('google/is-authenticated'),
    onAuthSuccess(callback: (payload: { email: string }) => void){
      const subscription = (_event, payload) => callback(payload);
      ipcRenderer.on('google-auth-success', subscription);
      return () => ipcRenderer.removeListener('google-auth-success', subscription);
    },
    onLogoutSuccess: (callback: () => void) => {
      const subscription = (_event) => callback();
      ipcRenderer.on('google-logout-success', subscription);
      return () => ipcRenderer.removeListener('google-logout-success', subscription);
    },
    logout: () => ipcRenderer.invoke('google/logout'),
    syncDatabase: (): Promise<IpcResponse<SyncDatabaseResponse>> => ipcRenderer.invoke('google/sync-database'),
    onSyncConflict: (callback: () => void) => {
      const subscription = (_event) => callback();
      ipcRenderer.on('google-sync-conflict', subscription);
      return () => ipcRenderer.removeListener('google-sync-conflict', subscription);
    },
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
