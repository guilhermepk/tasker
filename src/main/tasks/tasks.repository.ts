import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TaskEntity } from "./models/entities/task.entity";
import { DeleteResult } from "typeorm/browser";
import { UpdateResult } from "typeorm/browser";

export class TasksTypeOrmRepository {
  constructor(
    @InjectRepository(TaskEntity)
    private repository: Repository<TaskEntity>,
  ) {}

  async create(task: TaskEntity): Promise<TaskEntity> {
    return await this.repository.save(task);
  }

  async delete(task: TaskEntity): Promise<DeleteResult> {
    return await this.repository.delete(task);
  }

  async findById(id: number): Promise<TaskEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<TaskEntity[]> {    
    const result = await this.repository.find({
      order: {
        id: 'ASC',
      },
    });

    return result;
  }

  async update(newTaskData: TaskEntity): Promise<UpdateResult> {
    return await this.repository.update({ id: newTaskData.id }, newTaskData);
  }
}