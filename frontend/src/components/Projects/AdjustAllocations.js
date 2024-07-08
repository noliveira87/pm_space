import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import axios from 'axios';
import { calculateEndDate } from '../../utils/dateUtils';

const AdjustAllocations = (props) => {
  const { projectData } = props.location.state;
  const [allocatedMembers, setAllocatedMembers] = useState(projectData.allocated_members);
  const [teamMembers, setTeamMembers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Simulação de uma chamada para obter informações completas dos membros
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

  // Função para encontrar o nome do membro pelo ID
  const getMemberName = (memberId) => {
    const member = teamMembers.find(member => member.id === memberId);
    return member ? member.name : 'Unknown';
  };

  // Função para gerar array de datas entre start_date e end_date
  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Função para atualizar as alocações diárias
  const handleAllocationChange = (memberId, date, newHours) => {
    const updatedMembers = allocatedMembers.map(member => {
      if (member.member_id === memberId) {
        const updatedAllocations = member.allocations.map(allocation => {
          // Comparação das datas como strings no formato ISO
          if (allocation.date === date.toISOString().split('T')[0]) {
            return {
              ...allocation,
              allocated_hours: parseInt(newHours, 10)
            };
          }
          return allocation;
        });
        return {
          ...member,
          allocations: updatedAllocations
        };
      }
      return member;
    });
    setAllocatedMembers(updatedMembers);
  };

  const handleSaveAllocations = async () => {
    try {
      // Atualiza as alocações no backend
      await axios.put(`${apiConfig.baseUrl}${apiConfig.endpoints.updateAllocations}`, { allocatedMembers });
      // Redireciona de volta para a página de detalhes do projeto ou outra rota necessária
      history.push('/project-details');
    } catch (error) {
      console.error('Error saving allocations:', error);
      // Trate o erro, exiba uma mensagem de erro, etc.
    }
  };

  // Calcula a end_date com base em start_date e remaining_work
  const endDate = calculateEndDate(projectData.start_date, projectData.remaining_work, allocatedMembers);

  // Gera o array de datas entre start_date e end_date
  const dateRange = generateDateRange(new Date(projectData.start_date), endDate);

  return (
    <div className="container">
      <h2>Adjust Allocations</h2>
      <p><strong>Project End Date:</strong> {endDate.toISOString().split('T')[0]}</p>
      <div>
        {allocatedMembers.map(member => (
          <div key={member.member_id}>
            <p><strong>{getMemberName(member.member_id)}</strong> - Allocations:</p>
            {dateRange.map((date, index) => {
              const allocationForDate = member.allocations.find(allocation => allocation.date === date.toISOString().split('T')[0]);
              return (
                <div key={`${member.member_id}-${index}`}>
                  <p>Date: {date.toISOString().split('T')[0]}</p>
                  <label>
                    Allocated Hours:
                    <input
                      type="number"
                      value={allocationForDate ? allocationForDate.allocated_hours : ''}
                      min="1"
                      max="8"
                      onChange={(e) => handleAllocationChange(member.member_id, date, e.target.value)}
                    />
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button className="button" onClick={handleSaveAllocations}>
        Save Allocations
      </button>
    </div>
  );
};

export default AdjustAllocations;
