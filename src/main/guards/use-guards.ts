import { IpcResponse } from "../../shared/models/interfaces/ipc-response.interface";
import { handleError } from "../common/utils/try-catch";
import { IpcGuard } from "./models/types/ipc-guard";

export async function useGuards(
  guards: Array<IpcGuard>
): Promise<void | IpcResponse<never>> {
  for (const guard of guards) {
    try {
      await guard();
    } catch (error: any) {
      return handleError(error, { handleType: 'return', uncaughtErrorMessage: `Erro ao executar guard ${guard}` })
    }
  }
}