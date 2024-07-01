import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import '../../App.css'; // Importa o CSS global

const AddProject = () => {
  const history = useHistory();

  const [projectData, setProjectData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    original_estimate: '',
    remaining_work: '',
    allocated_members: []
  });

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

  const [teamMembers, setTeamMembers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleMemberChange = (e, member_id) => {
    const { checked } = e.target;
    if (checked) {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: [...prevState.allocated_members, { member_id, allocated_hours: 0 }]
      }));
    } else {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: prevState.allocated_members.filter(member => member.member_id !== member_id)
      }));
    }
  };

  const handleHoursChange = (e, member_id) => {
    const { value } = e.target;
    setProjectData(prevState => ({
      ...prevState,
      allocated_members: prevState.allocated_members.map(member => 
        member.member_id === member_id ? { ...member, allocated_hours: parseInt(value, 10) } : member
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}`, projectData);
      alert('Project added successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again later.');
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
          End Date:
          <input
            type="date"
            name="end_date"
            value={projectData.end_date}
            onChange={handleChange}
            required
            className="input"
          />
        </label>
        <label className="label">
          Original Estimate:
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
          Remaining Work:
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
              {projectData.allocated_members.some(m => m.member_id === member.id) && (
                <input
                  type="number"
                  placeholder="Allocated Hours"
                  value={projectData.allocated_members.find(m => m.member_id === member.id)?.allocated_hours || ''}
                  onChange={(e) => handleHoursChange(e, member.id)}
                  className="input"
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
