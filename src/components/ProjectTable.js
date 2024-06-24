import React from 'react';
import { Link } from 'react-router-dom';

const ProjectTable = ({ projects }) => {
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
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={index}>
              <td>{project.name}</td>
              <td>{project.startDate}</td>
              <td>{project.endDate}</td>
              <td>{project.originalEstimate}</td>
              <td>{project.remainingWork}</td>
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
