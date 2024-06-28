import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import '../../App.css';

const AddTeamMember = () => {
  const history = useHistory();
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    vacation_days: ''
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
    <div className="container">
      <h2>Add Team Member</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Name:
          <input
            type="text"
            name="name"
            value={memberData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Role:
          <input
            type="text"
            name="role"
            value={memberData.role}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Vacation Days:
          <input
            type="number"
            name="vacation_days"
            value={memberData.vacation_days}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <button type="submit" className="button">Add Member</button>
      </form>
      <button className="button" onClick={() => history.push('/')}>Back to Home</button>
    </div>
  );
};

export default AddTeamMember;
