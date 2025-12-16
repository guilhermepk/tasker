import { Accessor, For } from 'solid-js'
import { Card } from '../../../components/Card'
import { TaskItem, TaskData } from './TaskItem'
import { TaskForm } from './TaskForm'

interface Props {
  tasks: TaskData[]
  loading: boolean
  onUpdate: (newTaskData: TaskData) => void
  onDelete: (id: number) => void
  newTaskTitle: Accessor<string>
  onNewTaskTitleChange: (v: string) => void
  onTaskCreate: (e: Event) => void
  onAddSubtask: (parentId: number, title: string) => void
  subtaskFormTaskId: number | null
  onSetSubtaskFormTaskId: (id: number | null) => void
}

export function TaskList(props: Props) {
  return (
    <Card class="bg-slate-800/50 backdrop-blur-sm shadow-lg border border-slate-700/50 rounded-[5px]">
      <TaskForm
        value={props.newTaskTitle}
        onChange={props.onNewTaskTitleChange}
        onSubmit={props.onTaskCreate}
        noCard
      />

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
            onAddSubtask={props.onAddSubtask}
            subtaskFormTaskId={props.subtaskFormTaskId}
            onSetSubtaskFormTaskId={props.onSetSubtaskFormTaskId}
          />
        )}
      </For>

      {props.tasks.length > 0 && (
        <TaskForm
          value={props.newTaskTitle}
          onChange={props.onNewTaskTitleChange}
          onSubmit={props.onTaskCreate}
          noCard
        />
      )}
    </Card>
  )
}
