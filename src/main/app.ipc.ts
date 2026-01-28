import { registerApisIpc } from "./apis/apis.ipc";
import { registerTasksIpc } from "./tasks/tasks.ipc";

export function registerNestAppIpc() {
  registerTasksIpc();
  registerApisIpc();
}