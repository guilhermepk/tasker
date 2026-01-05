import { DeleteTaskDto } from "@main/tasks/models/dtos/delete-task.dto";
import { TaskEntity } from "@main/tasks/models/entities/task.entity";
import { TasksTypeOrmRepository } from "@main/tasks/tasks.repository";
import { Injectable } from "@nestjs/common";
import { FindTaskByIdUseCase } from "../find-by-id/find-task-by-id.use-case";
import { tryCatch } from "@main/common/utils/try-catch";
import { Inject } from "@nestjs/common";
  
@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
    @Inject(FindTaskByIdUseCase)
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase
  ){}

  async execute(data: DeleteTaskDto): Promise<void> {
    return await tryCatch(async () => {
      const task: TaskEntity = await this.findTaskByIdUseCase.execute(data.id);

      await this.repository.delete(task);
    }, 'Erro ao deletar tarefa');
  }
}