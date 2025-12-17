import { Injectable, Inject } from "@nestjs/common";
import { TasksTypeOrmRepository } from "../../tasks.repository";
import { UpdateTaskDto } from "../../models/dtos/update-task.dto";
import { TaskEntity } from "../../models/entities/task.entity";
import { tryCatch } from "../../../common/utils/try-catch";
import { FindTaskByIdUseCase } from "../find-by-id/find-task-by-id.use-case";

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TasksTypeOrmRepository)
    private readonly repository: TasksTypeOrmRepository,
    @Inject(FindTaskByIdUseCase)
    private readonly findTaskByIdUseCase: FindTaskByIdUseCase,
  ){}

  async execute(data: UpdateTaskDto): Promise<void> {
    return await tryCatch(async () => {
      const task: TaskEntity = await this.findTaskByIdUseCase.execute(data.id);
      
      const { fatherTaskId, ...updateData } = data;

      Object.assign(task, updateData);

      if (fatherTaskId !== undefined) {
        if (fatherTaskId === null) {
          task.fatherTask = null as any;
        } else {
          task.fatherTask = await this.findTaskByIdUseCase.execute(fatherTaskId);
        }
      }

      await this.repository.save(task);
    }, `Erro ao atualizar tarefa`);
  }
}
