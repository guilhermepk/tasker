import { Inject, Injectable } from "@nestjs/common";
import { TasksTypeOrmRepository } from "@main/tasks/tasks.repository";
import { TaskEntity } from "@main/tasks/models/entities/task.entity";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { tryCatch } from "@main/common/utils/try-catch";

@Injectable()
export class FindAllTasksUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
  ){}

  async execute(): Promise<TaskEntity[]> {
    return await tryCatch(async () => {
      const foundTasks: TaskEntity[] = await this.repository.findAll();
      if (!foundTasks) {
        throw new NotFoundError('Nenhuma tarefa encontrada');
      }

      return foundTasks;
    }, 'Erro ao buscar tarefas');
  }
}