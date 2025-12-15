import { registerCreateTaskIpc } from "./use-cases/create/create-task.ipc";
import { registerFindAllTasksIpc } from "./use-cases/find-all/find-all-tasks.ipc";
import { registerToggleTaskIpc } from "./use-cases/toggle/toggle-task.ipc";
import { registerDeleteTaskIpc } from "./use-cases/delete/delete-task.ipc";

export function registerTasksIpc() {
  registerCreateTaskIpc();
  registerFindAllTasksIpc();
  registerToggleTaskIpc();
  registerDeleteTaskIpc();
}