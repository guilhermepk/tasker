import { IpcErrorCodes } from "../enums/ipc-error-codes.enum";
import { IpcError } from "./ipc.error";

export class BadGatewayError extends IpcError {
  constructor(
    readonly message: string,
    details?: string[]
  ) {
    super(IpcErrorCodes.BAD_GATEWAY, message, details);
  }
}