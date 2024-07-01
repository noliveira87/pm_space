import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import apiConfig from '../../config/apiConfig';
import '../../App.css';

const EditProject = () => {
  const { id } = useParams();
  const history = useHistory();

  const [projectData, setProjectData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    original_estimate: '',
    remaining_work: '',
    allocated_members: [],
    imageUrl: ''
  });

  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}/${id}`);
        const project = response.data;
        setProjectData({
          name: project.name,
          start_date: project.start_date ? project.start_date.split('T')[0] : '',
          end_date: project.end_date ? project.end_date.split('T')[0] : '',
          original_estimate: project.original_estimate.toString(),
          remaining_work: project.remaining_work.toString(),
          allocated_members: project.allocated_members.map(member => ({
            memberId: member.id,
            allocatedHours: member.allocated_hours
          })),
          imageUrl: project.imageUrl
        });
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [id]);

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
    const updatedValue = name === 'remaining_work' ? parseInt(value, 10) : value;
    setProjectData({ ...projectData, [name]: updatedValue });
  };

  const handleMemberChange = (e, memberId) => {
    const { checked } = e.target;
    if (checked) {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: [...prevState.allocated_members, { memberId, allocatedHours: 0 }]
      }));
    } else {
      setProjectData(prevState => ({
        ...prevState,
        allocated_members: prevState.allocated_members.filter(member => member.memberId !== memberId)
      }));
    }
  };

  const handleAllocatedHoursChange = (e, memberId) => {
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
      await axios.put(`${apiConfig.baseUrl}${apiConfig.endpoints.projects}/${id}`, {
        ...projectData,
        allocated_members: projectData.allocated_members.map(member => ({
          member_id: member.memberId,
          allocated_hours: member.allocatedHours
        }))
      });
      alert('Project updated successfully!');
      history.push('/');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h2>Edit Project</h2>
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
            <div key={member.id} className="allocated-member">
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
                  onChange={(e) => handleAllocatedHoursChange(e, member.id)}
                  className="input allocated-hours-input"
                />
              )}
            </div>
          ))}
        </div>
        {projectData.imageUrl && (
          <div className="project-image">
            <img src={projectData.imageUrl} alt="Project" />
          </div>
        )}
        <button type="submit" className="button">Update Project</button>
      </form>
    </div>
  );
};

export default EditProject;
