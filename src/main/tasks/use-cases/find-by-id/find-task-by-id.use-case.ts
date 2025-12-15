import { TaskEntity } from "../../models/entities/task.entity";
import { TasksTypeOrmRepository } from "../../tasks.repository";
import { Injectable } from "@nestjs/common";
import { NotFoundError } from "@shared/models/errors/not-found.error";
import { tryCatch } from "../../../common/utils/try-catch";
import { Inject } from "@nestjs/common";

@Injectable()
export class FindTaskByIdUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
  ){}

  async execute(id: number): Promise<TaskEntity> {
    return await tryCatch(async () => {
      const foundTask: TaskEntity | null = await this.repository.findById(id);
      if (!foundTask) {
        throw new NotFoundError('Tarefa não encontrada');
      }
      return foundTask;
    }, 'Erro ao buscar tarefa');
  }
}