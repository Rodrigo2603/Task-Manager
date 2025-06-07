import React, { useState } from 'react';
import { Calendar, User, Flag, Clock, Edit2, Trash2, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '../types';

interface TaskCardProps {
  task: Task;
  projectName: string;
  projectColor: string;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const priorityConfig = {
  urgent: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Urgent' },
  high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Medium' },
  low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Low' }
};

const statusConfig = {
  todo: { icon: Circle, color: 'text-gray-400', label: 'To Do' },
  'in-progress': { icon: PlayCircle, color: 'text-blue-500', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'text-green-500', label: 'Completed' }
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  projectName,
  projectColor,
  onUpdate,
  onDelete,
  onEdit
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const priority = priorityConfig[task.priority];
  const StatusIcon = statusConfig[task.status].icon;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const handleStatusChange = () => {
    let newStatus: TaskStatus;
    switch (task.status) {
      case 'todo':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'todo';
        break;
      default:
        newStatus = 'todo';
    }
    onUpdate(task.id, { status: newStatus });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isCompleted ? 'opacity-75' : ''
      } ${isOverdue ? 'border-l-4 border-l-red-400' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange();
            }}
            className={`mt-0.5 hover:scale-110 transition-transform ${statusConfig[task.status].color}`}
          >
            <StatusIcon className="h-5 w-5" />
          </button>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 leading-tight ${isCompleted ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Project */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: projectColor }}
            />
            <span className="text-xs text-gray-500">{projectName}</span>
          </div>

          {/* Priority */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priority.bg} ${priority.color} ${priority.border}`}>
            <Flag className="inline h-3 w-3 mr-1" />
            {priority.label}
          </span>

          {/* Status Badge */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            task.status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' :
            task.status === 'in-progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            'bg-gray-50 text-gray-700 border border-gray-200'
          }`}>
            {statusConfig[task.status].label}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Assignee */}
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{task.assignee}</span>
            </div>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
              <Calendar className="h-3 w-3" />
              <span className="text-xs font-medium">
                {formatDate(task.dueDate)}
              </span>
              {isOverdue && <Clock className="h-3 w-3" />}
            </div>
          )}
        </div>
      </div>

      {/* Completion timestamp */}
      {task.completedAt && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Completed {new Date(task.completedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
      )}
    </div>
  );
};