import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './models/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class TasksModule { }