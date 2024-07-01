import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiConfig from '../../config/apiConfig';
import '../../App.css'; // Importa o CSS global

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`);
        const formattedProjects = await Promise.all(response.data.map(async project => {
          const allocationsResponse = await axios.get(apiConfig.baseUrl + apiConfig.endpoints.projectAllocations(project.id));
          return {
            ...project,
            start_date: project.start_date ? project.start_date.split('T')[0] : '', // Verifica se start_date é nulo ou vazio
            end_date: project.end_date ? project.end_date.split('T')[0] : '', // Verifica se end_date é nulo ou vazio
            allocated_members: allocationsResponse.data.map(allocation => ({
              memberId: allocation.id,
              name: allocation.name,
              role: allocation.role,
              vacation_days: allocation.vacation_days,
              allocated_hours: allocation.allocated_hours
            }))
          };
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-PT', options);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) {
      return; // Cancel deletion if user clicks cancel in the confirmation dialog
    }

    try {
      await axios.delete(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again later.');
    }
  };

  return (
    <div className="container">
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
            <th>Allocated Members</th>
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
                {project.allocated_members && project.allocated_members.length > 0 ? (
                  project.allocated_members.map((member, index) => (
                    <span key={member.memberId}>
                      {member.name} ({member.allocated_hours} hours)
                      {index < project.allocated_members.length - 1 && ', '}
                    </span>
                  ))
                ) : (
                  'No members allocated'
                )}
              </td>
              <td>
              <Link to={`/edit-project/${project.id}`}>
                  <button className="project-edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </Link>
                <button className="project-delete-button" onClick={() => handleDelete(project.id)}>
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
