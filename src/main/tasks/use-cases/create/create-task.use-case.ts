import { TaskEntity } from "../../models/entities/task.entity";
import { CreateTaskDto } from "../../models/dtos/create-task.dto";
import { TasksTypeOrmRepository } from '../../tasks.repository';
import { Injectable } from "@nestjs/common";
import { tryCatch } from "../../../common/utils/try-catch";
import { Inject } from "@nestjs/common";

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
  ){}

  async execute(data: CreateTaskDto): Promise<TaskEntity> {
    return await tryCatch(async () => {
      const { title } = data;
      const task = new TaskEntity({ title });
      return this.repository.create(task);
    }, `Erro ao criar tarefa`);
  }
}