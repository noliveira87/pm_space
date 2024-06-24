import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ addProject }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    team: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject(project);
    navigate('/');
  };

  return (
    <div>
      <h1>Add Project</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={project.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Start Date:
          <input type="date" name="startDate" value={project.startDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          End Date:
          <input type="date" name="endDate" value={project.endDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Original Estimate:
          <input type="number" name="originalEstimate" value={project.originalEstimate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Remaining Work:
          <input type="number" name="remainingWork" value={project.remainingWork} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Team:
          <input type="text" name="team" value={project.team} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
