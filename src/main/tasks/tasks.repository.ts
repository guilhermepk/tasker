import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
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
    return await this.repository.delete({ id: task.id });
  }

  async findById(id: number): Promise<TaskEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findAll(): Promise<TaskEntity[]> {
    const tasks = await this.repository.find({
      relations: {
        fatherTask: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const map = new Map<number, TaskEntity & { childrenTasks: TaskEntity[] }>();

    tasks.forEach(task => {
      map.set(task.id, { ...task, childrenTasks: [] });
    });

    const roots: TaskEntity[] = [];

    map.forEach(task => {
      if (task.fatherTask?.id) {
        const parent = map.get(task.fatherTask.id);
        parent?.childrenTasks.push(task);
      } else {
        roots.push(task);
      }
    });

    return roots;
  }


  async update(newTaskData: TaskEntity): Promise<UpdateResult> {
    return await this.repository.update({ id: newTaskData.id }, newTaskData);
  }
}