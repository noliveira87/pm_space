// components/AddTeamMember.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTeamMember = ({ addTeamMember }) => {
  const [name, setName] = useState('');
  const [vacations, setVacations] = useState('');

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
      <Link to="/">
        <button>Back to Projects</button>
      </Link>
    </div>
  );
};

export default AddTeamMember;
