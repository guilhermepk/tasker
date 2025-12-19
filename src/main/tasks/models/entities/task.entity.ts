import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("tasks")
export class TaskEntity {
  constructor(
    data: {
      title: string,
      fatherTask?: TaskEntity
    }
  ){
    Object.assign(this, data);
    this.completed = false;
  }

  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ type: 'text', nullable: false })
  title: string;

  @Column({ type: 'boolean', default: false, nullable: false })
  completed: boolean;

  @Column({ type: 'text', nullable: true })
  content?: string;

  // --{ RELAÇÕES }--

  @JoinColumn({ name: 'fk_father_task' })
  @ManyToOne(() => TaskEntity, fatherTask => fatherTask.childrenTasks, { nullable: true, onDelete: 'CASCADE' })
  fatherTask?: TaskEntity;

  @OneToMany(() => TaskEntity, childTask => childTask.fatherTask)
  childrenTasks: TaskEntity[];
}