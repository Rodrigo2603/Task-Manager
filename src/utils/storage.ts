import { Task, Project } from '../types';

const TASKS_KEY = 'asana-tasks';
const PROJECTS_KEY = 'asana-projects';

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECTS_KEY);
    const projects = stored ? JSON.parse(stored) : [];
    
    // Ensure default project exists
    if (projects.length === 0) {
      const defaultProject: Project = {
        id: 'default',
        name: 'My Tasks',
        color: '#3b82f6',
        createdAt: new Date().toISOString(),
        taskCount: 0
      };
      projects.push(defaultProject);
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
    
    return projects;
  } catch {
    return [{
      id: 'default',
      name: 'My Tasks',
      color: '#3b82f6',
      createdAt: new Date().toISOString(),
      taskCount: 0
    }];
  }
};

export const saveProjects = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
};