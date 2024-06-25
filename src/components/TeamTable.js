// components/TeamTable.js
import React from 'react';

const TeamTable = ({ teamMembers }) => {
  return (
    <div>
      <h2>Team Management</h2> {/* Título adicionado */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Vacations</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member, index) => (
            <tr key={index}>
              <td>{index + 1}</td> {/* ID gerado automaticamente */}
              <td>{member.name}</td>
              <td>{member.vacations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamTable;
