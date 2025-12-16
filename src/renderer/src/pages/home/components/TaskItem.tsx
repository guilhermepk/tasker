import { Trash2, CheckCircle2, Circle, ChevronRight, ChevronDown } from 'lucide-solid'
import { Button } from '../../../components/Button'
import { TaskInFindAllTasksResponse } from '@shared/models/responses/find-all-tasks.response'
import { createSignal, For } from 'solid-js'

interface TaskItemProps {
  task: TaskInFindAllTasksResponse
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskItem({
  task, onDelete, onToggle
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = createSignal<boolean>(false)

  const hasSubtasks = () => task.childrenTasks && task.childrenTasks.length > 0

  return (
    <div class="w-full">
      <div
        class="group p-4 flex items-center justify-between hover:bg-slate-700/30 cursor-pointer"
        title={task.completed ? 'Tornar pendente' : 'Concluir'}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(task.id);
        }}
      >
        <div class="flex items-center gap-4 grow py-2 -my-2">
          {hasSubtasks() && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded());
              }}
              class="p-1 -ml-2 rounded hover:bg-slate-600 transition-colors duration-200"
              title={isExpanded() ? 'Colapsar sub-tarefas' : 'Expandir sub-tarefas'}
            >
              {isExpanded() ? (
                <ChevronDown class="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight class="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}

          <div class="relative">
            {task.completed ? (
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
              task.completed
                ? 'line-through text-gray-500 group-hover:no-underline group-hover:text-gray-400 transition-all duration-200'
                : 'text-gray-200 group-hover:line-through group-hover:text-gray-400 transition-all duration-200'
            }
          >
            {task.title}
          </span>
        </div>

        <Button
          class='cursor-pointer hover:text-[red]'
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(task.id)
          }}
          title='Excluir tarefa'
        >
          <Trash2 class="w-5 h-5" />
        </Button>
      </div>

      {isExpanded() && hasSubtasks() && (
        <div class="ml-8 border-l border-slate-700">
          <For each={task.childrenTasks}>
            {(subtask) => (
              <TaskItem
                task={subtask}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            )}
          </For>
        </div>
      )}
    </div>
  )
}
