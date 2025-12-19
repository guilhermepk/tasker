import { Trash2, CheckCircle2, Circle, ChevronRight, ChevronDown, Plus, Pencil } from 'lucide-solid'
import { Button } from '../../../components/Button'
import { TaskInFindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { For, createSignal } from 'solid-js'
import { TaskForm } from './TaskForm'
import { useNavigate } from '@solidjs/router'

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
  onDragStart: (id: number) => void
  onMoveTask: (targetId: number | null) => void
}

export function TaskItem(props: TaskItemProps) {
  const navigate = useNavigate();

  const [newSubtaskTitle, setNewSubtaskTitle] = createSignal('');
  const [isEditing, setIsEditing] = createSignal(false);
  const [editTitle, setEditTitle] = createSignal('');
  const [isDragOver, setIsDragOver] = createSignal(false);

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

  function handleBlur() {
    if (newSubtaskTitle().trim()) {
      props.onAddSubtask(props.task.id, newSubtaskTitle());
      setNewSubtaskTitle('');
    }
    props.onSetSubtaskFormTaskId(null);
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

  function handleStartEdit(e: MouseEvent) {
    e.stopPropagation();
    setEditTitle(props.task.title);
    setIsEditing(true);
  }

  function handleSaveEdit() {
    if (editTitle().trim() && editTitle() !== props.task.title) {
      props.onUpdate({ ...props.task, title: editTitle() });
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  return (
    <div class="w-full">
      <div
        draggable="true"
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer?.setData('text/plain', String(props.task.id));
          props.onDragStart(props.task.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          props.onMoveTask(props.task.id);
        }}
        class={`group p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${isDragOver() ? 'bg-indigo-900/50 border-2 border-indigo-500 rounded-lg' : 'hover:bg-slate-700/30'
          }`}
        title={props.task.completed ? 'Tornar pendente' : 'Concluir'}
        onClick={(e) => {
          e.stopPropagation();

          navigate(`/task/${props.task.id}`);
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

          <div
            class="relative group/icon peer/icon cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              props.onUpdate({ ...props.task, completed: !props.task.completed })
            }}
          >
            {props.task.completed ? (
              <>
                <CheckCircle2 class="w-6 h-6 text-green-400 group-hover/icon:opacity-0 transition-opacity duration-200" />
                <Circle class="w-6 h-6 text-gray-600 absolute top-0 left-0 opacity-0 group-hover/icon:opacity-25 transition-opacity duration-200" />
              </>
            ) : (
              <>
                <Circle class="w-6 h-6 text-gray-600 group-hover/icon:opacity-0 transition-opacity duration-200" />
                <CheckCircle2 class="w-6 h-6 text-green-400 absolute top-0 left-0 opacity-0 group-hover/icon:opacity-25 transition-opacity duration-200" />
              </>
            )}
          </div>

          {isEditing() ? (
            <input
              ref={(el) => setTimeout(() => el.focus(), 0)}
              value={editTitle()}
              onInput={(e) => setEditTitle(e.currentTarget.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              class="bg-transparent text-gray-200 border-b border-blue-500 focus:outline-none p-0 w-full text-base rounded-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                props.onUpdate({ ...props.task, completed: !props.task.completed });
              }}
              class={
                props.task.completed
                  ? 'line-through text-gray-500 peer-hover/icon:no-underline peer-hover/icon:text-gray-400 transition-all duration-200'
                  : 'text-gray-200 peer-hover/icon:line-through peer-hover/icon:text-gray-400 transition-all duration-200'
              }
            >
              {props.task.title}
            </span>
          )}
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
            onClick={handleStartEdit}
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
                onBlur={handleBlur}
                autoFocus={true}
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
                onDragStart={props.onDragStart}
                onMoveTask={props.onMoveTask}
              />
            )}
          </For>
        </div>
      )}
    </div>
  )
}
