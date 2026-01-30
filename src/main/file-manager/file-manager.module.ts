import { Module } from "@nestjs/common";
import { SaveFileUseCase } from "./use-cases/save/save-file.use-case";
import { ReadFileUseCase } from "./use-cases/read/read-file.use-case";

@Module({
  providers: [
    SaveFileUseCase,
    ReadFileUseCase
  ],
  exports: [
    SaveFileUseCase,
    ReadFileUseCase
  ]
})
export class FileManagerModule {}