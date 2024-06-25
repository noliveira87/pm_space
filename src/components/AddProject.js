import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ addProject, teamMembers }) => {
  const navigate = useNavigate();
  const [project, setProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    selectedTeamMembers: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setProject({ ...project, selectedTeamMembers: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addProject(project);
    navigate('/');
  };

  const handleCancel = () => {
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
          Project Members:
          <select
            name="selectedTeamMembers"
            multiple
            value={project.selectedTeamMembers}
            onChange={handleSelectChange}
            required
          >
            {teamMembers && teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Add Project</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddProject;
