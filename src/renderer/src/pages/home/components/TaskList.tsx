import React from 'react'
import { TaskItem, TaskData } from './TaskItem'
import { TaskForm } from './TaskForm'
import Card from '@renderer/components/Card'
import { Input } from '@renderer/components/Input'

interface Props {
  tasks: TaskData[]
  loading: boolean
  onUpdate: (newTaskData: TaskData) => void
  onDelete: (id: number) => void
  newTaskTitle: string
  onNewTaskTitleChange: (v: string) => void
  onTaskCreate: (e: React.FormEvent) => void
  onAddSubtask: (parentId: number, title: string) => void
  subtaskFormTaskId: number | null
  onSetSubtaskFormTaskId: (id: number | null) => void
  onDragStart: (id: number) => void
  onMoveTask: (targetId: number | null) => void
}

export function TaskList(props: Props) {
  return (
    <Card
      onDragOver={(e: React.DragEvent) => {
        e.preventDefault();
      }}
      onDrop={(e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // If the event wasn't stopped by a TaskItem, it means we dropped on the background
        props.onMoveTask(null);
      }}
    >
      <TaskForm
        value={props.newTaskTitle}
        onChange={props.onNewTaskTitleChange}
        onSubmit={props.onTaskCreate}
      />

      {props.tasks.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          {props.loading ? 'Carregando tarefas...' : 'Nenhuma tarefa ainda.'}
        </div>
      ) : (
        props.tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            onAddSubtask={props.onAddSubtask}
            subtaskFormTaskId={props.subtaskFormTaskId}
            onSetSubtaskFormTaskId={props.onSetSubtaskFormTaskId}
            onDragStart={props.onDragStart}
            onMoveTask={props.onMoveTask}
          />
        ))
      )}

      {props.tasks.length > 0 && (
        <TaskForm
          value={props.newTaskTitle}
          onChange={props.onNewTaskTitleChange}
          onSubmit={props.onTaskCreate}
        />
      )}
    </Card>
  )
}
