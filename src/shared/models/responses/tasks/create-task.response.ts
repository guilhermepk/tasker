export class CreateTaskResponse {
  id: number;
  title: string;
  completed: boolean;
  childrenTasks: CreateTaskResponse[];
  content: string;
}