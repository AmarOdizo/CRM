import axios from "axios";

const API = "http://localhost:5000/api/User";

// Get All Users
export const getUsers = async () => {
  const res = await axios.get(API);
  return res.data.data;
};

// Get Single User
export const getUserById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data.data;
};

// Add User
export const addUser = async (data) => {
  const res = await axios.post(API, data);
  return res.data.data;
};

// Delete User
export const deleteUser = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data.data;
};

const API1 = "http://localhost:5000/api/User/update";

// Update User
export const updateUser = async (id, data) => {
  const res = await axios.put(`${API1}/${id}`, data);
  return res.data.data;
};
