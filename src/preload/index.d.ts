import { ElectronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface';

declare global {
  interface Window {
    electron: ElectronAPI
    api: ContextBridgeApi
  }
}