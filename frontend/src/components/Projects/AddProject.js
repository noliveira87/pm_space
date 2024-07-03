// src/components/Projects/AddProject.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // Importa useHistory do react-router-dom
import apiConfig from '../../config/apiConfig';
import { calculateEndDate } from '../../utils/dateUtils';
import '../../App.css'; // Importa o CSS global

const AddProject = () => {
  const [projectData, setProjectData] = useState({
    name: '',
    start_date: '',
    original_estimate: '',
    remaining_work: '',
    allocated_members: []
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const history = useHistory(); // Inicializa o useHistory

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleMemberChange = (e, memberId) => {
    const { checked } = e.target;
    if (checked) {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: [...prevState.allocated_members, { memberId, allocatedHours: 8 }] // Aloca 8 horas por padrão
      }));
    } else {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: prevState.allocated_members.filter(member => member.memberId !== memberId)
      }));
    }
  };

  const handleMemberHoursChange = (e, memberId) => {
    const { value } = e.target;
    setProjectData(prevState => ({
      ...prevState,
      allocated_members: prevState.allocated_members.map(member =>
        member.memberId === memberId ? { ...member, allocatedHours: parseInt(value, 10) } : member
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calcular a data de término usando remaining_work em vez de original_estimate
      const endDate = calculateEndDate(projectData.start_date, projectData.remaining_work, projectData.allocated_members);
      await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`, {
        ...projectData,
        end_date: endDate.toISOString().split('T')[0], // Converte a data para o formato YYYY-MM-DD
        allocated_members: projectData.allocated_members.map(member => ({
          member_id: member.memberId,
          allocated_hours: member.allocatedHours
        }))
      });
      alert('Project created successfully!');
      history.push('/'); // Redireciona para a página inicial
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Add Project</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Name:
          <input
            type="text"
            name="name"
            value={projectData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Start Date:
          <input
            type="date"
            name="start_date"
            value={projectData.start_date}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Original Estimate (hours):
          <input
            type="number"
            name="original_estimate"
            value={projectData.original_estimate}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Remaining Work (hours):
          <input
            type="number"
            name="remaining_work"
            value={projectData.remaining_work}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <div className="label">Allocate Members:</div>
        <div className="allocated-members">
          {teamMembers.map(member => (
            <div key={member.id}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleMemberChange(e, member.id)}
                  checked={projectData.allocated_members.some(m => m.memberId === member.id)}
                />
                {member.name}
              </label>
              {projectData.allocated_members.some(m => m.memberId === member.id) && (
                <input
                  type="number"
                  value={projectData.allocated_members.find(m => m.memberId === member.id).allocatedHours}
                  onChange={(e) => handleMemberHoursChange(e, member.id)}
                  className="input"
                  min="0"
                  max="8" // Limitando as horas alocadas por membro por dia
                />
              )}
            </div>
          ))}
        </div>
        <button type="submit" className="button">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
