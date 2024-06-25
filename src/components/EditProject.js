// components/EditProject.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProject = ({ editProject }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado local para armazenar os dados do projeto em edição
  const [project, setProject] = useState({
    name: '',
    startDate: '',
    endDate: '',
    originalEstimate: '',
    remainingWork: '',
    selectedTeamMembers: []
  });

  // Efeito para carregar os dados do projeto ao montar o componente
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const selectedProject = projects.find((p) => p.id === parseInt(id));
    if (selectedProject) {
      setProject({
        name: selectedProject.name,
        startDate: selectedProject.startDate,
        endDate: selectedProject.endDate,
        originalEstimate: selectedProject.originalEstimate,
        remainingWork: selectedProject.remainingWork,
        selectedTeamMembers: selectedProject.selectedTeamMembers || []
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setProject({ ...project, selectedTeamMembers: selectedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editProject(parseInt(id), project); // Editar projeto com os novos dados
    navigate('/'); // Redirecionar de volta para a página inicial
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Edit Project</h1>
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
          Project Members:
          <select
            name="selectedTeamMembers"
            multiple
            value={project.selectedTeamMembers}
            onChange={handleSelectChange}
            required
          >
            {project.selectedTeamMembers.map((memberId) => (
              <option key={memberId} value={memberId}>
                Member {memberId} {/* Aqui deve exibir o nome do membro com base no ID */}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Update Project</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProject;
