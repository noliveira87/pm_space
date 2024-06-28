import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
      <h2>Team Members</h2>
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
                  <button className="edit-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                </Link>
                <button className="delete-button" onClick={() => handleDelete(member.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
