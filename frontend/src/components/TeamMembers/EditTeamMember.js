import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import '../../App.css';

const EditTeamMember = () => {
  const { id } = useParams();
  const history = useHistory();
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    vacation_days: ''
  });

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}/${id}`);
        setMemberData({
          name: response.data.name,
          role: response.data.role,
          vacation_days: parseInt(response.data.vacation_days)
        });
      } catch (error) {
        console.error('Error fetching team member:', error);
      }
    };

    fetchTeamMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({
      ...memberData,
      [name]: name === 'vacation_days' ? parseInt(value, 10) || '' : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...memberData,
        vacation_days: parseInt(memberData.vacation_days)
      };
      await axios.put(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}/${id}`, updatedData);
      alert('Team member updated successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error updating team member:', error);
      alert('Failed to update team member. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Edit Team Member</h2>
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
        <button type="submit" className="button">Update Member</button>
      </form>
      <button className="button" onClick={() => history.push('/')}>Back to Home</button>
    </div>
  );
};

export default EditTeamMember;
