import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { fetchProjectById, fetchTeamMembers, updateProject } from '../../api/api'; // Certifique-se de que updateProject está definido corretamente na API

const EditProject = () => {
  const history = useHistory();
  const { id } = useParams();

  const [project, setProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    allocatedMembers: []
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await fetchProjectById(id);
        setProject(projectData);
        const teamMembersData = await fetchTeamMembers();
        setTeamMembers(teamMembersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProject(id, project);
      history.push('/');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleCancel = () => {
    history.push('/');
  };

  return (
    <div>
      <h2>Edit Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={project.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Start Date:
          <input type="date" name="startDate" value={project.startDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          End Date:
          <input type="date" name="endDate" value={project.endDate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Original Estimate:
          <input type="number" name="originalEstimate" value={project.originalEstimate} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Remaining Work:
          <input type="number" name="remainingWork" value={project.remainingWork} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Allocated Members:
        </label>
        <br />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Allocated Hours</th>
            </tr>
          </thead>
          <tbody>
            {project.allocatedMembers.map((allocation) => {
              const member = teamMembers.find(member => member.id === allocation.memberId);
              if (!member) return null;

              return (
                <tr key={allocation.memberId}>
                  <td>{member.name}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={allocation.allocatedHours}
                      onChange={(e) => {
                        const updatedAllocations = project.allocatedMembers.map(mem =>
                          mem.memberId === allocation.memberId
                            ? { ...mem, allocatedHours: parseInt(e.target.value) }
                            : mem
                        );
                        setProject({ ...project, allocatedMembers: updatedAllocations });
                      }}
                      required
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProject;
