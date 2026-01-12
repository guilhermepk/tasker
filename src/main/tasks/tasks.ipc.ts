import { registerCreateTaskIpc } from "./use-cases/create/create-task.ipc";
import { registerFindAllTasksIpc } from "./use-cases/find-all/find-all-tasks.ipc";
import { registerUpdateTaskIpc } from "./use-cases/update/update-task.ipc";
import { registerDeleteTaskIpc } from "./use-cases/delete/delete-task.ipc";
import { registerFindTaskByIdIpc } from "./use-cases/find-by-id/find-task-by-id.ipc";

export function registerTasksIpc() {
  registerCreateTaskIpc();
  registerFindAllTasksIpc();
  registerUpdateTaskIpc();
  registerDeleteTaskIpc();
  registerFindTaskByIdIpc();
}