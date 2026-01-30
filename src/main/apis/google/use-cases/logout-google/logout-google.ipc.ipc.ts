import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { LogoutGoogleUseCase } from "./logout-google.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerLogoutGoogleIpc(){
  async function handler(
    useCase: LogoutGoogleUseCase
  ): Promise<IpcResponse<void>> {
    await useCase.execute();

    return {
      success: true,
      data: undefined
    };
  }

  createIpcHandler(
    'google/logout',
    handler,
    {
      useCaseClass: LogoutGoogleUseCase
    }
  );
}