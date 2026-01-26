import { createContext, FormEvent, JSX, ReactNode, useContext, useEffect, useState } from "react";
import { FindAllTasksResponse, TaskInFindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import formatIpcError from "@renderer/utils/format-ipc-error";
import { CreateTaskResponse } from "@shared/models/responses/tasks/create-task.response";

export type TaskData = TaskInFindAllTasksResponse & {
  expanded?: boolean,
  childrenTasks: TaskData[]
}

type HomeContextType = {
  tasks: Array<TaskData>,
  setTasks: React.Dispatch<React.SetStateAction<Array<TaskData>>>,

  loading: boolean,

  handleUpdate: (newTaskData: TaskData) => void,
  handleDelete: (id: number) => void,
  handleAddSubtask: (parentId: number, title: string) => void,

  subtaskFormTaskId: number | null,
  setSubtaskFormTaskId: React.Dispatch<React.SetStateAction<number | null>>,

  handleCreateTask: (e: FormEvent) => void,

  newTaskTitle: string,
  setNewTaskTitle: React.Dispatch<React.SetStateAction<string>>,

  draggedTaskId: number | null,
  setDraggedTaskId: (id: number) => void

  handleMoveTask: (targetId: number | null) => void,

  calculateCompletedCount: () => number
}

const HomeContext = createContext<HomeContextType | null>(null);

export function HomeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(false);
  const [subtaskFormTaskId, setSubtaskFormTaskId] = useState<number | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);

  function calculateCompletedCount(): number {
    return tasks.filter(t => t.completed).length;
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

  async function handleCreateTask(e: React.FormEvent) {
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

  async function handleDelete(id: number): Promise<void> {
    const response = await window.api.tasks.delete({ id });

    if (response.success) {
      setTasks(currentTasks => deleteTaskInTaskList(currentTasks, id));
    }
    else {
      window.alert(formatIpcError(response.error));
    }
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

  async function fetchTasks(): Promise<void> {
    setLoading(true);

    const response: IpcResponse<FindAllTasksResponse> = await window.api.tasks.findAll();

    if (response.success) {
      setTasks(prevTasks => {
        const currentExpandedIds = getExpandedTaskIds(prevTasks);
        return applyExpandedState(response.data.tasks, currentExpandedIds);
      });
    } else {
      setTasks([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <HomeContext.Provider value={{
      tasks, setTasks,
      loading,
      handleUpdate,
      handleDelete,
      handleAddSubtask,
      subtaskFormTaskId, setSubtaskFormTaskId,
      handleCreateTask,
      newTaskTitle, setNewTaskTitle,
      draggedTaskId, setDraggedTaskId,
      handleMoveTask,
      calculateCompletedCount
    }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome(): HomeContextType {
  const context = useContext(HomeContext);

  if (!context) throw new Error('useHome deve ser usado dentro de um HomeProvider');

  return context;
}