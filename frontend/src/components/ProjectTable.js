import React, { useEffect, useState } from 'react';
import { fetchProjects } from '../api';

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const getProjects = async () => {
      const projects = await fetchProjects();
      setProjects(projects);
    };
    getProjects();
  }, []);

  return (
    <div>
      <h2>Projects</h2>
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
          {projects.map(project => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.start_date}</td>
              <td>{project.end_date}</td>
              <td>{project.original_estimate}</td>
              <td>{project.remaining_work}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
