import { Trash2, CheckCircle2, Circle, ChevronRight, ChevronDown, Plus, Pencil } from 'lucide-solid'
import { Button } from '../../../components/Button'
import { TaskInFindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { For, createSignal } from 'solid-js'
import { TaskForm } from './TaskForm'

export type TaskData = TaskInFindAllTasksResponse & {
  expanded?: boolean,
  childrenTasks: TaskData[]
}

interface TaskItemProps {
  task: TaskData
  onUpdate: (newTaskData: TaskData) => void
  onDelete: (id: number) => void
  onAddSubtask: (parentId: number, title: string) => void
  subtaskFormTaskId: number | null
  onSetSubtaskFormTaskId: (id: number | null) => void
}

export function TaskItem(props: TaskItemProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = createSignal('');

  const isAdding = () => props.subtaskFormTaskId === props.task.id;
  const hasSubtasks = () => props.task.childrenTasks && props.task.childrenTasks.length > 0
  const showSubtasks = () => (props.task.expanded && hasSubtasks()) || isAdding();

  function handleSubmitSubtask(e: Event) {
    e.preventDefault();
    if (newSubtaskTitle().trim()) {
      props.onAddSubtask(props.task.id, newSubtaskTitle());
      setNewSubtaskTitle('');
      props.onSetSubtaskFormTaskId(null); // Close the form
    }
  }

  function handleToggleAddSubtask(e: MouseEvent) {
    e.stopPropagation();
    if (isAdding()) {
      props.onSetSubtaskFormTaskId(null);
    } else {
      props.onSetSubtaskFormTaskId(props.task.id);
      props.onUpdate({ ...props.task, expanded: true }); // Ensure expanded
    }
  }

  return (
    <div class="w-full">
      <div
        class="group p-4 flex items-center justify-between hover:bg-slate-700/30 cursor-pointer"
        title={props.task.completed ? 'Tornar pendente' : 'Concluir'}
        onClick={(e) => {
          e.stopPropagation();
          props.onUpdate({ ...props.task, completed: !props.task.completed });
        }}
      >
        <div class="flex items-center gap-4 grow py-2 -my-2">
          {hasSubtasks() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onUpdate({ ...props.task, expanded: !!!props.task.expanded });
              }}
              class="p-1 -ml-2 rounded hover:bg-slate-600 transition-colors duration-200"
              title={props.task.expanded ? 'Colapsar sub-tarefas' : 'Expandir sub-tarefas'}
            >
              {props.task.expanded ? (
                <ChevronDown class="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight class="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}

          <div class="relative">
            {props.task.completed ? (
              <>
                <CheckCircle2 class="w-6 h-6 text-green-400 group-hover:opacity-0 transition-opacity duration-200" />
                <Circle class="w-6 h-6 text-gray-600 absolute top-0 left-0 opacity-0 group-hover:opacity-25 transition-opacity duration-200" />
              </>
            ) : (
              <>
                <Circle class="w-6 h-6 text-gray-600 group-hover:opacity-0 transition-opacity duration-200" />
                <CheckCircle2 class="w-6 h-6 text-green-400 absolute top-0 left-0 opacity-0 group-hover:opacity-25 transition-opacity duration-200" />
              </>
            )}
          </div>

          <span
            class={
              props.task.completed
                ? 'line-through text-gray-500 group-hover:no-underline group-hover:text-gray-400 transition-all duration-200'
                : 'text-gray-200 group-hover:line-through group-hover:text-gray-400 transition-all duration-200'
            }
          >
            {props.task.title}
          </span>
        </div>

        <div class="flex gap-2">
          <Button
            class='cursor-pointer hover:text-purple-400'
            variant="ghost"
            size="icon"
            onClick={handleToggleAddSubtask}
            title='Adicionar sub-tarefa'
          >
            <Plus class="w-5 h-5" />
          </Button>

          <Button
            class='cursor-pointer hover:text-blue-400'
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              window.alert("Editar tarefa " + props.task.title)
            }}
            title='Editar tarefa'
          >
            <Pencil class="w-5 h-5" />
          </Button>

          <Button
            class='cursor-pointer hover:text-[red]'
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              props.onDelete(props.task.id)
            }}
            title='Excluir tarefa'
          >
            <Trash2 class="w-5 h-5" />
          </Button>
        </div>
      </div>

      {showSubtasks() && (
        <div class="ml-8 border-l border-slate-700">
          {isAdding() && (
            <div class="pl-4 py-2">
              <TaskForm
                value={newSubtaskTitle}
                onChange={setNewSubtaskTitle}
                onSubmit={handleSubmitSubtask}
                noCard
              />
            </div>
          )}
          <For each={props.task.childrenTasks}>
            {(subtask) => (
              <TaskItem
                task={subtask}
                onUpdate={props.onUpdate}
                onDelete={props.onDelete}
                onAddSubtask={props.onAddSubtask}
                subtaskFormTaskId={props.subtaskFormTaskId}
                onSetSubtaskFormTaskId={props.onSetSubtaskFormTaskId}
              />
            )}
          </For>
        </div>
      )}
    </div>
  )
}
