import { For } from 'solid-js'
import { Card } from '../../../components/Card'
import { TaskItem } from './TaskItem'
import { TaskData } from './TaskItem'

interface Props {
  tasks: TaskData[]
  loading: boolean
  onUpdate: (newTaskData: TaskData) => void
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
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
          />
        )}
      </For>
    </Card>
  )
}
