import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';

const AddTeamMember = () => {
  const history = useHistory();
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    vacation_days: '' // Nome do campo conforme esperado pelo backend
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}`, memberData);
      alert('Team member added successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Add Team Member</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={memberData.name}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Role:
          <input
            type="text"
            name="role"
            value={memberData.role}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Vacation Days:
          <input
            type="number"
            name="vacation_days"
            value={memberData.vacation_days}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default AddTeamMember;
