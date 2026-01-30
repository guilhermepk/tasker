import { Inject, Logger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { Auth } from "googleapis";
import { StartGoogleAuthUseCase } from "./use-cases/start-auth/start-google-auth.use-case";
import * as dotenv from 'dotenv';
import { SecureDataManagerModule } from "@main/secure-data-manager/secure-data-manager.module";
import { IsGoogleAuthenticatedUseCase } from "./use-cases/is-authenticated/is-google-authenticated.use-case";
import { LogoutGoogleUseCase } from "./use-cases/logout-google/logout-google.use-case";
import { ReadGoogleTokenUseCase } from "@main/secure-data-manager/use-cases/read-google-token/read-google-token.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { GoogleKeys } from "@main/secure-data-manager/models/types/google-keys.type";

dotenv.config();

@Module({
  imports: [
    SecureDataManagerModule
  ],
  providers: [
    StartGoogleAuthUseCase,
    {
      provide: Auth.OAuth2Client,
      useFactory: () => {
        return new Auth.OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:3000' // Porta local temporária
        );
      }
    },
    IsGoogleAuthenticatedUseCase,
    LogoutGoogleUseCase
  ]
})
export class GoogleModule implements OnApplicationBootstrap {
  logger: Logger

  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(ReadGoogleTokenUseCase)
    private readonly readGoogleTokenUseCase: ReadGoogleTokenUseCase
  ){
    this.logger = new Logger(GoogleModule.name);
  }

  async onApplicationBootstrap() {
    await tryCatch(async () => {
      const googleKeys: GoogleKeys | null = await this.readGoogleTokenUseCase.execute();

      if (googleKeys) {
        this.oAuth2Client.setCredentials({
          access_token: googleKeys.accessToken,
          refresh_token: googleKeys.refreshToken
        });
        this.logger.log('Google autenticado');
      } else {
        this.logger.log('Google não autenticado');
      }
    }, `Erro ao inicializar credenciais do Google`)
      .catch((error) => {
        this.logger.error(error);
      });
  }
}