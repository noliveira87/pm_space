// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProjectTable from './components/ProjectTable';
import AddProject from './components/AddProject';
import TeamTable from './components/TeamTable';
import AddTeamMember from './components/AddTeamMember';
import EditProject from './components/EditProject'; // Importar o novo componente EditProject
import EditTeamMember from './components/EditTeamMember'; // Importar o novo componente EditTeamMember
import { Link } from 'react-router-dom';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);

  // Recuperar projetos do localStorage ao montar o componente
  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    setProjects(storedProjects);
  }, []);

  // Recuperar membros da equipe do localStorage ao montar o componente
  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    setTeamMembers(storedMembers);
  }, []);

  // Função para adicionar projeto
  const addProject = (project) => {
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // Função para editar projeto
  const editProject = (id, newName) => {
    const updatedProjects = projects.map((project) =>
      project.id === id ? { ...project, name: newName } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  // Função para adicionar membro da equipe
  const addTeamMember = (member) => {
    const updatedMembers = [...teamMembers, member];
    setTeamMembers(updatedMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
  };

  // Função para editar membro da equipe
  const editTeamMember = (updatedMember) => {
    const updatedMembers = teamMembers.map(member =>
      member.id === updatedMember.id ? { ...updatedMember } : member
    );
    setTeamMembers(updatedMembers);
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
  };

  // Função para deletar projeto
  const handleDeleteProject = (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
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
                onEditProject={editProject}
              />
              <TeamTable teamMembers={teamMembers} />
              <Link to="/add-team-member">
                <button>Add Team Member</button>
              </Link>
            </>
          }
        />
        <Route
          path="/add-project"
          element={<AddProject addProject={addProject} teamMembers={teamMembers} />}
        />
        <Route
          path="/add-team-member"
          element={<AddTeamMember addTeamMember={addTeamMember} />}
        />
        <Route
          path="/edit-project/:id"
          element={<EditProject projects={projects} editProject={editProject} />}
        />
        <Route
          path="/edit-team-member/:id"
          element={<EditTeamMember teamMembers={teamMembers} editTeamMember={editTeamMember} />}
        />
      </Routes>
    </div>
  );
};

export default App;
