import React, { useState, useEffect } from 'react'
import { TaskStats } from './components/TaskStats'
import { TaskList } from './components/TaskList'
import { FindAllTasksResponse, TaskInFindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { TaskData } from './components/TaskItem'
import { CreateTaskResponse } from '@shared/models/responses/tasks/create-task.response'
import formatIpcError from '@renderer/utils/format-ipc-error'

export default function HomePage() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [subtaskFormTaskId, setSubtaskFormTaskId] = useState<number | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  async function fetchTasks(): Promise<void> {
    setLoading(true);

    const response: IpcResponse<FindAllTasksResponse> = await window.api.tasks.findAll();

    if (response.success) {
      // Note: We need to access the current state of tasks here.
      // However, since fetchTasks is async and we want to preserve expanded state based on potentially stale state if we just use 'tasks' from closure?
      // Actually, standard React way is fine for now, or usze functional update if strictly needed.
      // But we need the 'current' tasks to getExpandedTaskIds.
      // Since 'tasks' is in closure, it refers to render-time tasks.
      // Refetching shouldn't drastically change expanded nature unless IDs change.
      // A better way handles this but let's stick to logic logic.
      setTasks(prevTasks => {
        const currentExpandedIds = getExpandedTaskIds(prevTasks);
        return applyExpandedState(response.data.tasks, currentExpandedIds);
      });
    } else {
      setTasks([]);
    }

    setLoading(false);
  }

  function calculateCompletedCount(): number {
    return tasks.filter(t => t.completed).length;
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleDelete(id: number): Promise<void> {
    const response = await window.api.tasks.delete({ id });

    if (response.success) {
      setTasks(currentTasks => deleteTaskInTaskList(currentTasks, id));
    }
    else {
      window.alert(formatIpcError(response.error));
    }
  }

  function getExpandedTaskIds(taskList: TaskData[]): Set<number> {
    const ids = new Set<number>();
    const traverse = (items: TaskData[]) => {
      for (const task of items) {
        if (task.expanded) ids.add(task.id);
        if (task.childrenTasks && task.childrenTasks.length > 0) {
          traverse(task.childrenTasks);
        }
      }
    };
    traverse(taskList);
    return ids;
  }

  function applyExpandedState(
    newTasks: TaskInFindAllTasksResponse[],
    expandedIds: Set<number>
  ): TaskData[] {
    return newTasks.map(task => ({
      ...task,
      expanded: expandedIds.has(task.id),
      childrenTasks: applyExpandedState(task.childrenTasks || [], expandedIds)
    }));
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
    return taskList
      .filter(task => task.id !== taskId)
      .map(task => {
        if (task.childrenTasks && task.childrenTasks.length > 0) {
          return {
            ...task,
            childrenTasks: deleteTaskInTaskList(task.childrenTasks, taskId)
          };
        }
        return task;
      });
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
    const currentTask = findTask(tasks, newTaskData.id);

    // Only toggle on server if completed status changed
    // Check if either completed status or title changed
    if (currentTask && (currentTask.completed !== newTaskData.completed || currentTask.title !== newTaskData.title)) {
      const updateData: any = { id: newTaskData.id };

      if (currentTask.completed !== newTaskData.completed) {
        updateData.completed = newTaskData.completed;
      }

      if (currentTask.title !== newTaskData.title) {
        updateData.title = newTaskData.title;
      }

      const response = await window.api.tasks.update(updateData);
      if (!response.success) {
        window.alert(formatIpcError(response.error));
        return; // Don't update UI if server failed
      }
    }

    setTasks(currentTasks => updateTaskInTaskList(currentTasks, newTaskData));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const response: IpcResponse<CreateTaskResponse> = await window.api.tasks.create({ title: newTaskTitle });

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
      // Re-fetch to get correct structure updates or assume we can just append?
      // Fetching is safer for hierarchy
      await fetchTasks();
      setSubtaskFormTaskId(null); // Close form on success

    } else {
      window.alert(formatIpcError(response.error));
    }
  }

  async function handleMoveTask(targetId: number | null) {
    const draggedId = draggedTaskId;
    if (!draggedId) return;
    if (draggedId === targetId) return;

    if (targetId !== null) {
      const draggedTask = findTask(tasks, draggedId);
      if (draggedTask) {
        const containsTarget = (list: TaskData[]): boolean => {
          for (const t of list) {
            if (t.id === targetId) return true;
            if (t.childrenTasks && containsTarget(t.childrenTasks)) return true;
          }
          return false;
        };

        if (containsTarget(draggedTask.childrenTasks)) {
          return;
        }
      }
    }

    const response = await window.api.tasks.update({
      id: draggedId,
      fatherTaskId: targetId
    });

    if (response.success) {
      await fetchTasks();
    } else {
      window.alert(formatIpcError(response.error));
    }

    setDraggedTaskId(null);
  }

  return (
    <div
      className="min-h-screen w-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 py-12 px-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleMoveTask(null);
      }}
    >
      <div className="max-w-2xl mx-auto">
        <TaskStats
          completed={calculateCompletedCount()}
          total={tasks.length}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          newTaskTitle={newTaskTitle}
          onNewTaskTitleChange={setNewTaskTitle}
          onTaskCreate={handleCreate}
          onAddSubtask={handleAddSubtask}
          subtaskFormTaskId={subtaskFormTaskId}
          onSetSubtaskFormTaskId={setSubtaskFormTaskId}
          onDragStart={setDraggedTaskId}
          onMoveTask={handleMoveTask}
        />

        <p className="text-center text-gray-500 text-sm mt-8">
          {tasks.length > 0 &&
            calculateCompletedCount() === tasks.length
            ? '🎉 Parabéns! Todas as tarefas concluídas!'
            : `${tasks.length - calculateCompletedCount()} tarefa(s) pendente(s)`}
        </p>
      </div>
    </div>
  );
}
