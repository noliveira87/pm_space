import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import '../../App.css'; // Importa o CSS global

const AddProject = () => {
  const history = useHistory();

  const [projectData, setProjectData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    allocatedMembers: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`, projectData);
      alert('Project added successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Add Project</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Name:
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Start Date:
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          End Date:
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Original Estimate:
          <input
            type="number"
            name="originalEstimate"
            value={projectData.originalEstimate}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Remaining Work:
          <input
            type="number"
            name="remainingWork"
            value={projectData.remainingWork}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <button type="submit" className="button">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
