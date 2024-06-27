import React from 'react';
import { Link } from 'react-router-dom';

const TeamTable = ({ teamMembers }) => {
  return (
    <div>
      <h1>Team Members</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Vacations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member.id}>
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.vacationDays}</td>
              <td>
                <Link to={`/edit-team-member/${member.id}`}>
                  <button>Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
