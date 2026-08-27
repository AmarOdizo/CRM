import axios from "axios";

const API = "http://localhost:5000/api/Project";

// Get All Projects
export const getProjects = async () => {
  const res = await axios.get(API);
  return res.data.data;
};

// Get Project By Id
export const getProjectById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data.data;
};

// Add Project
export const addProject = async (data) => {
  const res = await axios.post(API, data);
  return res.data.data;
};

// Update Project
export const updateProject = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data.data;
};

// Delete Project
export const deleteProject = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data.data;
};
