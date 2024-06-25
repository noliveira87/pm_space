// components/ProjectTable.js
import React from 'react';
import { Link } from 'react-router-dom';

const ProjectTable = ({ projects, onDeleteProject, onEditProject, teamMembers }) => {
  const handleDelete = (id) => {
    onDeleteProject(id);
  };

  console.log('teamMembers:', teamMembers); // Verifique o valor de teamMembers

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
            <th>Allocated Members</th>
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
                <ul>
                  {project.allocatedMembers.map((allocation) => {
                    const member = teamMembers.find((member) => member.id === allocation.memberId);
                    return (
                      <li key={allocation.memberId}>
                        {member ? `${member.name} - ${allocation.allocatedHours} hours` : ''}
                      </li>
                    );
                  })}
                </ul>
              </td>
              <td>
                <button onClick={() => onEditProject(project.id)}>Edit</button>
                <button onClick={() => handleDelete(project.id)}>Delete</button>
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
