import React from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

function App() {
  const {
    tasks,
    projects,
    selectedProjectId,
    filters,
    analytics,
    setSelectedProjectId,
    setFilters,
    addTask,
    updateTask,
    deleteTask,
    addProject,
    deleteProject
  } = useTasks();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        projects={projects}
        selectedProjectId={selectedProjectId}
        filters={filters}
        analytics={analytics}
        onProjectSelect={setSelectedProjectId}
        onFiltersChange={setFilters}
        onAddProject={addProject}
        deleteProject={deleteProject}
      />
      
      <TaskList
        tasks={tasks}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;