import React, { useState } from 'react';
import { Plus, FolderOpen, Search, Filter, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { Project, TaskFilters } from '../types';

interface SidebarProps {
  projects: Project[];
  selectedProjectId: string;
  filters: TaskFilters;
  analytics: {
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    completionRate: number;
  };
  onProjectSelect: (projectId: string) => void;
  onFiltersChange: (filters: TaskFilters) => void;
  onAddProject: (name: string, color: string) => void;
  deleteProject: (projectId: string) => void;
}

const projectColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
];

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProjectId,
  filters,
  analytics,
  onProjectSelect,
  onFiltersChange,
  onAddProject,
  deleteProject
}) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(projectColors[0]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleAddProject = () => {
    if (newProjectName.trim()) {
      onAddProject(newProjectName.trim(), selectedColor);
      setNewProjectName('');
      setIsAddingProject(false);
      setSelectedColor(projectColors[0]);
    }
  };

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
        <p className="text-sm text-gray-500 mt-1">Stay organized and productive</p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-gray-200">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          {showFilters ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        {showFilters && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as any })}
                className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="px-4 py-2 border-b border-gray-200">
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </div>
          {showAnalytics ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        
        {showAnalytics && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total Tasks</span>
              <span className="font-medium">{analytics.total}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Completed</span>
              <span className="font-medium text-green-600">{analytics.completed}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">In Progress</span>
              <span className="font-medium text-blue-600">{analytics.inProgress}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Overdue</span>
              <span className="font-medium text-red-600">{analytics.overdue}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Completion Rate</span>
                <span className="font-medium">{analytics.completionRate}%</span>
              </div>
              <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${analytics.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-900">Projects</h2>
            <button
              onClick={() => setIsAddingProject(true)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* All Tasks */}
          <button
            onClick={() => onProjectSelect('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors mb-2 ${
              selectedProjectId === 'all'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FolderOpen className="h-4 w-4" />
            <span className="text-sm font-medium">All Tasks</span>
            <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
              {projects.reduce((sum, p) => sum + p.taskCount, 0)}
            </span>
          </button>

          {/* Project List */}
          {projects.map((project) => (
            <div key={project.id} className="group">
              <button
                onClick={() => onProjectSelect(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedProjectId === project.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                ></div>
                <span className="text-sm font-medium flex-1 truncate">{project.name}</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                  {project.taskCount}
                </span>
              </button>

              {/* Botão de excluir */}
              <div className="px-3 pb-2 hidden group-hover:block">
                {project.id !== 'default' && (
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Excluir Projeto
                </button>)}
              </div>
            </div>
          ))}

          {/* Add Project Form */}
          {isAddingProject && (
            <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-1 mt-3 mb-3">
                {projectColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddProject}
                  className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setIsAddingProject(false);
                    setNewProjectName('');
                    setSelectedColor(projectColors[0]);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};