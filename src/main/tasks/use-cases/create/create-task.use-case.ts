import { TaskEntity } from "../../models/entities/task.entity";
import { CreateTaskDto } from "../../models/dtos/create-task.dto";
import { TasksTypeOrmRepository } from '../../tasks.repository';
import { Injectable } from "@nestjs/common";
import { tryCatch } from "../../../common/utils/try-catch";
import { Inject } from "@nestjs/common";
import { FindTaskByIdUseCase } from "../find-by-id/find-task-by-id.use-case";

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
    @Inject(FindTaskByIdUseCase)
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase
  ){}

  async execute(data: CreateTaskDto): Promise<TaskEntity> {
    return await tryCatch(async () => {
      const { title, fatherTaskId } = data;

      const fatherTask: TaskEntity | undefined = fatherTaskId ? await this.findTaskByIdUseCase.execute(fatherTaskId) : undefined;

      const task = new TaskEntity({ title, fatherTask });
      return await this.repository.create(task);
    }, `Erro ao criar tarefa`);
  }
}