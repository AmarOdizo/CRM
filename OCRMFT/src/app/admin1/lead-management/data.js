import axios from "axios";

const API_URL = "http://localhost:5000/api/Lead";

// Get All Leads
export const getLeads = async () => {
  const res = await axios.get(API_URL);
  return res.data.data;
};

// Get Single Lead
export const getLeadById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data.data;
};
/*


// Update Lead
export const updateLead = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};*/

// Delete Lead
export const deleteLead = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data.data;
};

// Add Lead

const API = "http://localhost:5000/api/Lead";

export const addLead = async (data) => {
  const res = await axios.post(API, data);
  return res.data.data;
};

const API1_URL = "http://localhost:5000/api/Lead/update";
// Update Lead
export const updateLead = async (id, data) => {
  const res = await axios.put(`${API1_URL}/${id}`, data);
  return res.data.data;
};
