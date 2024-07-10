import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import apiConfig from '../../config/apiConfig';
import '../../App.css';

const AddTeamMember = () => {
  const history = useHistory();
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    vacation_days: [] // Inicialize como uma array vazia
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  const handleCalendarChange = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      setMemberData({ ...memberData, vacation_days: value });
    } else if (value instanceof Date) {
      setMemberData({ ...memberData, vacation_days: [value] });
    } else {
      setMemberData({ ...memberData, vacation_days: [] });
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...memberData,
        vacation_days: memberData.vacation_days.length > 0 
          ? memberData.vacation_days.map(day => formatDate(day)) 
          : null // Enviar null se não houver dias de férias
      };
      const response = await axios.post(`${apiConfig.baseUrl}/team_members`, formattedData);
      console.log('Response:', response.data);
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
          <Calendar
            onChange={handleCalendarChange}
            value={memberData.vacation_days.length > 0 ? memberData.vacation_days : null}
            selectRange={true} // Permitir seleção de intervalo de datas, se necessário
          />
        </label>
        <button type="submit" className="button">Add Member</button>
      </form>
      <button className="button" onClick={() => history.push('/')}>Back to Home</button>
    </div>
  );
};

export default AddTeamMember;
