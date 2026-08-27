// invoice-management/data.js

const API_URL = "http://localhost:5000/api/Invoice";

// ==================================================
// GET ALL INVOICES
// ==================================================

export const getInvoices = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to fetch invoices.",
    );
  }

  // Supports:
  // [ ... ]
  // { invoices: [...] }
  // { data: [...] }

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.invoices)) {
    return result.invoices;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  return [];
};

// ==================================================
// GET SINGLE INVOICE
// ==================================================

export const getInvoiceById = async (id) => {
  if (!id) {
    throw new Error("Invoice ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to fetch invoice.",
    );
  }

  return result?.invoice || result?.data || result;
};

// ==================================================
// CREATE INVOICE
// ==================================================

export const createInvoice = async (invoiceData) => {
  const response = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(invoiceData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to create invoice.",
    );
  }

  return result;
};

// ==================================================
// UPDATE INVOICE
// ==================================================

export const updateInvoice = async (id, invoiceData) => {
  if (!id) {
    throw new Error("Invoice ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(invoiceData),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to update invoice.",
    );
  }

  return result;
};

// ==================================================
// DELETE INVOICE
// ==================================================

export const deleteInvoice = async (id) => {
  if (!id) {
    throw new Error("Invoice ID is required.");
  }

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || result?.error || "Failed to delete invoice.",
    );
  }

  return result;
};
