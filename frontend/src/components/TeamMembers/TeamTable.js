import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';

const TeamTable = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}/${id}`);
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Vacation Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.vacation_days}</td>
              <td>
                <Link to={`/edit-team-member/${member.id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => handleDelete(member.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
