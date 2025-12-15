import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface';

// Custom APIs for renderer
const api: ContextBridgeApi = {
  tasks: {
    findAll: () => ipcRenderer.invoke('tasks:findAll'),
    create: (title: string) => ipcRenderer.invoke('tasks:create', title),
    toggle: (id: number) => ipcRenderer.invoke('tasks:toggle', id),
    delete: (id: number) => ipcRenderer.invoke('tasks:delete', id),
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
