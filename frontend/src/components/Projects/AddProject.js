import React, { useState } from 'react';
import axios from 'axios';
import apiConfig from '../../config/apiConfig'; // Certifique-se de importar sua configuração de API aqui
import { useHistory } from 'react-router-dom'; // Importe useHistory para navegação

const AddTeamMember = () => {
  const [memberData, setMemberData] = useState({
    name: '',
    role: '',
    vacationDays: ''
  });

  const history = useHistory(); // Use useHistory para navegar

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.teamMembers}`, memberData);
      const memberId = response.data.id;
      alert(`Team member ${memberId} added successfully!`);
      // Limpar os campos após o sucesso
      setMemberData({
        name: '',
        role: '',
        vacationDays: ''
      });
      // Navegar de volta para a página inicial após adicionar o membro
      history.push('/');
    } catch (error) {
      console.error('Error adding team member:', error);
      alert('Failed to add team member. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemberData({ ...memberData, [name]: value });
  };

  console.log(memberData); // Adicione este console.log para depuração

  return (
    <div>
      <h2>Add Team Member</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={memberData.name} onChange={handleChange} required />
        </label>
        <label>
          Role:
          <input type="text" name="role" value={memberData.role} onChange={handleChange} required />
        </label>  
        <br />
        <label>
          Vacation Days:
          <input type="number" name="vacationDays" value={memberData.vacationDays} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Add Member</button>
      </form>
    </div>
  );
};

export default AddTeamMember;
