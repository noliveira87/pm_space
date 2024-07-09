import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { calculateEndDate } from '../../utils/dateUtils';
import '../../App.css';

const AddProject = () => {
  const [projectData, setProjectData] = useState({
    id: '',
    name: '',
    start_date: '',
    end_date: '',
    original_estimate: '',
    remaining_work: '',
    allocated_members: []
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const history = useHistory();

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
        allocated_members: [...prevState.allocated_members, {
          member_id: memberId,
          allocations: [{
            date: projectData.start_date,
            allocated_hours: 8
          }]
        }]
      }));
    } else {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: prevState.allocated_members.filter(member => member.member_id !== memberId)
      }));
    }
  };

  const handleCalculateEndDate = () => {
    try {
      const endDate = calculateEndDate(projectData.start_date, projectData.remaining_work, projectData.allocated_members);
      const formattedEndDate = endDate.toISOString().split('T')[0]; // Formata end_date para ISO
      setProjectData(prevState => ({
        ...prevState,
        end_date: formattedEndDate // Atualiza o estado com end_date calculado
      }));
    } catch (error) {
      alert(error.message);
      return; // Impede o redirecionamento em caso de erro
    }
  };

  useEffect(() => {
    if (projectData.end_date) {
      console.log('projectData:', projectData);
      history.push('/adjust-allocations', { projectData });
    }
  }, [projectData.end_date, history, projectData]);

  return (
    <div className="container">
      <h2>Add Project</h2>
      <form className="form">
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
                  checked={projectData.allocated_members.some(m => m.member_id === member.id)}
                />
                {member.name}
              </label>
            </div>
          ))}
        </div>
        <button type="button" className="button" onClick={handleCalculateEndDate}>
          Calculate End Date and Next
        </button>
      </form>
    </div>
  );
};

export default AddProject;
