import React, { useState, useRef, useEffect } from 'react'
import { Trash2, CheckCircle2, Circle, ChevronRight, ChevronDown, Plus, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { TaskForm } from './TaskForm'
import { routes } from '@renderer/common/routes'
import { TaskData, useHome } from '@renderer/contexts/HomeContext'

interface TaskItemProps {
  onUpdate?: (newTaskData: TaskData) => void
  onDelete: (id: number) => void,
  canAddSubtask?: boolean,
  task: TaskData
  className?: string,
  draggable?: boolean
}

export function TaskItem({
  onUpdate, task, canAddSubtask, className, draggable, onDelete
}: TaskItemProps) {
  const navigate = useNavigate();

  const {
    handleAddSubtask,
    subtaskFormTaskId, setSubtaskFormTaskId,
    handleMoveTask,
    setDraggedTaskId
  } = useHome();

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const isAdding = subtaskFormTaskId === task.id;
  const hasSubtasks = task.childrenTasks && task.childrenTasks.length > 0;
  const showSubtasks = (task.expanded && hasSubtasks) || isAdding;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  function handleSubmitSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      handleAddSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
      setSubtaskFormTaskId(null); // Close the form
    }
  }

  function handleBlur() {
    if (newSubtaskTitle.trim()) {
      handleAddSubtask(task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
    }
    setSubtaskFormTaskId(null);
  }

  function handleToggleAddSubtask(e: React.MouseEvent) {
    e.stopPropagation();
    if (isAdding) {
      setSubtaskFormTaskId?.(null);
    } else {
      setSubtaskFormTaskId?.(task.id);
      onUpdate?.({ ...task, expanded: true });
    }
  }

  function handleStartEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditTitle(task.title);
    setIsEditing(true);
  }

  function handleSaveEdit() {
    if (editTitle.trim() && editTitle !== task.title) {
      onUpdate?.({ ...task, title: editTitle });
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        draggable={draggable}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer?.setData('text/plain', String(task.id));
          setDraggedTaskId(task.id);
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
          handleMoveTask(task.id);
        }}
        className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${isDragOver ? 'bg-indigo-900/50 border-2 border-indigo-500 rounded-lg' : 'hover:bg-slate-700/30'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(routes.taskPage.path(task.id));
        }}
      >
        <div className="flex items-center gap-4 grow py-2 -my-2">
          {hasSubtasks && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate?.({ ...task, expanded: !task.expanded });
              }}
              className="p-1 -ml-2 rounded hover:bg-slate-600 transition-colors duration-200"
              title={task.expanded ? 'Colapsar sub-tarefas' : 'Expandir sub-tarefas'}
            >
              {task.expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}


          <div
            className="relative cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onUpdate?.({ ...task, completed: !task.completed });
            }}
            title={task.completed ? 'Tornar pendente' : 'Concluir'}
          >
            {task.completed ? (
              <>
                <CheckCircle2
                  className={`
                    w-6 h-6 text-green-400 transition-opacity duration-200
                    ${onUpdate ? 'hover:opacity-0' : 'hover:opacity-100'}
                  `}
                />
                <Circle className="w-6 h-6 text-gray-600 absolute top-0 left-0 opacity-0 hover:opacity-25 transition-opacity duration-200" />
              </>
            ) : (
              <>
                <Circle className="w-6 h-6 text-gray-600 hover:opacity-0 transition-opacity duration-200" />
                <CheckCircle2 className="w-6 h-6 text-green-400 absolute top-0 left-0 opacity-0 hover:opacity-25 transition-opacity duration-200" />
              </>
            )}
          </div>

          {isEditing ? (
            <input
              ref={editInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="bg-transparent text-gray-200 border-b border-blue-500 focus:outline-none p-0 w-full text-base rounded-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={
                task.completed
                  ? `line-through text-gray-500 transition-all duration-200`
                  : `text-gray-200 transition-all duration-200`
              }
            >
              {task.title}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {canAddSubtask && (
            <Button
              className='cursor-pointer hover:text-purple-400'
              variant="ghost"
              size="icon"
              onClick={handleToggleAddSubtask}
              title='Adicionar sub-tarefa'
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}

          {onUpdate && (
            <Button
              className='cursor-pointer hover:text-blue-400'
              variant="ghost"
              size="icon"
              onClick={handleStartEdit}
              title='Editar tarefa'
            >
              <Pencil className="w-5 h-5" />
            </Button>
          )}

          {onDelete && (
            <Button
              className='cursor-pointer hover:text-[red]'
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(task.id)
              }}
              title='Excluir tarefa'
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {showSubtasks && (
        <div className="ml-8 border-l border-slate-700">
          {isAdding && (
            <div className="pl-4 py-2">
              <TaskForm
                value={newSubtaskTitle}
                onChange={setNewSubtaskTitle}
                onSubmit={handleSubmitSubtask}
                onBlur={handleBlur}
                autoFocus={true}
              />
            </div>
          )}
          {task.childrenTasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdate={onUpdate}
              onDelete={onDelete}
              canAddSubtask={canAddSubtask}
              draggable
            />
          ))}
        </div>
      )}
    </div>
  )
}
