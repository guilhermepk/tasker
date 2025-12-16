import { createSignal, createEffect } from 'solid-js'
import { TaskStats } from './components/TaskStats'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FindAllTasksResponse, TaskInFindAllTasksResponse } from '@shared/models/responses/find-all-tasks.response'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'

export default function HomePage() {
  const [tasks, setTasks] = createSignal<TaskInFindAllTasksResponse[]>([]);
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
      setTasks(tasks().filter(t => t.id !== id));
    }
    else window.alert(response.error.message);
  }

  function toggleTaskInTaskList(
    taskList: Array<TaskInFindAllTasksResponse>,
    newTaskId: number
  ): Array<TaskInFindAllTasksResponse> {
    return taskList.map(task => {
      return task.id === newTaskId
        ? { ...task, completed: !task.completed }
        : task.childrenTasks.length > 0
          ? { ...task, childrenTasks: toggleTaskInTaskList(task.childrenTasks, newTaskId) }
          : task;
    });
  }

  async function handleToggle(id: number): Promise<void> {
    const response = await window.api.tasks.toggle({ id });

    if (response.success) {
      setTasks(toggleTaskInTaskList(tasks(), id));
    }
    else window.alert(response.error.message);
  }

  async function handleCreate(e: Event) {
    e.preventDefault();
    if (!newTaskTitle().trim()) return;

    const response: IpcResponse<{ message: string }> = await window.api.tasks.create({ title: newTaskTitle() });

    if (response.success) {
      setNewTaskTitle('');
      await fetchTasks();
    } else {
      window.alert(response.error.message);
    }
  }

  return (
    <div class="min-h-screen w-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <TaskStats
          completed={calculateCompletedCount()}
          total={tasks().length}
        />

        <TaskForm
          value={newTaskTitle}
          onChange={setNewTaskTitle}
          onSubmit={handleCreate}
        />

        <TaskList
          tasks={tasks()}
          loading={loading()}
          onToggle={handleToggle}
          onDelete={handleDelete}
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
