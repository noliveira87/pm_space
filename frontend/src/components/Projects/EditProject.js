import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'; // Importe useHistory
import axios from 'axios';
import apiConfig from '../../config/apiConfig';

const EditProject = () => {
  const history = useHistory(); // Use useHistory para navegação programática
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
        setProject(response.data);
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
      history.push('/'); // Use history.push para redirecionar após a atualização
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
    </div>
  );
};

export default EditProject;
