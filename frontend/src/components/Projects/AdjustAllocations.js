import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import axios from 'axios';
import apiConfig from '../../config/apiConfig';
import { calculateEndDate } from '../../utils/dateUtils'; // Importa a função calculateEndDate
import '../../App.css';

const AdjustAllocations = () => {
  const location = useLocation();
  const history = useHistory();
  const [projectData, setProjectData] = useState(location.state.projectData || {});

  const generateDates = useCallback((startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);

  const initializeAllocations = useCallback((dates) => {
    setProjectData(prevState => ({
      ...prevState,
      allocated_members: prevState.allocated_members.map(member => ({
        ...member,
        allocations: dates.map(date => {
          const existingAllocation = member.allocations?.find(allocation => allocation.date === date);
          return {
            date,
            allocated_hours: existingAllocation ? existingAllocation.allocated_hours : 8
          };
        })
      }))
    }));
  }, []);

  useEffect(() => {
    const dates = generateDates(projectData.start_date, projectData.end_date);
    if (projectData.start_date && projectData.end_date && projectData.allocated_members.length > 0) {
      initializeAllocations(dates);
    }
  }, [projectData.start_date, projectData.end_date, projectData.allocated_members, generateDates, initializeAllocations]);

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

    const newEndDate = calculateEndDate(projectData.start_date, projectData.remaining_work, projectData.allocated_members);
    setProjectData(prevState => ({
      ...prevState,
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
                    onChange={(e) => handleMemberHoursChange(e, member.member_id, allocation.date)}
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
