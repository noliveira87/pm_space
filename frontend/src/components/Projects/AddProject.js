import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';

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
    <div>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Start Date:
          <input
            type="date"
            name="startDate"
            value={projectData.startDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          End Date:
          <input
            type="date"
            name="endDate"
            value={projectData.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Original Estimate:
          <input
            type="number"
            name="originalEstimate"
            value={projectData.originalEstimate}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Remaining Work:
          <input
            type="number"
            name="remainingWork"
            value={projectData.remainingWork}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
