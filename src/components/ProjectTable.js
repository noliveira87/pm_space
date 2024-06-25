// src/components/ProjectTable.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectTable = ({ projects, onDeleteProject, onEditProject }) => {
  const handleDelete = (id) => {
    onDeleteProject(id);
  };

  return (
    <div>
      <h1>Project Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Original Estimate</th>
            <th>Remaining Work</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.originalEstimate}</td>
              <td>{project.remainingWork}</td>
              <td>
                <button onClick={() => handleDelete(project.id)}>Delete</button>
                <button onClick={() => onEditProject(project.id, "New Name")}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/add-project">
        <button>Add Project</button>
      </Link>
    </div>
  );
};

export default ProjectTable;
