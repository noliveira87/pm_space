import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProject = ({ projects, editProject, teamMembers }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estado local para controlar o formulário de edição
  const [project, setProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    allocatedMembers: []
  });

  // Carregar os detalhes do projeto com base no ID fornecido
  useEffect(() => {
    const selectedProject = projects.find(project => project.id === parseInt(id));
    if (selectedProject) {
      setProject(selectedProject);
    }
  }, [id, projects]);

  // Manipulador de alteração de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    editProject(project.id, project.name, project.allocatedMembers);
    navigate('/');
  };

  // Manipulador de cancelamento
  const handleCancel = () => {
    navigate('/');
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
          {project.allocatedMembers && project.allocatedMembers.map((allocation) => {
  // Verifica se allocation é definido antes de continuar
  if (!allocation) return null;

  const member = teamMembers.find(member => member.id === allocation.memberId);
  // Verifica se member é definido antes de continuar
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
