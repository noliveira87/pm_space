// api.js
import axios from 'axios';
import apiConfig from '../config/apiConfig';

const API_BASE_URL = apiConfig.baseUrl;

export const fetchProjects = async () => {
  const response = await axios.get(`${API_BASE_URL}/projects`);
  return response.data;
};

export const fetchProjectById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
  return response.data;
};

export const fetchTeamMembers = async () => {
  const response = await axios.get(`${API_BASE_URL}/team_members`);
  return response.data;
};

export const addProject = async (project) => {
  const response = await axios.post(`${API_BASE_URL}/projects`, project);
  return response.data;
};

export const updateProject = async (id, project) => {
  const response = await axios.put(`${API_BASE_URL}/projects/${id}`, project);
  return response.data;
};

export const fetchTeamMemberById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/team_members/${id}`);
  return response.data;
};

export const addTeamMember = async (teamMember) => {
  const response = await axios.post(`${API_BASE_URL}/team_members`, teamMember);
  return response.data;
};

export const updateTeamMember = async (id, teamMember) => {
  const response = await axios.put(`${API_BASE_URL}/team_members/${id}`, teamMember);
  return response.data;
};

export const deleteTeamMember = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/team_members/${id}`);
  return response.data;
};
