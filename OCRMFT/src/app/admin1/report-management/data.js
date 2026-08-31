import axios from "axios";

const API = "http://localhost:5000/api/Report";

// Dashboard Summary
export const getDashboardSummary = async () => {
  const res = await axios.get(`${API}/dashboard`);
  return res.data;
};

// Get All Reports
export const getReports = async () => {
  const res = await axios.get(API);
  return res.data;
};

// Get Report By Id
export const getReportById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

// Export CSV
export const exportCSV = async () => {
  const res = await axios.get(`${API}/export/csv`, {
    responseType: "blob",
  });

  return res.data;
};

// Export PDF
export const exportPDF = async () => {
  const res = await axios.get(`${API}/export/pdf`, {
    responseType: "blob",
  });

  return res.data;
};

// Generate Report
export const generateReport = async (reportData) => {
  const res = await axios.post(`${API}/generate`, reportData);
  return res.data;
};
