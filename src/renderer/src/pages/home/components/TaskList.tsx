import { For } from 'solid-js'
import { Card } from '../../../components/Card'
import { TaskItem, TaskItemData } from './TaskItem'

interface Props {
  tasks: TaskItemData[]
  loading: boolean
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskList(props: Props) {
  return (
    <Card class="bg-slate-800/50 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-[5px]">
      <For
        each={props.tasks}
        fallback={
          <div class="p-12 text-center text-gray-400">
            {props.loading ? 'Carregando tarefas...' : 'Nenhuma tarefa ainda.'}
          </div>
        }
      >
        {task => (
          <TaskItem
            task={task}
            onToggle={props.onToggle}
            onDelete={props.onDelete}
          />
        )}
      </For>
    </Card>
  )
}
