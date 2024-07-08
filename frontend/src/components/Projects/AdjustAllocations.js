import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { calculateEndDate } from '../../utils/dateUtils';
import apiConfig from '../../config/apiConfig';

const AdjustAllocations = (props) => {
  const { projectData } = props.location.state;
  const [allocatedMembers, setAllocatedMembers] = useState(projectData.allocated_members);
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

  const getMemberName = (memberId) => {
    const member = teamMembers.find(member => member.id === memberId);
    return member ? member.name : 'Unknown';
  };

  const generateDateRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const handleAllocationChange = (memberId, date, newHours) => {
    const updatedMembers = allocatedMembers.map(member => {
      if (member.member_id === memberId) {
        const updatedAllocations = member.allocations.map(allocation => {
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
      await axios.put(`${apiConfig.baseUrl}${apiConfig.endpoints.updateAllocations}`, { allocatedMembers });
      history.push('/project-details');
    } catch (error) {
      console.error('Error saving allocations:', error);
      alert('Failed to save allocations. Please try again later.');
    }
  };

  const endDate = calculateEndDate(projectData.start_date, projectData.remaining_work, allocatedMembers);
  const dateRange = generateDateRange(new Date(projectData.start_date), endDate);

  return (
    <div className="container">
      <h2>Adjust Allocations</h2>
      <p><strong>Project End Date:</strong> {endDate.toISOString().split('T')[0]}</p>
      <div className="allocation-table">
        <table>
          <thead>
            <tr>
              <th>Member</th>
              {dateRange.map((date, index) => (
                <th key={index}>{date.toISOString().split('T')[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allocatedMembers.map((member) => (
              <tr key={member.member_id}>
                <td>{getMemberName(member.member_id)}</td>
                {dateRange.map((date, index) => {
                  const allocation = member.allocations.find(allocation => allocation.date === date.toISOString().split('T')[0]);
                  return (
                    <td key={`${member.member_id}-${index}`}>
                      <input
                        type="number"
                        value={allocation ? allocation.allocated_hours : ''}
                        min="1"
                        max="8"
                        onChange={(e) => handleAllocationChange(member.member_id, date, e.target.value)}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="button" onClick={handleSaveAllocations}>
        Save Allocations
      </button>
    </div>
  );
};

export default AdjustAllocations;
