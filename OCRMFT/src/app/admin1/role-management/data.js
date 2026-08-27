import axios from "axios";

const API = "http://localhost:5000/api/Role";

// Get All Roles
export const getRoles = async () => {
  const res = await axios.get(API);
  return res.data.data;
};

// Get Role By ID
export const getRoleById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data.data;
};

// Add Role
export const addRole = async (data) => {
  const res = await axios.post(API, data);
  return res.data.data;
};

// Update Role
export const updateRole = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data.data;
};

// Delete Role
export const deleteRole = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data.data;
};
