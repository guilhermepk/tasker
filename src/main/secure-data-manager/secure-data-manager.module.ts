import { Module } from "@nestjs/common";
import { SaveGoogleTokenUseCase } from "./use-cases/save-google-token/save-google-token.use-case";
import { ReadGoogleTokenUseCase } from "./use-cases/read-google-token/read-google-token.use-case";
import { FileManagerModule } from "@main/file-manager/file-manager.module";

@Module({
  imports: [
    FileManagerModule
  ],
  providers: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase
  ],
  exports: [
    SaveGoogleTokenUseCase,
    ReadGoogleTokenUseCase
  ]
})
export class SecureDataManagerModule {}