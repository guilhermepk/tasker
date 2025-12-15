import { Injectable } from "@nestjs/common";
import { TasksTypeOrmRepository } from "../../tasks.repository";
import { ToggleTaskDto } from "../../models/dtos/toggle-task.dto";
import { TaskEntity } from "../../models/entities/task.entity";
import { tryCatch } from "../../../common/utils/try-catch";
import { FindTaskByIdUseCase } from "../find-by-id/find-task-by-id.use-case";
import { Inject } from "@nestjs/common";

@Injectable()
export class ToggleTaskUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
    @Inject(FindTaskByIdUseCase)
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase,
  ){}

  async execute(data: ToggleTaskDto): Promise<void> {
    return await tryCatch(async () => {
      const task: TaskEntity = await this.findTaskByIdUseCase.execute(data.id);

      task.completed = !task.completed;

      await this.repository.update(task);
    }, `Erro ao alternar tarefa`);
  }
}