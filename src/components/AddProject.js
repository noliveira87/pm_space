import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddProject = ({ addProject, teamMembers }) => {
  const [name, setName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [allocatedHours, setHours] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: generateProjectId(), // Gerar novo ID de projeto
      name,
      memberId,
      allocatedHours: parseInt(allocatedHours), // Converter horas para inteiro
    };
    addProject(newProject);
    setName('');
    setMemberId('');
    setHours('');
  };

  const generateProjectId = () => {
    // Lógica para gerar o próximo ID de projeto
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const highestId = storedProjects.reduce((maxId, project) => Math.max(maxId, project.id), 0);
    return highestId + 1; // Incrementar o maior ID encontrado
  };

  return (
    <div>
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Select Team Member:
          <select value={memberId} onChange={(e) => setMemberId(e.target.value)} required>
            <option value="">Select a member</option>
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Allocated Daily Hours:
          <input
            type="number"
            value={allocatedHours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Project</button>
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default AddProject;
