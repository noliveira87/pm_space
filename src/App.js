import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import ProjectTable from './components/ProjectTable';
import AddProject from './components/AddProject';

const App = () => {
  const [projects, setProjects] = useState([]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  return (
    <Routes>
      <Route path="/" element={<ProjectTable projects={projects} />} />
      <Route path="/add-project" element={<AddProject addProject={addProject} />} />
    </Routes>
  );
};

export default App;
