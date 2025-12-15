import { IpcError } from "../errors/ipc.error";

export type IpcResponse<DTO = unknown> =
  | { success: true; data: DTO; error?: never }
  | { success: false; data?: never; error: IpcError };