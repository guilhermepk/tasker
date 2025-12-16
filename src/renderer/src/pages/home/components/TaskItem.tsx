import { Trash2, CheckCircle2, Circle } from 'lucide-solid'
import { Button } from '../../../components/Button'

interface Task {
  id: number
  title: string
  completed: boolean
}

interface Props {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskItem(props: Props) {
  const { task } = props

  return (
    <div
      class="group p-4 flex items-center justify-between hover:bg-slate-700/30 cursor-pointer"
      title={task.completed ? 'Tornar pendente' : 'Concluir'}
      onClick={() => props.onToggle(task.id)}
    >
      <div
        class="flex items-center gap-4 grow py-2 -my-2"
      >
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
        onClick={() => props.onDelete(task.id)}
        title='Excluir tarefa'
      >
        <Trash2 class="w-5 h-5" />
      </Button>
    </div>
  )
}
