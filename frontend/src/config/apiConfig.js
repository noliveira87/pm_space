// src/config/apiConfig.js
const apiConfig = {
  baseUrl: 'http://localhost:3001', // URL base da sua API
  endpoints: {
    projects: '/projects',
    teamMembers: '/team_members',
    newProjectId: '/projects/new-id',
    // Adicione outros endpoints conforme necessário
  },
};

export default apiConfig;
