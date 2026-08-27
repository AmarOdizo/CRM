import axios from "axios";

const API = "http://localhost:5000/api/Client";

// Get All Clients
export const getClients = async () => {
  const res = await axios.get(API);
  return res.data.data;
};

// Get Client By ID
export const getClientById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data.data;
};

// Add Client
export const addClient = async (data) => {
  const res = await axios.post(API, data);
  return res.data.data;
};

// Update Client
const API1 = "http://localhost:5000/api/Client/update";
export const updateClient = async (id, data) => {
  const res = await axios.put(`${API1}/${id}`, data);
  return res.data.data;
};

// Delete Client
export const deleteClient = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data.data;
};
