import { registerTasksIpc } from "./tasks/tasks.ipc";

export function registerNestAppIpc() {
  registerTasksIpc();
}