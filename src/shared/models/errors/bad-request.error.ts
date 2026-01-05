import { IpcErrorCodes } from "../enums/ipc-error-codes.enum";
import { IpcError } from "./ipc.error";

export class BadRequestError extends IpcError {
  constructor(
    readonly message: string,
    details?: string[]
  ) {
    super(IpcErrorCodes.BAD_REQUEST, message, details);
  }
}