import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import '../../App.css';

const AdjustAllocations = () => {
  const location = useLocation();
  const history = useHistory();
  const [projectData, setProjectData] = useState(location.state.projectData || {});
  const [endDate, setEndDate] = useState('');

  const generateDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  useEffect(() => {
    if (projectData.start_date && projectData.end_date) {
      const dates = generateDates(projectData.start_date, projectData.end_date);
      // Atualiza o estado com as datas geradas
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: prevState.allocated_members.map(member => ({
          ...member,
          allocations: dates.map(date => ({
            date,
            allocated_hours: member.allocations.find(a => a.date === date)?.allocated_hours || 0
          }))
        }))
      }));
    }
  }, [projectData.start_date, projectData.end_date]);

  useEffect(() => {
    if (projectData.end_date) {
      setEndDate(projectData.end_date);
    }
  }, [projectData.end_date]);

  const handleMemberHoursChange = (e, memberId, date) => {
    const { value } = e.target;
    setProjectData(prevState => ({
      ...prevState,
      allocated_members: prevState.allocated_members.map(member =>
        member.member_id === memberId ? {
          ...member,
          allocations: member.allocations.map(allocation =>
            allocation.date === date ? { ...allocation, allocated_hours: parseInt(value, 10) } : allocation
          )
        } : member
      )
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
      {endDate && (
        <p>End Date: {endDate}</p>
      )}
      <form className="form" onSubmit={handleSubmit}>
        {projectData.allocated_members && projectData.allocated_members.length > 0 ? (
          projectData.allocated_members.flatMap(member =>
            member.allocations.map(allocation => ({
              member,
              allocation
            }))
          ).map(({ member, allocation }) => (
            <div key={`${member.member_id}-${allocation.date}`}>
              <h3>{allocation.date}</h3>
              <label>
                {member.name}:
                <input
                  type="number"
                  value={allocation.allocated_hours}
                  onChange={(e) => handleMemberHoursChange(e, member.member_id, allocation.date)}
                  className="input"
                  min="0"
                  max="8"
                />
              </label>
            </div>
          ))
        ) : (
          <p>No allocations to display.</p>
        )}
        <button type="submit" className="button">Save Project</button>
      </form>
    </div>
  );
};

export default AdjustAllocations;
