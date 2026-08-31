// ============================================================
// QUOTATION API
// ============================================================

const API_URL = "http://localhost:5000/api/Quotation";

// ============================================================
// COMMON RESPONSE HANDLER
// ============================================================

const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Invalid response from server.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong.");
  }

  return data;
};

// ============================================================
// CREATE QUOTATION
// POST /api/Quotation
// ============================================================

export const createQuotation = async (quotationData) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(quotationData),
  });

  return handleResponse(response);
};

// ============================================================
// GET ALL QUOTATIONS
// GET /api/Quotation
// ============================================================

export const getQuotations = async () => {
  const response = await fetch(API_URL, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },

    cache: "no-store",
  });

  return handleResponse(response);
};

// ============================================================
// GET SINGLE QUOTATION
// GET /api/Quotation/:id
// ============================================================

export const getQuotationById = async (id) => {
  if (!id) {
    throw new Error("Quotation ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },

    cache: "no-store",
  });

  return handleResponse(response);
};

// ============================================================
// GET CUSTOMER-WISE QUOTATIONS
// GET /api/Quotation/customer/:customerId
// ============================================================

export const getQuotationsByCustomer = async (customerId) => {
  if (!customerId) {
    throw new Error("Customer ID is required.");
  }

  const response = await fetch(`${API_URL}/customer/${customerId}`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },

    cache: "no-store",
  });

  return handleResponse(response);
};

// ============================================================
// UPDATE QUOTATION
// PUT /api/Quotation/:id
// ============================================================

export const updateQuotation = async (id, quotationData) => {
  if (!id) {
    throw new Error("Quotation ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(quotationData),
  });

  return handleResponse(response);
};

// ============================================================
// UPDATE QUOTATION STATUS
// PUT /api/Quotation/:id/status
// ============================================================

export const updateQuotationStatus = async (id, status) => {
  if (!id) {
    throw new Error("Quotation ID is required.");
  }

  if (!status) {
    throw new Error("Quotation status is required.");
  }

  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      status,
    }),
  });

  return handleResponse(response);
};

// ============================================================
// DELETE QUOTATION
// DELETE /api/Quotation/:id
// ============================================================

export const deleteQuotation = async (id) => {
  if (!id) {
    throw new Error("Quotation ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
    },
  });

  return handleResponse(response);
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

const quotationAPI = {
  createQuotation,
  getQuotations,
  getQuotationById,
  getQuotationsByCustomer,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation,
};

export default quotationAPI;
