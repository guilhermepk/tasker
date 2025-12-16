import { createSignal, createEffect } from 'solid-js'
import { TaskStats } from './components/TaskStats'

import { TaskList } from './components/TaskList'
import { FindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { TaskData } from './components/TaskItem'
import { CreateTaskResponse } from '@shared/models/responses/tasks/create-task.response'
import formatIpcError from '@renderer/utils/format-ipc-error'

export default function HomePage() {
  const [tasks, setTasks] = createSignal<TaskData[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [newTaskTitle, setNewTaskTitle] = createSignal('');

  async function fetchTasks(): Promise<void> {
    setLoading(true);

    const response: IpcResponse<FindAllTasksResponse> = await window.api.tasks.findAll();

    if (response.success) {
      const tasks = response.data.tasks;
      setTasks(tasks);
    } else setTasks([]);

    setLoading(false);
  }

  function calculateCompletedCount(): number {
    return tasks().filter(t => t.completed).length;
  }

  createEffect(async () => {
    await fetchTasks();
  });

  async function handleDelete(id: number): Promise<void> {
    const response = await window.api.tasks.delete({ id });

    if (response.success) {
      setTasks(deleteTaskInTaskList(tasks(), id));
    }
    else {


      window.alert(formatIpcError(response.error));
    }
  }

  function updateTaskInTaskList(
    taskList: Array<TaskData>,
    newTaskData: TaskData
  ): Array<TaskData> {
    return taskList.map(task => {
      return task.id === newTaskData.id
        ? newTaskData
        : task.childrenTasks.length > 0
          ? { ...task, childrenTasks: updateTaskInTaskList(task.childrenTasks, newTaskData) }
          : task;
    });
  }

  function deleteTaskInTaskList(
    taskList: Array<TaskData>,
    taskId: number
  ): Array<TaskData> {
    const found = taskList.find(task => task.id === taskId);

    if (found) {
      taskList = taskList.filter(task => task.id !== taskId);
    } else {
      for (const task of taskList) {
        if (task.childrenTasks.length > 0) {
          task.childrenTasks = deleteTaskInTaskList(task.childrenTasks, taskId);
          break;
        }
      }
    }

    return taskList;
  }

  function findTask(taskList: Array<TaskData>, taskId: number): TaskData | undefined {
    for (const task of taskList) {
      if (task.id === taskId) return task;
      if (task.childrenTasks.length > 0) {
        const found = findTask(task.childrenTasks, taskId);
        if (found) return found;
      }
    }
    return undefined;
  }

  async function handleUpdate(newTaskData: TaskData): Promise<void> {
    const currentTask = findTask(tasks(), newTaskData.id);

    // Only toggle on server if completed status changed
    if (currentTask && currentTask.completed !== newTaskData.completed) {
      const response = await window.api.tasks.toggle({ id: newTaskData.id });
      if (!response.success) {
        window.alert(formatIpcError(response.error));
        return; // Don't update UI if server failed
      }
    }

    setTasks(updateTaskInTaskList(tasks(), newTaskData));
  }

  async function handleCreate(e: Event) {
    e.preventDefault();
    if (!newTaskTitle().trim()) return;

    const response: IpcResponse<CreateTaskResponse> = await window.api.tasks.create({ title: newTaskTitle() });

    if (response.success) {
      setNewTaskTitle('');
      setTasks(prev => [...prev, response.data]);
    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  async function handleAddSubtask(parentId: number, title: string) {
    if (!title.trim()) return;

    const response: IpcResponse<CreateTaskResponse> = await window.api.tasks.create({
      title,
      fatherTaskId: parentId
    });

    if (response.success) {
      await fetchTasks();
    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  return (
    <div class="min-h-screen w-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <TaskStats
          completed={calculateCompletedCount()}
          total={tasks().length}
        />

        <TaskList
          tasks={tasks()}
          loading={loading()}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          newTaskTitle={newTaskTitle}
          onNewTaskTitleChange={setNewTaskTitle}
          onTaskCreate={handleCreate}
          onAddSubtask={handleAddSubtask}
        />

        <p class="text-center text-gray-500 text-sm mt-8">
          {tasks().length > 0 &&
            calculateCompletedCount() === tasks().length
            ? '🎉 Parabéns! Todas as tarefas concluídas!'
            : `${tasks().length - calculateCompletedCount()} tarefa(s) pendente(s)`}
        </p>
      </div>
    </div>
  );
}
