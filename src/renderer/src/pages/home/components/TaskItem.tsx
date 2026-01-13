import React, { useState, useRef, useEffect } from 'react'
import { Trash2, CheckCircle2, Circle, ChevronRight, ChevronDown, Plus, Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/Button'
import { TaskInFindAllTasksResponse } from '@shared/models/responses/tasks/find-all-tasks.response'
import { TaskForm } from './TaskForm'
import { routes } from '@renderer/common/routes'

export type TaskData = TaskInFindAllTasksResponse & {
  expanded?: boolean,
  childrenTasks: TaskData[]
}

interface TaskItemProps {
  task: TaskData
  onUpdate?: (newTaskData: TaskData) => void
  onDelete?: (id: number) => void
  onAddSubtask?: (parentId: number, title: string) => void
  subtaskFormTaskId: number | null
  onSetSubtaskFormTaskId?: (id: number | null) => void
  onDragStart?: (id: number) => void
  onMoveTask?: (targetId: number | null) => void
  className?: string
}

export function TaskItem(props: TaskItemProps) {
  const navigate = useNavigate();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const isAdding = props.subtaskFormTaskId === props.task.id;
  const hasSubtasks = props.task.childrenTasks && props.task.childrenTasks.length > 0;
  const showSubtasks = (props.task.expanded && hasSubtasks) || isAdding;

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  function handleSubmitSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      props.onAddSubtask?.(props.task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
      props.onSetSubtaskFormTaskId?.(null); // Close the form
    }
  }

  function handleBlur() {
    if (newSubtaskTitle.trim()) {
      props.onAddSubtask?.(props.task.id, newSubtaskTitle);
      setNewSubtaskTitle('');
    }
    props.onSetSubtaskFormTaskId?.(null);
  }

  function handleToggleAddSubtask(e: React.MouseEvent) {
    e.stopPropagation();
    if (isAdding) {
      props.onSetSubtaskFormTaskId?.(null);
    } else {
      props.onSetSubtaskFormTaskId?.(props.task.id);
      props.onUpdate?.({ ...props.task, expanded: true }); // Ensure expanded
    }
  }

  function handleStartEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setEditTitle(props.task.title);
    setIsEditing(true);
  }

  function handleSaveEdit() {
    if (editTitle.trim() && editTitle !== props.task.title) {
      props.onUpdate?.({ ...props.task, title: editTitle });
    }
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setIsEditing(false);
  }

  return (
    <div className={`w-full ${props.className}`}>
      <div
        draggable={props.onDragStart ? 'true' : 'false'}
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer?.setData('text/plain', String(props.task.id));
          props.onDragStart?.(props.task.id);
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
          props.onMoveTask?.(props.task.id);
        }}
        className={`p-4 flex items-center justify-between cursor-pointer transition-colors duration-200 ${isDragOver ? 'bg-indigo-900/50 border-2 border-indigo-500 rounded-lg' : 'hover:bg-slate-700/30'
          }`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(routes.taskPage.path(props.task.id));
        }}
      >
        <div className="flex items-center gap-4 grow py-2 -my-2">
          {hasSubtasks && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onUpdate?.({ ...props.task, expanded: !props.task.expanded });
              }}
              className="p-1 -ml-2 rounded hover:bg-slate-600 transition-colors duration-200"
              title={props.task.expanded ? 'Colapsar sub-tarefas' : 'Expandir sub-tarefas'}
            >
              {props.task.expanded ? (
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
              props.onUpdate?.({ ...props.task, completed: !props.task.completed });
            }}
            title={props.task.completed ? 'Tornar pendente' : 'Concluir'}
          >
            {props.task.completed ? (
              <>
                <CheckCircle2
                  className={`
                    w-6 h-6 text-green-400 transition-opacity duration-200
                    ${props.onUpdate ? 'hover:opacity-0' : 'hover:opacity-100'}
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
                props.task.completed
                  ? `line-through text-gray-500 transition-all duration-200`
                  : `text-gray-200 transition-all duration-200`
              }
            >
              {props.task.title}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {props.onAddSubtask && (
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

          {props.onUpdate && (
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

          {props.onDelete && (
            <Button
              className='cursor-pointer hover:text-[red]'
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                props.onDelete!(props.task.id)
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
                noCard
              />
            </div>
          )}
          {props.task.childrenTasks.map((subtask) => (
            <TaskItem
              key={subtask.id}
              task={subtask}
              onUpdate={props.onUpdate}
              onDelete={props.onDelete}
              onAddSubtask={props.onAddSubtask}
              subtaskFormTaskId={props.subtaskFormTaskId}
              onSetSubtaskFormTaskId={props.onSetSubtaskFormTaskId}
              onDragStart={props.onDragStart}
              onMoveTask={props.onMoveTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}
