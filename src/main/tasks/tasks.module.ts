import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './models/entities/task.entity';
import { TasksTypeOrmRepository } from './tasks.repository';
import { CreateTaskUseCase } from './use-cases/create/create-task.use-case';
import { FindTaskByIdUseCase } from './use-cases/find-by-id/find-task-by-id.use-case';
import { DeleteTaskUseCase } from './use-cases/delete/delete-task.use-case';
import { UpdateTaskUseCase } from './use-cases/update/update-task.use-case';
import { FindAllTasksUseCase } from './use-cases/find-all/find-all-tasks.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [],
  providers: [
    TasksTypeOrmRepository,
    CreateTaskUseCase,
    FindTaskByIdUseCase,
    DeleteTaskUseCase,
    UpdateTaskUseCase,
    FindAllTasksUseCase
  ],
  exports: [],
})
export class TasksModule { }