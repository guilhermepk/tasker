import { IpcErrorCodes } from "../enums/ipc-error-codes.enum";
import { IpcError } from "./ipc.error";

export class NotImplementedError extends IpcError {
  constructor(
    readonly message: string,
    readonly details?: string[]
  ){
    super(IpcErrorCodes.NOT_IMPLEMENTED, message, details);
  }
}