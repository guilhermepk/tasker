import { Module } from "@nestjs/common";
import { SaveFileUseCase } from "./use-cases/save/save-file.use-case";
import { ReadFileUseCase } from "./use-cases/read/read-file.use-case";
import { DeleteFileUseCase } from "./use-cases/delete/delete-file.use-case";

@Module({
  providers: [
    SaveFileUseCase,
    ReadFileUseCase,
    DeleteFileUseCase
  ],
  exports: [
    SaveFileUseCase,
    ReadFileUseCase,
    DeleteFileUseCase
  ]
})
export class FileManagerModule {}