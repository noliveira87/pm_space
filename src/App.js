// src/App.js
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectTable from './components/ProjectTable';
import AddProject from './components/AddProject';

const App = () => {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
  };

  const handleEditProject = (id, newName) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, name: newName } : project
    );
    setProjects(updatedProjects);
  };

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <ProjectTable
              projects={projects}
              onDeleteProject={handleDeleteProject}
              onEditProject={handleEditProject}
            />
          }
        />
        <Route
          path="/add-project"
          element={<AddProject addProject={addProject} />}
        />
      </Routes>
    </div>
  );
};

export default App;
