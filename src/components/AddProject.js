import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddProject = ({ addProject, teamMembers }) => {
  const [name, setName] = useState('');
  const [memberAllocations, setMemberAllocations] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filtrar membros alocados com allocatedHours > 0
    const allocatedMembers = Object.entries(memberAllocations)
      .filter(([memberId, hours]) => parseInt(hours) > 0)
      .map(([memberId, hours]) => ({
        memberId: parseInt(memberId),
        allocatedHours: parseInt(hours),
      }));

    const newProject = {
      id: generateProjectId(), // Gerar novo ID de projeto
      name,
      allocatedMembers,
    };
    addProject(newProject);
    setName('');
    setMemberAllocations({});
  };

  const generateProjectId = () => {
    // Lógica para gerar o próximo ID de projeto
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const highestId = storedProjects.reduce((maxId, project) => Math.max(maxId, project.id), 0);
    return highestId + 1; // Incrementar o maior ID encontrado
  };

  const handleAllocationChange = (memberId, hours) => {
    setMemberAllocations({ ...memberAllocations, [memberId]: hours });
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
        <label>Members Allocation:</label>
        <br />
        {teamMembers.map((member) => (
          <div key={member.id}>
            <span>{member.name}</span>
            <input
              type="number"
              min="0"
              value={memberAllocations[member.id] || ''}
              onChange={(e) => handleAllocationChange(member.id, e.target.value)}
            />
          </div>
        ))}
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
