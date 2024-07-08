import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { calculateEndDate } from '../../utils/dateUtils';
import '../../App.css';

const AdjustAllocations = () => {
  const location = useLocation();
  const history = useHistory();
  const [projectData, setProjectData] = useState(location.state.projectData || {});

  useEffect(() => {
    if (!projectData.start_date || !projectData.end_date || projectData.allocated_members.length === 0) {
      // Redireciona de volta para a página de adicionar projeto se os dados necessários não estiverem presentes
      history.push('/add-project');
    }
  }, [projectData.start_date, projectData.end_date, projectData.allocated_members, history]);

  const handleMemberHoursChange = (memberId, date, newValue) => {
    const updatedMembers = projectData.allocated_members.map(member =>
      member.member_id === memberId ? {
        ...member,
        allocations: member.allocations.map(allocation =>
          allocation.date === date ? { ...allocation, allocated_hours: newValue } : allocation
        )
      } : member
    );

    const newEndDate = calculateEndDate(projectData.start_date, projectData.remaining_work, updatedMembers);

    setProjectData(prevState => ({
      ...prevState,
      allocated_members: updatedMembers,
      end_date: newEndDate.toISOString().split('T')[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`, {
        ...projectData,
        allocated_members: projectData.allocated_members.map(member => ({
          member_id: member.member_id,
          allocations: member.allocations.map(allocation => ({
            date: allocation.date,
            allocated_hours: allocation.allocated_hours
          }))
        }))
      });

      alert('Project created successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Adjust Allocations</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          End Date:
          <input
            type="text"
            value={projectData.end_date}
            readOnly
            className="input"
          />
        </label>
        {projectData.allocated_members && projectData.allocated_members.map(member => (
          <div key={member.member_id}>
            <h3>{member.name}</h3>
            {member.allocations.map(allocation => (
              <div key={allocation.date}>
                <label>
                  {allocation.date}:
                  <input
                    type="number"
                    value={allocation.allocated_hours}
                    onChange={(e) => handleMemberHoursChange(member.member_id, allocation.date, parseInt(e.target.value, 10))}
                    className="input"
                    min="0"
                    max="8"
                  />
                </label>
              </div>
            ))}
          </div>
        ))}
        <button type="submit" className="button">Save Project</button>
      </form>
    </div>
  );
};

export default AdjustAllocations;
