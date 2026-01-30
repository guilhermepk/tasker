import { tryCatch } from "@main/common/utils/try-catch";
import { GoogleKeys } from "@main/secure-data-manager/models/types/google-keys.type";
import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/read-google-token/read-google-token.use-case";
import { Inject, Injectable } from "@nestjs/common";
import { IsGoogleAuthAuthenticatedResponse } from "@shared/models/responses/google/is-google-auth-authenticated.response";
import { Auth } from "googleapis";

@Injectable()
export class IsGoogleAuthenticatedUseCase {
  constructor(
    @Inject(ReadGoogleTokenUseCase)
    private readonly readGoogleTokenUseCase: ReadGoogleTokenUseCase,

    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,
  ){}

  async execute(): Promise<IsGoogleAuthAuthenticatedResponse> {
    return await tryCatch(async () => {
      const googleKeys: GoogleKeys | null = await this.readGoogleTokenUseCase.execute();

      if (!googleKeys) return { isAuthenticated: false, email: null };

      const tokenInfo = await this.oAuth2Client.getTokenInfo(googleKeys.accessToken)
        .catch(() => null);

      if (!tokenInfo) {
        return { isAuthenticated: false, email: null };
      } else {
        return { isAuthenticated: true, email: tokenInfo.email ?? null };
      }
    }, `Erro ao verificar autenticação com o Google`);
  }
}