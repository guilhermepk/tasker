import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  completed: boolean;
}