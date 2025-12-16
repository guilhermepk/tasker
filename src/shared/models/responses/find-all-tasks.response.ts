export class TaskInFindAllTasksResponse {
  id: number;
  title: string;
  completed: boolean;
  childrenTasks: TaskInFindAllTasksResponse[];
}

export class FindAllTasksResponse {
  tasks: TaskInFindAllTasksResponse[];
}