import { IpcError } from "@shared/models/errors/ipc.error";

export default function formatIpcError(error: IpcError): string {
  let message = error.message;

  if (error.details && error.details.length > 0) {
    message += '\n\nDetalhes:\n';
    message += error.details.map((item, index) => `${index + 1}. ${item}`).join('\n');
  }

  return message;
}