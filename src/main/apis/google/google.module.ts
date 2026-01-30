import { Module } from "@nestjs/common";
import { Auth } from "googleapis";
import { StartGoogleAuthUseCase } from "./use-cases/start-auth/start-google-auth.use-case";
import * as dotenv from 'dotenv';
import { SecureDataManagerModule } from "@main/secure-data-manager/secure-data-manager.module";
import { IsGoogleAuthenticatedUseCase } from "./use-cases/is-authenticated/is-google-authenticated.use-case";

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
    IsGoogleAuthenticatedUseCase
  ]
})
export class GoogleModule {}