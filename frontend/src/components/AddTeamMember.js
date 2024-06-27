import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTeamMember = ({ addTeamMember }) => {
  const [name, setName] = useState('');
  const [vacationDays, setVacationDays] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: generateMemberId(), // Gerar novo ID de membro
      name,
      vacationDays: parseInt(vacationDays), // Converter para número inteiro
    };
    addTeamMember(newMember);
    setName('');
    setVacationDays('');
  };

  const generateMemberId = () => {
    // Lógica para gerar o próximo ID de membro
    const storedMembers = JSON.parse(localStorage.getItem('teamMembers')) || [];
    const highestId = storedMembers.reduce((maxId, member) => Math.max(maxId, member.id), 0);
    return highestId + 1; // Incrementar o maior ID encontrado
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
          Vacation Days:
          <input
            type="number"
            value={vacationDays}
            onChange={(e) => setVacationDays(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Member</button>
        <Link to="/">
          <button>Cancel</button>
        </Link>
      </form>
    </div>
  );
};

export default AddTeamMember;
