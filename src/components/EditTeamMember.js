// components/EditTeamMember.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditTeamMember = ({ teamMembers, editTeamMember }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado local para controlar o formulário de edição
  const [member, setMember] = useState({
    id: '',
    name: '',
    vacations: ''
  });

  // Carregar os detalhes do membro com base no ID fornecido
  useEffect(() => {
    const selectedMember = teamMembers.find(member => member.id === parseInt(id));
    if (selectedMember) {
      setMember(selectedMember);
    }
  }, [id, teamMembers]);

  // Manipulador de alteração de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    editTeamMember(member);
    navigate('/');
  };

  // Manipulador de cancelamento
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Edit Team Member</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={member.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Vacations:
          <input type="text" name="vacations" value={member.vacations} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTeamMember;
