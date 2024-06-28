import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

const EditProject = () => {
  const { id } = useParams();

  const [project, setProject] = useState({
    name: '',
    start_date: '',
    end_date: '',
    original_estimate: '',
    remaining_work: ''
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}/projects/${id}`);
        const { name, start_date, end_date, original_estimate, remaining_work } = response.data;
        setProject({
          name,
          start_date: start_date.substr(0, 10), // Ajusta o formato da data
          end_date: end_date.substr(0, 10), // Ajusta o formato da data
          original_estimate,
          remaining_work
        });
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiConfig.baseUrl}/projects/${id}`, project);
      alert('Project updated successfully!');
      // Navegação alternativa para a página inicial ou outra página desejada
      window.location.href = '/';
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={project.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Start Date:
          <input type="date" name="start_date" value={project.start_date} onChange={handleChange} required />
        </label>
        <br />
        <label>
          End Date:
          <input type="date" name="end_date" value={project.end_date} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Original Estimate:
          <input type="number" name="original_estimate" value={project.original_estimate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Remaining Work:
          <input type="number" name="remaining_work" value={project.remaining_work} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
      <br />
      <button onClick={() => window.location.href = '/'}>Back to Projects</button>
    </div>
  );
};

export default EditProject;
