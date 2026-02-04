import { Module } from "@nestjs/common";
import { SaveFileUseCase } from "./use-cases/save/save-file.use-case";
import { ReadFileUseCase } from "./use-cases/read/read-file.use-case";
import { DeleteFileUseCase } from "./use-cases/delete/delete-file.use-case";
import { GetFileHashUseCase } from "./use-cases/get-file-hash/get-file-hash.use-case";

@Module({
  providers: [
    SaveFileUseCase,
    ReadFileUseCase,
    DeleteFileUseCase,
    GetFileHashUseCase
  ],
  exports: [
    SaveFileUseCase,
    ReadFileUseCase,
    DeleteFileUseCase,
    GetFileHashUseCase
  ]
})
export class FileManagerModule {}