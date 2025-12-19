export class TaskInFindAllTasksResponse {
  id: number;
  title: string;
  completed: boolean;
  childrenTasks: TaskInFindAllTasksResponse[];
  content: string;
}

export class FindAllTasksResponse {
  tasks: TaskInFindAllTasksResponse[];
}