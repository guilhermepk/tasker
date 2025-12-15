export class TaskInFindAllTasksResponse {
  id: number;
  title: string;
  completed: boolean;
}

export class FindAllTasksResponse {
  tasks: TaskInFindAllTasksResponse[];
}