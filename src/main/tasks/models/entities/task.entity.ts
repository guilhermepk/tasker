import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "../../../users/models/entities/user.entity";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  completed: boolean;

  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;
}