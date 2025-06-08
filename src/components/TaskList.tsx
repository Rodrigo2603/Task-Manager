import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Task, Project } from '../types';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';

interface TaskListProps {
  tasks: Task[];
  projects: Project[];
  selectedProjectId: string;
  onAddTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projects,
  selectedProjectId,
  onAddTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectName = selectedProjectId === 'all' ? 'All Tasks' : selectedProject?.name || 'Unknown Project';

  // Group tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  // Task statistics
  const stats = {
    total: tasks.length,
    completed: completedTasks.length,
    inProgress: inProgressTasks.length,
    overdue: tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < new Date() && 
      task.status !== 'completed'
    ).length
  };

  const handleOpenModal = (task?: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    onAddTask(taskData);
  };

  const getProjectInfo = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return {
      name: project?.name || 'Unknown Project',
      color: project?.color || '#3b82f6'
    };
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {selectedProject && (
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedProject.color }}
                />
              )}
              <h1 className="text-2xl font-semibold text-gray-900">{projectName}</h1>
            </div>
            <p className="text-gray-500 mt-1">
              {stats.total} tasks • {stats.completed} completed • {stats.inProgress} in progress
              {stats.overdue > 0 && (
                <span className="text-red-600 ml-2">• {stats.overdue} overdue</span>
              )}
            </p>
          </div>
          
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4 min-w-0 break-words">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Total</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 min-w-0 break-words">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Completed</span>
            </div>
            <p className="text-2xl font-semibold text-green-700 mt-1">{stats.completed}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 min-w-0 break-words">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-600">In Progress</span>
            </div>
            <p className="text-2xl font-semibold text-blue-700 mt-1">{stats.inProgress}</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 min-w-0 break-words">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600">Overdue</span>
            </div>
            <p className="text-2xl font-semibold text-red-700 mt-1">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Task Sections */}
      <div className="p-8">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first task</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* To Do Section */}
            {todoTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  To Do ({todoTasks.length})
                </h2>
                <div className="grid gap-4">
                  {todoTasks.map((task) => {
                    const projectInfo = getProjectInfo(task.projectId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectName={projectInfo.name}
                        projectColor={projectInfo.color}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                        onEdit={handleOpenModal}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* In Progress Section */}
            {inProgressTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  In Progress ({inProgressTasks.length})
                </h2>
                <div className="grid gap-4">
                  {inProgressTasks.map((task) => {
                    const projectInfo = getProjectInfo(task.projectId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectName={projectInfo.name}
                        projectColor={projectInfo.color}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                        onEdit={handleOpenModal}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Completed ({completedTasks.length})
                </h2>
                <div className="grid gap-4">
                  {completedTasks.map((task) => {
                    const projectInfo = getProjectInfo(task.projectId);
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        projectName={projectInfo.name}
                        projectColor={projectInfo.color}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                        onEdit={handleOpenModal}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        projects={projects}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onUpdate={onUpdateTask}
      />
    </div>
  );
};