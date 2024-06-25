import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTeamMember = ({ addTeamMember }) => {
  const [name, setName] = useState('');
  const [vacationDays, setVacationDays] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(),
      name,
      vacationDays: parseInt(vacationDays), // Convertendo para número inteiro
    };
    addTeamMember(newMember);
    setName('');
    setVacationDays(0);
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
      </form>
      <Link to="/">
        <button>Back to Projects</button>
      </Link>
    </div>
  );
};

export default AddTeamMember;
