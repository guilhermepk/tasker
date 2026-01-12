export interface FindTaskByIdResponse {
  id: number;
  title: string;
  completed: boolean;
  fatherTask?: FindTaskByIdResponse;
  childrenTasks?: FindTaskByIdResponse[];
}