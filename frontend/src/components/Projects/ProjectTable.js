import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiConfig from '../../config/apiConfig';

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`);
        const formattedProjects = response.data.map(project => ({
          ...project,
          start_date: project.start_date.split('T')[0], // Extrai apenas a parte da data
          end_date: project.end_date.split('T')[0] // Extrai apenas a parte da data
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) {
      return; // Cancel deletion if user clicks cancel in the confirmation dialog
    }

    try {
      await axios.delete(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  return (
    <div>
      <h2>Projects</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
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
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{formatDate(project.start_date)}</td>
              <td>{formatDate(project.end_date)}</td>
              <td>{project.original_estimate}</td>
              <td>{project.remaining_work}</td>
              <td>
                <Link to={`/edit-project/${project.id}`}>
                  <button className="edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </Link>
                <button className="delete-button" onClick={() => handleDelete(project.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectTable;
