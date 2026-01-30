import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { IsGoogleAuthenticatedUseCase } from "./is-google-authenticated.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";
import { IsGoogleAuthAuthenticatedResponse } from "@shared/models/responses/google/is-google-auth-authenticated.response";

export function registerIsGoogleAuthenticatedIpc() {
  async function handler(
    useCase: IsGoogleAuthenticatedUseCase
  ): Promise<IpcResponse<IsGoogleAuthAuthenticatedResponse>> {
    return {
      success: true,
      data: await useCase.execute()
    }
  }

  createIpcHandler(
    'google/is-authenticated',
    handler,
    {
      useCaseClass: IsGoogleAuthenticatedUseCase
    }
  );
}