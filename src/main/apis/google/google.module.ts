import { Module } from "@nestjs/common";
import { Auth } from "googleapis";
import { StartGoogleAuthUseCase } from "./use-cases/start-auth/start-google-auth.use-case";
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
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
    }
  ]
})
export class GoogleModule {}