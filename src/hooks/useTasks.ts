import { useState, useEffect, useCallback } from 'react';
import { Task, Project, TaskFilters, TaskPriority, TaskStatus } from '../types';
import { loadTasks, saveTasks, loadProjects, saveProjects } from '../utils/storage';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    status: 'all',
    priority: 'all',
    projectId: 'all'
  });

  // Load data on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    const loadedProjects = loadProjects();
    setTasks(loadedTasks);
    setProjects(loadedProjects);
    updateProjectTaskCounts(loadedTasks, loadedProjects);
  }, []);

  // Update project task counts
  const updateProjectTaskCounts = useCallback((tasksData: Task[], projectsData: Project[]) => {
    const updatedProjects = projectsData.map(project => ({
      ...project,
      taskCount: tasksData.filter(task => task.projectId === project.id).length
    }));
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  }, []);

  // Task CRUD operations
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      order: Date.now()
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    updateProjectTaskCounts(updatedTasks, projects);
  }, [tasks, projects, updateProjectTaskCounts]);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        if (updates.status === 'completed' && task.status !== 'completed') {
          updatedTask.completedAt = new Date().toISOString();
        } else if (updates.status !== 'completed') {
          delete updatedTask.completedAt;
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    updateProjectTaskCounts(updatedTasks, projects);
  }, [tasks, projects, updateProjectTaskCounts]);

  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    updateProjectTaskCounts(updatedTasks, projects);
  }, [tasks, projects, updateProjectTaskCounts]);

  const reorderTasks = useCallback((reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    saveTasks(reorderedTasks);
  }, []);

  // Project operations
  const addProject = useCallback((name: string, color: string) => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      color,
      createdAt: new Date().toISOString(),
      taskCount: 0
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    return newProject.id;
  }, [projects]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
  }, [projects]);

  const deleteProject = useCallback((projectId: string) => {
    if (projectId === 'default') return; // Don't delete default project
    
    // Move tasks to default project
    const updatedTasks = tasks.map(task =>
      task.projectId === projectId ? { ...task, projectId: 'default' } : task
    );
    
    const updatedProjects = projects.filter(project => project.id !== projectId);
    
    setTasks(updatedTasks);
    setProjects(updatedProjects);
    saveTasks(updatedTasks);
    saveProjects(updatedProjects);
    updateProjectTaskCounts(updatedTasks, updatedProjects);
    
    if (selectedProjectId === projectId) {
      setSelectedProjectId('all');
    }
  }, [tasks, projects, selectedProjectId, updateProjectTaskCounts]);

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    const matchesProject = selectedProjectId === 'all' || task.projectId === selectedProjectId;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  }).sort((a, b) => {
    // Sort by status (incomplete first), then by order
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return b.order - a.order;
  });

  // Analytics
  const analytics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100) : 0
  };

  return {
    tasks: filteredTasks,
    projects,
    selectedProjectId,
    filters,
    analytics,
    setSelectedProjectId,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addProject,
    updateProject,
    deleteProject,
  };
};