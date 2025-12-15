import { IpcErrorCodes } from '../enums/ipc-error-codes.enum';
import { IpcError } from "./ipc.error";

export class InternalError extends IpcError {
  constructor(
    readonly message: string,
    details?: string[]
  ) {
    super(IpcErrorCodes.INTERNAL, message, details);
  }
}