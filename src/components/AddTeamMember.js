// components/AddTeamMember.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AddTeamMember = ({ addTeamMember }) => {
  const [name, setName] = useState('');
  const [vacations, setVacations] = useState('');
  const [localStorageMembers, setLocalStorageMembers] = useState([]);

  useEffect(() => {
    // Recupera os membros da equipe do localStorage ao montar o componente
    const storedMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    setLocalStorageMembers(storedMembers);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(), // Gerando um ID simples baseado no timestamp atual
      name,
      vacations
    };
    addTeamMember(newMember);
    setName('');
    setVacations('');
    // Atualiza o localStorage com o novo membro adicionado
    const updatedMembers = [...localStorageMembers, newMember];
    localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
  };

  return (
    <div>
      <h2>Add Team Member</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Vacations:
          <input
            type="text"
            value={vacations}
            onChange={(e) => setVacations(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Member</button>
      </form>
      <h3>Existing Team Members</h3>
      <ul>
        {localStorageMembers.map((member) => (
          <li key={member.id}>
            {member.name} - Vacations: {member.vacations}
          </li>
        ))}
      </ul>
      <Link to="/">
        <button>Back to Projects</button>
      </Link>
    </div>
  );
};

export default AddTeamMember;
