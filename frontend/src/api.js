import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const fetchProjects = async () => {
  const response = await axios.get(`${API_URL}/projects`);
  return response.data;
};

export const fetchProjectById = async (id) => {
  const response = await axios.get(`${API_URL}/projects/${id}`);
  return response.data;
};

export const addProject = async (project) => {
  const response = await axios.post(`${API_URL}/projects`, project);
  return response.data;
};

export const fetchTeamMembers = async () => {
  const response = await axios.get(`${API_URL}/team_members`);
  return response.data;
};

export const addTeamMember = async (member) => {
  const response = await axios.post(`${API_URL}/team_members`, member);
  return response.data;
};
