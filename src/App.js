import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Importe explicitamente o Link
import ProjectTable from './components/ProjectTable';
import AddProject from './components/AddProject';
import TeamTable from './components/TeamTable';
import AddTeamMember from './components/AddTeamMember';
import './index.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  const addProject = (project) => {
    setProjects([...projects, project]);
  };

  const addTeamMember = (member) => {
    setTeamMembers([...teamMembers, member]);
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
            <>
              <ProjectTable
                projects={projects}
                onDeleteProject={handleDeleteProject}
                onEditProject={handleEditProject}
              />
              <TeamTable teamMembers={teamMembers} />
              <Link to="/add-team-member">
                <button className="add-team-member-button">Add Team Member</button>
              </Link>
            </>
          }
        />
        <Route
          path="/add-project"
          element={<AddProject addProject={addProject} />}
        />
        <Route
          path="/add-team-member"
          element={<AddTeamMember addTeamMember={addTeamMember} />}
        />
      </Routes>
    </div>
  );
};

export default App;
