import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditTeamMember = ({ editTeamMember }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado local para controlar o formulário de edição
  const [member, setMember] = useState({
    id: 0, // Inicializar com um valor padrão
    name: '',
    vacationDays: '',
  });

  // Carregar os detalhes do membro com base no ID fornecido
  useEffect(() => {
    const storedData = localStorage.getItem('teamMembers');
    if (storedData) {
      const teamMembers = JSON.parse(storedData);
      const selectedMember = teamMembers.find(member => member.id === parseInt(id));
      if (selectedMember) {
        setMember(selectedMember);
      }
    }
  }, [id]);

  // Manipulador de alteração de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar se vacationsDays é um número válido antes de prosseguir
    const vacationsNumber = parseInt(member.vacationDays);
    if (isNaN(vacationsNumber) || vacationsNumber < 0) {
      alert('Please enter a valid number of vacations.');
      return;
    }

    // Atualizar o membro da equipe
    editTeamMember(member);

    // Atualizar local storage após a edição
    const storedData = localStorage.getItem('teamMembers');
    if (storedData) {
      const teamMembers = JSON.parse(storedData);
      const updatedMembers = teamMembers.map(mem => (mem.id === member.id ? member : mem));
      localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));
    }

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
          <input type="text" name="vacationsDays" value={member.vacationDays} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditTeamMember;
