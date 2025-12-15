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
    <div class="p-4 flex items-center justify-between hover:bg-slate-700/30">
      <div
        class="flex items-center gap-4 cursor-pointer"
        onClick={() => props.onToggle(task.id)}
      >
        {task.completed ? (
          <CheckCircle2 class="w-6 h-6 text-green-400" />
        ) : (
          <Circle class="w-6 h-6 text-gray-600" />
        )}

        <span
          class={
            task.completed
              ? 'line-through text-gray-500'
              : 'text-gray-200'
          }
        >
          {task.title}
        </span>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => props.onDelete(task.id)}
      >
        <Trash2 class="w-5 h-5" />
      </Button>
    </div>
  )
}
