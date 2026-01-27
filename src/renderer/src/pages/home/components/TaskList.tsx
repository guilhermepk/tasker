import React from 'react'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import Card from '@renderer/components/Card'
import { useHome } from '@renderer/contexts/HomeContext'

interface Props { }

export function TaskList(_props: Props) {
  const {
    loading,
    tasks,
    handleMoveTask,
    handleCreateTask,
    handleUpdate,
    handleDelete,
    newTaskTitle, setNewTaskTitle,
    handleAddSubtask,
    setDraggedTaskId,
    subtaskFormTaskId, setSubtaskFormTaskId
  } = useHome();

  return (
    <Card
      onDragOver={(e: React.DragEvent) => {
        e.preventDefault();
      }}
      onDrop={(e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // If the event wasn't stopped by a TaskItem, it means we dropped on the background
        handleMoveTask(null);
      }}
    >
      <TaskForm
        value={newTaskTitle}
        onChange={setNewTaskTitle}
        onSubmit={handleCreateTask}
      />

      {tasks.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          {loading ? 'Carregando tarefas...' : 'Nenhuma tarefa ainda.'}
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onAddSubtask={handleAddSubtask}
            onDrop={handleMoveTask}
            onDragStart={setDraggedTaskId}
            draggable
            subtaskFormTaskId={subtaskFormTaskId}
            setSubtaskFormTaskId={setSubtaskFormTaskId}
          />
        ))
      )}

      {tasks.length > 0 && (
        <TaskForm
          value={newTaskTitle}
          onChange={setNewTaskTitle}
          onSubmit={handleCreateTask}
        />
      )}
    </Card>
  )
}
