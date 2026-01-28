import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { StartGoogleAuthUseCase } from "./start-google-auth.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerStartGoogleAuthIpc(){
  async function handler(
    useCase: StartGoogleAuthUseCase
  ): Promise<IpcResponse<null>> {
    await useCase.execute()

    return {
      success: true,
      data: null
    }
  }

  createIpcHandler(
    'google/start-auth',
    handler,
    {
      useCaseClass: StartGoogleAuthUseCase
    }
  );
}